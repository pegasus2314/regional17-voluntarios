/* Regional 17 — evaluación por criterios */
(() => {
  'use strict';
  const cfg = window.RV_CONFIG || {};
  const wait = (fn, ms = 250) => setTimeout(fn, ms);
  const esc = v => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  let client = null;

  async function getClient() {
    if (client) return client;
    if (!window.supabase || !cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) throw new Error('Supabase no configurado');
    client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    return client;
  }

  async function canEvaluate() {
    const sb = await getClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return false;
    const { data, error } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (error) throw error;
    return ['admin','coordinador'].includes(data?.role);
  }

  function toast(msg, type = 'success') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }

  function openEvaluation(participationId) {
    getClient().then(async sb => {
      if (!(await canEvaluate())) return toast('Solo administradores y coordinadores pueden evaluar.', 'error');
      const [{ data: criteria, error: ce }, { data: current, error: ee }] = await Promise.all([
        sb.from('criterios_evaluacion').select('*').eq('activo', true).order('orden'),
        sb.from('evaluaciones_criterios').select('*').eq('participacion_id', participationId)
      ]);
      if (ce || ee) throw (ce || ee);
      const existing = new Map((current || []).map(x => [x.criterio_id, x]));
      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      overlay.innerHTML = `<div class="modal evaluation-modal"><div class="modal-head"><div><h3>Evaluación del voluntario</h3><p class="muted">Evalúa cada criterio de 0 a 100.</p></div><button class="icon-btn" data-close>×</button></div><div class="modal-body"><form id="evaluationForm"><div class="evaluation-list">${(criteria || []).map(c => { const x = existing.get(c.id); return `<div class="evaluation-item"><div class="evaluation-top"><div><strong>${esc(c.nombre)}</strong><small>${esc(c.descripcion || '')}</small></div><b class="evaluation-value" data-value="${c.id}">${Number(x?.puntuacion ?? 0)}</b></div><div class="evaluation-meta"><span>Peso ${Number(c.peso).toFixed(0)}%</span><input type="range" min="0" max="100" step="1" name="score_${c.id}" value="${Number(x?.puntuacion ?? 0)}"><input class="score-number" type="number" min="0" max="100" step="1" name="score_num_${c.id}" value="${Number(x?.puntuacion ?? 0)}"></div><textarea name="obs_${c.id}" placeholder="Observación opcional">${esc(x?.observacion || '')}</textarea></div>`; }).join('')}</div><div class="evaluation-summary"><span>Resultado ponderado</span><strong id="evalTotal">0</strong><small>/100</small></div><div class="modal-actions"><button type="button" class="btn" data-close>Cancelar</button><button class="btn primary" type="submit">Guardar evaluación</button></div></form></div></div>`;
      document.body.appendChild(overlay);
      const close = () => overlay.remove();
      overlay.querySelector('[data-close]').onclick = close;
      overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
      const total = () => {
        let weighted = 0, weights = 0;
        (criteria || []).forEach(c => { const n = Number(overlay.querySelector(`[name="score_num_${c.id}"]`)?.value || 0); weighted += n * Number(c.peso || 0); weights += Number(c.peso || 0); });
        overlay.querySelector('#evalTotal').textContent = weights ? (weighted / weights).toFixed(1) : '0.0';
      };
      (criteria || []).forEach(c => {
        const range = overlay.querySelector(`[name="score_${c.id}"]`), number = overlay.querySelector(`[name="score_num_${c.id}"]`), value = overlay.querySelector(`[data-value="${c.id}"]`);
        range.oninput = () => { number.value = range.value; value.textContent = range.value; total(); };
        number.oninput = () => { let n = Math.max(0, Math.min(100, Number(number.value || 0))); number.value = n; range.value = n; value.textContent = n; total(); };
      });
      total();
      overlay.querySelector('#evaluationForm').onsubmit = async e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        try {
          const { data: { user } } = await sb.auth.getUser();
          const rows = (criteria || []).map(c => ({
            participacion_id: participationId,
            criterio_id: c.id,
            puntuacion: Math.max(0, Math.min(100, Number(fd.get(`score_num_${c.id}`) || 0))),
            observacion: String(fd.get(`obs_${c.id}`) || '').trim() || null,
            evaluado_por: user?.id || null,
            updated_at: new Date().toISOString()
          }));
          const { error } = await sb.from('evaluaciones_criterios').upsert(rows, { onConflict: 'participacion_id,criterio_id' });
          if (error) throw error;
          const weighted = rows.reduce((s, r) => { const c = criteria.find(x => x.id === r.criterio_id); return s + r.puntuacion * Number(c?.peso || 0); }, 0) / Math.max(1, (criteria || []).reduce((s, c) => s + Number(c.peso || 0), 0));
          const { error: pe } = await sb.from('participaciones').update({ evaluacion: Number(weighted.toFixed(2)) }).eq('id', participationId);
          if (pe) throw pe;
          close();
          toast(`Evaluación guardada: ${weighted.toFixed(1)}/100`);
        } catch (err) {
          console.error(err);
          toast('No se pudo guardar la evaluación.', 'error');
        }
      };
    }).catch(err => { console.error(err); toast('No se pudo abrir la evaluación.', 'error'); });
  }

  function enhanceParticipationModal() {
    const overlays = [...document.querySelectorAll('.overlay')];
    overlays.forEach(o => {
      if (o.dataset.evaluationEnhanced) return;
      const table = o.querySelector('#ptbody');
      if (!table) return;
      o.dataset.evaluationEnhanced = '1';
      table.querySelectorAll('[data-edit-p]').forEach(btn => {
        const action = document.createElement('button');
        action.className = 'icon-action';
        action.textContent = 'Evaluar';
        action.title = 'Evaluar por criterios';
        action.dataset.evaluateP = btn.dataset.editP;
        btn.parentElement.insertBefore(action, btn);
      });
    });
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-evaluate-p]');
    if (btn) { e.preventDefault(); e.stopPropagation(); openEvaluation(btn.dataset.evaluateP); }
  }, true);

  const observer = new MutationObserver(() => enhanceParticipationModal());
  observer.observe(document.body, { childList: true, subtree: true });
  wait(enhanceParticipationModal, 300);
})();
