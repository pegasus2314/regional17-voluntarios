/* Regional 17 Volunteers — Educational Resource Library */
(() => {
  'use strict';

  const BUCKET = 'educational-library';
  const MAX_BYTES = 50 * 1024 * 1024;
  const CATEGORIES = ['Guías y manuales','Material para talleres','Presentaciones','Plantillas','Documentos educativos','Actividades y dinámicas','Recursos multimedia','Otros'];

  const esc = (v) => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const client = () => window.__R17_SUPABASE_CLIENT || (window.supabase?.createClient ? window.supabase.createClient(window.RV_CONFIG.SUPABASE_URL, window.RV_CONFIG.SUPABASE_ANON_KEY) : null);
  const isManager = () => ['admin','coordinador','comunicacion'].includes(window.__R17_PROFILE_ROLE || '');
  const fmtSize = (n) => {
    n = Number(n || 0);
    if (!n) return '—';
    const units = ['B','KB','MB','GB']; let i = 0;
    while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
    return `${n.toFixed(i ? 1 : 0)} ${units[i]}`;
  };
  const fileIcon = (mime='') => mime.includes('pdf') ? '📕' : mime.includes('word') || mime.includes('document') ? '📘' : mime.includes('presentation') ? '📊' : mime.includes('spreadsheet') || mime.includes('excel') ? '📗' : mime.startsWith('image/') ? '🖼️' : mime.startsWith('video/') ? '🎬' : mime.startsWith('audio/') ? '🎧' : '📄';
  const toast = (message, type='success') => {
    const el = document.createElement('div'); el.className = `toast ${type}`; el.textContent = message; document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  };
  const getContent = () => document.getElementById('content');

  function injectNav() {
    const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    if (!descriptor?.set || window.__R17_LIBRARY_INNERHTML_PATCHED) return;
    const nativeSet = descriptor.set;
    Object.defineProperty(Element.prototype, 'innerHTML', {
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      get: descriptor.get,
      set(value) {
        if (this.id === 'app' && typeof value === 'string' && value.includes('<nav>') && !value.includes('data-view="library"')) {
          value = value.replace('</nav>', '<button data-view="library" class="nav-item"><span>📚</span>Biblioteca</button></nav>');
        }
        nativeSet.call(this, value);
      }
    });
    window.__R17_LIBRARY_INNERHTML_PATCHED = true;
  }

  async function loadResources() {
    const sb = client();
    if (!sb) throw new Error('Supabase no está disponible');
    const { data, error } = await sb.from('library_resources').select('*').eq('is_active', true).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  function render(resources, q='', category='all') {
    const term = q.trim().toLowerCase();
    const filtered = resources.filter(r => {
      const hay = [r.title, r.description, r.category, ...(r.tags || []), r.file_name].join(' ').toLowerCase();
      return (!term || hay.includes(term)) && (category === 'all' || r.category === category);
    });
    const manager = isManager();
    return `<div class="library-shell">
      <div class="hero" style="margin-bottom:16px"><div><span class="hero-kicker">CENTRO DE RECURSOS</span><h2>Biblioteca educativa</h2><p>Materiales para talleres, guías, presentaciones, plantillas y recursos para la labor regional.</p></div><div class="hero-orb">📚</div></div>
      <div class="toolbar"><div class="search"><span>⌕</span><input id="librarySearch" placeholder="Buscar por título, descripción, categoría o etiqueta…" value="${esc(q)}"></div><select id="libraryCategory"><option value="all">Todas las categorías</option>${CATEGORIES.map(c => `<option value="${esc(c)}" ${category===c?'selected':''}>${esc(c)}</option>`).join('')}</select>${manager ? '<button class="btn primary" id="libraryUpload">＋ Subir recurso</button>' : ''}</div>
      <div class="panel" style="margin-bottom:15px"><div class="panel-head"><div><h3>${filtered.length} recurso${filtered.length===1?'':'s'}</h3><p>Selecciona un recurso para abrirlo o descargarlo.</p></div></div></div>
      <div class="library-grid">${filtered.length ? filtered.map(card).join('') : '<div class="panel" style="grid-column:1/-1">'+empty('📚','No encontramos recursos','Prueba con otra búsqueda o categoría.')+'</div>'}</div>
    </div>`;
  }

  function empty(icon,title,text) { return `<div class="empty"><div class="empty-icon">${icon}</div><h3>${esc(title)}</h3><p>${esc(text)}</p></div>`; }

  function card(r) {
    const tags = (r.tags || []).slice(0,4).map(t => `<span class="pill neutral">${esc(t)}</span>`).join('');
    return `<article class="library-card" data-resource-id="${esc(r.id)}"><div class="library-icon">${fileIcon(r.mime_type)}</div><div class="grow"><div class="library-meta"><span class="pill neutral">${esc(r.category)}</span><small>${esc(fmtSize(r.size_bytes))}</small></div><h3>${esc(r.title)}</h3><p>${esc(r.description || 'Sin descripción adicional.')}</p><div class="library-tags">${tags}</div><small class="library-file">${esc(r.file_name)}</small><div class="card-actions"><button class="btn small" data-library-open="${esc(r.id)}">Abrir</button><button class="btn small primary" data-library-download="${esc(r.id)}">Descargar</button>${isManager()?`<button class="btn small danger" data-library-delete="${esc(r.id)}">Eliminar</button>`:''}</div></div></article>`;
  }

  function uploadModal(resources) {
    const o = document.createElement('div');
    o.className = 'overlay';
    o.innerHTML = `<div class="modal"><div class="modal-head"><div><h3>Subir recurso educativo</h3><p style="font-size:10px;color:#6b778c;margin:4px 0 0">Completa la información para que todos puedan encontrarlo fácilmente.</p></div><button class="icon-btn" data-close>×</button></div><div class="modal-body"><form id="libraryForm">
      <div class="form-grid"><field><label>Título del recurso</label><input name="title" required placeholder="Ej.: Guía para taller de liderazgo"></field><field><label>Categoría</label><select name="category">${CATEGORIES.map(c=>`<option>${esc(c)}</option>`).join('')}</select></field></div>
      <field><label>Descripción</label><textarea name="description" placeholder="Explica qué contiene el recurso y para qué puede utilizarse."></textarea></field>
      <field><label>Etiquetas</label><input name="tags" placeholder="Ej.: liderazgo, taller, docentes, dinámica"><small style="display:block;color:#7b8798;font-size:9px;margin-top:4px">Separa las etiquetas con comas para facilitar las búsquedas.</small></field>
      <field><label>Archivo</label><input name="file" type="file" required accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.png,.jpg,.jpeg,.webp,.mp4,.mp3"><small style="display:block;color:#7b8798;font-size:9px;margin-top:4px">Aquí va el archivo que quieres compartir. Máximo 50 MB.</small></field>
      <div class="modal-actions"><button type="button" class="btn" data-close>Cancelar</button><button class="btn primary">Subir recurso</button></div>
    </form></div></div>`;
    document.body.appendChild(o);
    o.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>o.remove());
    o.querySelector('#libraryForm').onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target); const file = fd.get('file');
      if (!(file instanceof File) || !file.size) return toast('Selecciona un archivo.', 'error');
      if (file.size > MAX_BYTES) return toast('El archivo supera el límite de 50 MB.', 'error');
      const title = String(fd.get('title') || '').trim(); if (!title) return toast('El título es obligatorio.', 'error');
      const tags = String(fd.get('tags') || '').split(',').map(x=>x.trim()).filter(Boolean).slice(0,12);
      const safeName = file.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
      const path = `${new Date().getFullYear()}/${String(new Date().getMonth()+1).padStart(2,'0')}/${crypto.randomUUID()}-${safeName || 'recurso'}`;
      const sb = client(); const button = e.target.querySelector('button[type="submit"]'); button.disabled=true; button.textContent='Subiendo…';
      try {
        const { error: upErr } = await sb.storage.from(BUCKET).upload(path, file, { contentType: file.type || 'application/octet-stream', upsert: false, cacheControl: '3600' });
        if (upErr) throw upErr;
        const { data: auth } = await sb.auth.getUser();
        const { error: dbErr } = await sb.from('library_resources').insert({ title, description: String(fd.get('description')||'').trim() || null, category: fd.get('category'), tags, file_name: file.name, storage_path: path, mime_type: file.type || null, size_bytes: file.size, created_by: auth.user?.id || null });
        if (dbErr) { await sb.storage.from(BUCKET).remove([path]); throw dbErr; }
        o.remove(); toast('Recurso subido correctamente.'); await open();
      } catch(err) { console.error(err); toast(err.message || 'No se pudo subir el recurso.', 'error'); button.disabled=false; button.textContent='Subir recurso'; }
    };
  }

  async function open() {
    const c = getContent(); if (!c) return;
    c.innerHTML = '<div class="loading"><span class="spinner"></span>Cargando biblioteca…</div>';
    try {
      const resources = await loadResources();
      c.innerHTML = render(resources);
      const search = c.querySelector('#librarySearch'); const category = c.querySelector('#libraryCategory');
      const rerender = () => { c.innerHTML = render(resources, search?.value || '', category?.value || 'all'); bind(c, resources); setTimeout(()=>c.querySelector('#librarySearch')?.focus(),0); };
      bind(c, resources, rerender);
    } catch(err) { console.error(err); c.innerHTML = '<div class="error-box"><strong>No se pudo cargar la biblioteca.</strong><p>Verifica tu conexión e inténtalo de nuevo.</p></div>'; }
  }

  function bind(c, resources, rerender) {
    c.querySelector('#libraryUpload')?.addEventListener('click',()=>uploadModal(resources));
    const s = c.querySelector('#librarySearch'); const cat = c.querySelector('#libraryCategory');
    if (s) s.addEventListener('input',()=>{clearTimeout(s._t);s._t=setTimeout(()=>rerender?.(),180)});
    if (cat) cat.addEventListener('change',()=>rerender?.());
    c.querySelectorAll('[data-library-open]').forEach(b=>b.addEventListener('click',()=>openFile(b.dataset.libraryOpen, resources)));
    c.querySelectorAll('[data-library-download]').forEach(b=>b.addEventListener('click',()=>downloadFile(b.dataset.libraryDownload, resources)));
    c.querySelectorAll('[data-library-delete]').forEach(b=>b.addEventListener('click',()=>deleteFile(b.dataset.libraryDelete, resources)));
  }

  async function signed(resource, download=false) {
    const sb = client();
    const { data, error } = await sb.storage.from(BUCKET).createSignedUrl(resource.storage_path, 300, { download });
    if (error) throw error; return data?.signedUrl;
  }
  async function openFile(id, resources) { try { const r=resources.find(x=>x.id===id); if(!r)return; const url=await signed(r,false); window.open(url,'_blank','noopener'); } catch(err){ toast(err.message||'No se pudo abrir el archivo.','error'); } }
  async function downloadFile(id, resources) { try { const r=resources.find(x=>x.id===id); if(!r)return; const url=await signed(r,true); window.open(url,'_blank','noopener'); } catch(err){ toast(err.message||'No se pudo descargar el archivo.','error'); } }
  async function deleteFile(id, resources) {
    if (!isManager() || !confirm('¿Eliminar este recurso de la biblioteca? El archivo también se eliminará del almacenamiento.')) return;
    try { const r=resources.find(x=>x.id===id); const sb=client(); const {error:de}=await sb.storage.from(BUCKET).remove([r.storage_path]); if(de)throw de; const {error:db}=await sb.from('library_resources').update({is_active:false,updated_at:new Date().toISOString()}).eq('id',id); if(db)throw db; toast('Recurso eliminado.'); await open(); } catch(err){toast(err.message||'No se pudo eliminar el recurso.','error');}
  }

  function decorateEventModal() {
    const modal = document.querySelector('.overlay .modal'); if (!modal) return;
    const hints = {
      nombre: 'Aquí va el nombre oficial del evento, tal como debe aparecer en el calendario.',
      fecha: 'Aquí va la fecha en que se realizará el evento.',
      hora: 'Aquí va la hora de inicio. Usa la hora local de República Dominicana.',
      direccion: 'Aquí va el lugar o dirección donde se realizará el evento.',
      latitud: 'Aquí va la latitud del lugar. Puedes dejarla vacía si no la tienes.',
      longitud: 'Aquí va la longitud del lugar. Puedes dejarla vacía si no la tienes.',
      descripcion: 'Aquí va una explicación breve del evento: objetivo, público, dinámica o información importante.',
      centro_id: 'Aquí seleccionas el centro educativo relacionado con el evento, si aplica.'
    };
    modal.querySelectorAll('input,select,textarea').forEach(el=>{
      if(!el.name || !hints[el.name] || el.dataset.r17Hint) return;
      const hint=document.createElement('small'); hint.textContent=hints[el.name]; hint.style.cssText='display:block;color:#718096;font-size:9px;line-height:1.4;margin-top:4px'; el.insertAdjacentElement('afterend',hint); el.dataset.r17Hint='1';
    });
  }

  function install() {
    injectNav();
    document.addEventListener('click', (e) => {
      const b = e.target.closest?.('[data-view="library"]'); if (!b) return;
      e.preventDefault(); e.stopImmediatePropagation();
      document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x===b));
      document.querySelector('.topbar h1')?.replaceChildren(document.createTextNode('Biblioteca'));
      document.querySelector('.sidebar')?.classList.remove('open');
      window.__R17_LIBRARY_VIEW=true; open();
    }, true);
    document.addEventListener('click', (e) => {
      if (e.target.closest?.('#quickAdd')) setTimeout(decorateEventModal, 0);
    }, true);
    document.addEventListener('click', (e) => {
      if (e.target.closest?.('[data-view]:not([data-view="library"])')) window.__R17_LIBRARY_VIEW=false;
    }, true);
    window.R17Library = { open, refresh: open };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once:true }); else install();
})();
