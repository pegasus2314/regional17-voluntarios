/* Regional 17 — announcement editing enhancement */
(() => {
  'use strict';
  const cfg = window.RV_CONFIG || {};
  let sb = null;
  const client = () => {
    if (!sb && window.supabase && cfg.SUPABASE_URL) sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    return sb;
  };
  const esc = v => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const toast = (message, type = 'success') => {
    const e = document.createElement('div');
    e.className = `toast${type === 'error' ? ' error' : ''}`;
    e.textContent = message;
    document.body.appendChild(e);
    setTimeout(() => e.remove(), 3500);
  };
  async function canManage() {
    const s = client();
    if (!s) return false;
    const { data: { user } } = await s.auth.getUser();
    if (!user) return false;
    const { data: p } = await s.from('profiles').select('role').eq('id', user.id).maybeSingle();
    return !!p && ['admin', 'comunicacion'].includes(p.role);
  }
  function addEditButtons() {
    document.querySelectorAll('[data-ann-del]').forEach(del => {
      const card = del.closest('.announcement-card');
      if (!card || card.querySelector('[data-ann-edit]')) return;
      const id = del.dataset.annDel;
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'icon-action';
      edit.dataset.annEdit = id;
      edit.textContent = 'Editar';
      edit.addEventListener('click', () => editAnnouncement(id));
      del.parentElement?.insertBefore(edit, del);
    });
  }
  async function editAnnouncement(id) {
    const s = client();
    if (!s || !(await canManage())) return toast('No tienes permiso para editar anuncios.', 'error');
    const { data: a, error } = await s.from('announcements').select('id,title,content,priority,expires_at').eq('id', id).maybeSingle();
    if (error || !a) return toast(error?.message || 'No se encontró el anuncio.', 'error');
    const o = document.createElement('div');
    o.className = 'overlay';
    const expiry = a.expires_at ? new Date(a.expires_at).toISOString().slice(0,16) : '';
    o.innerHTML = `<div class="modal"><div class="modal-head"><h3>Editar anuncio</h3><button class="icon-btn" data-close>×</button></div><div class="modal-body"><form id="editAnnouncementForm"><field label="Título del anuncio"><input name="title" required value="${esc(a.title)}"></field><field label="Contenido"><textarea name="content" required>${esc(a.content)}</textarea></field><field label="Prioridad"><select name="priority"><option value="normal" ${a.priority==='normal'?'selected':''}>Normal</option><option value="important" ${a.priority==='important'?'selected':''}>Importante</option><option value="urgent" ${a.priority==='urgent'?'selected':''}>Urgente</option></select></field><field label="Fecha de expiración (opcional)"><input name="expires_at" type="datetime-local" value="${expiry}"></field><div class="modal-actions"><button type="button" class="btn" data-close>Cancelar</button><button class="btn primary">Guardar cambios</button></div></form></div></div>`;
    document.body.appendChild(o);
    o.querySelectorAll('[data-close]').forEach(b => b.onclick = () => o.remove());
    o.querySelector('#editAnnouncementForm').onsubmit = async e => {
      e.preventDefault();
      const f = new FormData(e.target), btn = e.submitter;
      btn.disabled = true;
      const rawExpiry = String(f.get('expires_at') || '').trim();
      const { error: updateError } = await s.from('announcements').update({
        title: String(f.get('title')).trim(),
        content: String(f.get('content')).trim(),
        priority: String(f.get('priority')),
        expires_at: rawExpiry ? new Date(rawExpiry).toISOString() : null,
        updated_at: new Date().toISOString()
      }).eq('id', id);
      if (updateError) { btn.disabled = false; return toast(updateError.message, 'error'); }
      o.remove();
      toast('Anuncio actualizado correctamente');
      document.querySelector('[data-r17-comm="announcements"]')?.click();
    };
  }
  function boot() {
    const observer = new MutationObserver(addEditButtons);
    observer.observe(document.body, { childList: true, subtree: true });
    addEditButtons();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
})();
