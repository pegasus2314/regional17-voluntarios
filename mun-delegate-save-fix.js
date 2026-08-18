/* Regional 17 · MUN · definitive delegate persistence fix */
(() => {
  'use strict';
  const KEY = 'r17_mun_state_v2';
  const REOPEN = 'r17_mun_reopen_after_delegate_save';
  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || '{"models":[],"selectedModel":null,"selectedCommission":null}'); }
    catch { return {models:[],selectedModel:null,selectedCommission:null}; }
  };
  const write = s => localStorage.setItem(KEY, JSON.stringify(s));
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function showError(panel, message) {
    const e = panel.querySelector('#dpError');
    if (e) { e.textContent = message; e.style.display = 'block'; }
  }

  async function saveDelegate(panel) {
    const state = read();
    const model = state.models.find(m => String(m.id) === String(state.selectedModel));
    const commission = model?.commissions?.find(c => String(c.id) === String(state.selectedCommission));
    if (!model || !commission) { showError(panel, 'No se encontró la comisión seleccionada. Vuelve a entrar a la comisión e inténtalo.'); return false; }

    const name = panel.querySelector('#dpName')?.value.trim() || '';
    const countrySelect = panel.querySelector('#dpCountry');
    const countryCode = countrySelect?.value || 'DO';
    const countryMap = {
      DO:['República Dominicana','🇩🇴'],US:['Estados Unidos','🇺🇸'],CN:['China','🇨🇳'],FR:['Francia','🇫🇷'],RU:['Rusia','🇷🇺'],GB:['Reino Unido','🇬🇧'],PS:['Palestina','🇵🇸'],MX:['México','🇲🇽'],BR:['Brasil','🇧🇷'],CO:['Colombia','🇨🇴'],ES:['España','🇪🇸'],DE:['Alemania','🇩🇪'],AR:['Argentina','🇦🇷'],CL:['Chile','🇨🇱'],PE:['Perú','🇵🇪'],UY:['Uruguay','🇺🇾'],EC:['Ecuador','🇪🇨'],BO:['Bolivia','🇧🇴'],CR:['Costa Rica','🇨🇷'],PA:['Panamá','🇵🇦'],GT:['Guatemala','🇬🇹'],HN:['Honduras','🇭🇳'],SV:['El Salvador','🇸🇻'],NI:['Nicaragua','🇳🇮'],CA:['Canadá','🇨🇦'],JP:['Japón','🇯🇵'],KR:['Corea del Sur','🇰🇷'],IN:['India','🇮🇳'],IT:['Italia','🇮🇹'],PT:['Portugal','🇵🇹'],NL:['Países Bajos','🇳🇱'],SE:['Suecia','🇸🇪'],NO:['Noruega','🇳🇴'],CH:['Suiza','🇨🇭'],ZA:['Sudáfrica','🇿🇦'],EG:['Egipto','🇪🇬'],NG:['Nigeria','🇳🇬'],KE:['Kenia','🇰🇪'],AU:['Australia','🇦🇺']
    };
    const country = countryMap[countryCode] || ['País no especificado','🌎'];
    const email = panel.querySelector('#dpEmail')?.value.trim() || '';
    if (!name) { showError(panel, 'El nombre completo es obligatorio.'); return false; }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) { showError(panel, 'Revisa el correo electrónico.'); return false; }
    if (!Array.isArray(commission.delegations)) commission.delegations = [];
    const duplicate = commission.delegations.some(d => String(d.name || '').trim().toLowerCase() === name.toLowerCase() && String(d.country || '') === country[0]);
    if (duplicate) { showError(panel, 'Este delegado ya está registrado en esta comisión.'); return false; }

    const delegate = {
      id: crypto.randomUUID(),
      country: country[0],
      name,
      email,
      phone: panel.querySelector('#dpPhone')?.value.trim() || '',
      district: panel.querySelector('#dpDistrict')?.value || '',
      institution: panel.querySelector('#dpInstitution')?.value.trim() || '',
      role: panel.querySelector('#dpRole')?.value || 'Delegado',
      attendance: false,
      result: 'pendiente',
      code: countryCode,
      flag: country[1]
    };

    commission.delegations.push(delegate);
    state.selectedModel = model.id;
    state.selectedCommission = commission.id;
    write(state);

    // Verify persistence before closing anything.
    const verify = read();
    const vm = verify.models.find(m => String(m.id) === String(model.id));
    const vc = vm?.commissions?.find(c => String(c.id) === String(commission.id));
    const exists = vc?.delegations?.some(d => String(d.id) === String(delegate.id));
    if (!exists) { showError(panel, 'El navegador rechazó el guardado local. No se cerró el formulario.'); return false; }

    localStorage.setItem(REOPEN, JSON.stringify({modelId:model.id, commissionId:commission.id}));
    return true;
  }

  // Capture the Save button before the old handler. This prevents the stale renderer
  // from saving an outdated in-memory object over the freshly persisted delegate.
  document.addEventListener('click', async event => {
    const button = event.target.closest?.('#r17DelegatePanel .dp-save');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (button.disabled) return;
    const panel = document.getElementById('r17DelegatePanel');
    if (!panel) return;
    button.disabled = true;
    button.textContent = 'Guardando…';
    try {
      const ok = await saveDelegate(panel);
      if (!ok) { button.disabled = false; button.textContent = 'Guardar delegado'; return; }
      panel.remove();
      // Full reload forces mun-replace.js to read the new localStorage state.
      // The reopen marker restores the exact model/commission after boot.
      location.reload();
    } catch (err) {
      console.error('MUN delegate save:', err);
      showError(panel, err?.message || 'No se pudo guardar el delegado.');
      button.disabled = false;
      button.textContent = 'Guardar delegado';
    }
  }, true);

  function reopen() {
    let target = null;
    try { target = JSON.parse(localStorage.getItem(REOPEN) || 'null'); } catch {}
    if (!target) return;
    localStorage.removeItem(REOPEN);
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      const nav = document.querySelector('[data-mun-view]');
      if (!nav) { if (tries > 30) clearInterval(timer); return; }
      clearInterval(timer);
      nav.click();
      setTimeout(() => {
        const model = document.querySelector(`[data-model="${CSS.escape(target.modelId)}"]`);
        if (!model) return;
        model.click();
        setTimeout(() => {
          document.querySelector(`[data-com="${CSS.escape(target.commissionId)}"]`)?.click();
        }, 120);
      }, 180);
    }, 250);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', reopen, {once:true});
  else setTimeout(reopen, 400);
})();
