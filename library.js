/* Regional 17 Volunteers — Biblioteca académica */
(() => {
  'use strict';
  const BUCKET='educational-library';
  const CATEGORIES=['Planificación','Formación','Recursos didácticos','Normativas','Evaluaciones','Otros'];
  const MANAGERS=['admin','coordinador','comunicacion'];
  let sb=null,profile=null,session=null,files=[],query='',category='all';
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const toast=(m,err=false)=>{const e=document.createElement('div');e.className='toast'+(err?' error':'');e.textContent=m;document.body.appendChild(e);setTimeout(()=>e.remove(),3500)};
  const canManage=()=>MANAGERS.includes(profile?.role);
  const pretty=n=>String(n||'').replace(/[_-]+/g,' ').replace(/\.[^.]+$/,'');
  const size=n=>{n=Number(n||0);if(!n)return '—';const u=['B','KB','MB','GB'],i=Math.min(Math.floor(Math.log(n)/Math.log(1024)),3);return `${(n/1024**i).toFixed(i?1:0)} ${u[i]}`};
  const icon=n=>{const x=String(n).split('.').pop().toLowerCase();if(x==='pdf')return '📕';if(['doc','docx'].includes(x))return '📘';if(['xls','xlsx','csv'].includes(x))return '📗';if(['ppt','pptx'].includes(x))return '📙';if(['jpg','jpeg','png','webp','gif'].includes(x))return '🖼️';if(['zip','rar','7z'].includes(x))return '🗜️';return '📄'};
  async function init(){
    if(!window.supabase||!window.RV_CONFIG?.SUPABASE_URL)return;
    sb=window.supabase.createClient(window.RV_CONFIG.SUPABASE_URL,window.RV_CONFIG.SUPABASE_ANON_KEY);
    const s=await sb.auth.getSession();session=s.data?.session||null;
    if(session){const r=await sb.from('profiles').select('role,full_name,email').eq('id',session.user.id).maybeSingle();profile=r.data||{role:'voluntario'};}
    install();
    sb.auth.onAuthStateChange(async(_e,s)=>{session=s;if(s){const r=await sb.from('profiles').select('role,full_name,email').eq('id',s.user.id).maybeSingle();profile=r.data||{role:'voluntario'};install();}else profile=null;});
  }
  function install(){const nav=document.querySelector('.sidebar nav');if(!nav||!session||nav.querySelector('[data-r17-tool="library"]'))return;const b=document.createElement('button');b.className='nav-item';b.dataset.r17Tool='library';b.innerHTML='<span>📚</span>Biblioteca';b.onclick=e=>{e.preventDefault();open()};nav.appendChild(b)}
  async function load(){
    const all=await Promise.all(CATEGORIES.map(async c=>{const r=await sb.storage.from(BUCKET).list(c,{limit:100,offset:0,sortBy:{column:'name',order:'asc'}});if(r.error)throw r.error;return (r.data||[]).filter(x=>x.name).map(x=>({...x,category:c,path:`${c}/${x.name}`}));}));
    files=all.flat();
  }
  function render(root){
    const q=query.toLowerCase().trim(),list=files.filter(f=>(category==='all'||f.category===category)&&(!q||`${f.name} ${f.category}`.toLowerCase().includes(q)));
    root.querySelector('#libraryCount').textContent=`${list.length} recurso${list.length===1?'':'s'}`;
    root.querySelector('#libraryGrid').innerHTML=list.map(f=>`<article class="activity-card library-card"><div class="library-icon">${icon(f.name)}</div><div class="grow"><h3>${esc(pretty(f.name))}</h3><p>${esc(f.category)} · ${size(f.metadata?.size||f.size)}</p><div class="card-actions"><button class="btn small primary" data-lib-open="${esc(f.path)}">Abrir / descargar</button>${canManage()?`<button class="btn small danger" data-lib-delete="${esc(f.path)}">Eliminar</button>`:''}</div></div></article>`).join('')||'<div class="empty" style="grid-column:1/-1"><div class="empty-icon">📚</div><h3>No se encontraron recursos</h3><p>Prueba otra búsqueda o cambia la categoría.</p></div>';
    root.querySelectorAll('[data-lib-open]').forEach(b=>b.onclick=async()=>{const r=await sb.storage.from(BUCKET).createSignedUrl(b.dataset.libOpen,600);if(r.error||!r.data?.signedUrl)return toast('No se pudo abrir el recurso',true);window.open(r.data.signedUrl,'_blank','noopener,noreferrer')});
    root.querySelectorAll('[data-lib-delete]').forEach(b=>b.onclick=async()=>{if(!confirm('¿Eliminar este recurso de la biblioteca?'))return;const r=await sb.storage.from(BUCKET).remove([b.dataset.libDelete]);if(r.error)return toast(r.error.message||'No se pudo eliminar',true);await load();render(root);toast('Recurso eliminado')});
  }
  function upload(root){
    const o=document.createElement('div');o.className='overlay';o.innerHTML=`<div class="modal"><div class="modal-head"><div><h3>Subir recurso académico</h3><p>El archivo se guardará en la biblioteca regional.</p></div><button class="icon-btn" data-close>×</button></div><div class="modal-body"><form id="libraryUpload"><field><label>Categoría</label><select name="category">${CATEGORIES.map(c=>`<option>${esc(c)}</option>`).join('')}</select></field><field><label>Archivo</label><input name="file" type="file" required accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt,.jpg,.jpeg,.png,.webp,.zip"></field><p class="form-help">Límite de 50 MB por archivo.</p><div class="modal-actions"><button type="button" class="btn" data-close>Cancelar</button><button class="btn primary">Subir</button></div></form></div></div>`;document.body.appendChild(o);o.querySelectorAll('[data-close]').forEach(x=>x.onclick=()=>o.remove());o.querySelector('form').onsubmit=async e=>{e.preventDefault();const b=e.submitter,f=e.target.file.files[0];if(!f)return;if(f.size>50*1024*1024)return toast('El archivo supera los 50 MB',true);b.disabled=true;b.textContent='Subiendo…';const clean=f.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'')||'recurso';const path=`${e.target.category.value}/${Date.now()}-${clean}`;const r=await sb.storage.from(BUCKET).upload(path,f,{upsert:false,contentType:f.type||'application/octet-stream',cacheControl:'3600'});if(r.error){toast(r.error.message||'No se pudo subir',true);b.disabled=false;b.textContent='Subir';return}o.remove();await load();render(root);toast('Recurso subido correctamente')};
  }
  async function open(){if(!session)return toast('Inicia sesión para acceder a la biblioteca',true);const root=document.createElement('div');root.className='overlay';root.innerHTML=`<div class="modal library-modal"><div class="modal-head"><div><h3>Biblioteca académica</h3><p>Recursos educativos de la Regional 17</p></div><button class="icon-btn" data-close>×</button></div><div class="modal-body"><div class="toolbar"><div class="search"><span>⌕</span><input id="librarySearch" placeholder="Buscar por nombre o categoría…"></div><select id="libraryCategory"><option value="all">Todas las categorías</option>${CATEGORIES.map(c=>`<option>${esc(c)}</option>`).join('')}</select>${canManage()?'<button class="btn primary" id="libraryUploadBtn">＋ Subir recurso</button>':''}</div><div class="library-count" id="libraryCount">Cargando…</div><div id="libraryGrid" class="cards-grid library-grid"></div></div></div>`;document.body.appendChild(root);root.querySelector('[data-close]').onclick=()=>root.remove();root.querySelector('#librarySearch').oninput=e=>{query=e.target.value;render(root)};root.querySelector('#libraryCategory').onchange=e=>{category=e.target.value;render(root)};root.querySelector('#libraryUploadBtn')?.addEventListener('click',()=>upload(root));try{await load();render(root)}catch(e){console.error(e);root.querySelector('#libraryGrid').innerHTML='<div class="error-box" style="grid-column:1/-1;margin:0">No se pudieron cargar los recursos. Revisa los permisos del bucket.</div>'}}
  window.R17Library={open};
  const obs=new MutationObserver(()=>install());obs.observe(document.body,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
