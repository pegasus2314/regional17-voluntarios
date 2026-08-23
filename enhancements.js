(() => {
  'use strict';
  // The existing application loads this enhancement layer after the core UI.
  // Load optional modules here so Preview keeps the original index structure intact.
  const loadModule=src=>{if(document.querySelector(`script[data-rv-module="${src}"]`))return;const s=document.createElement('script');s.src=src;s.dataset.rvModule=src;s.defer=true;document.head.appendChild(s)};
  loadModule('digital-map.js');
  loadModule('chat.js');
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  let sb=null,session=null,profile=null,lastAnnouncementIds=new Set(),notificationOpen=false;

  /* Theme layer: keeps the existing visual identity but gives every surface a real dark-mode treatment. */
  const themeStyle=document.createElement('style');
  themeStyle.textContent=`
    html.dark-mode{color-scheme:dark}
    body.dark-mode{--bg:#08111f;--line:#26364b;--ink:#e8eef7;--muted:#9aa9bc;--white:#101b2b;background:var(--bg);color:var(--ink)}
    body.dark-mode .main,.dark-mode #content{background:var(--bg);color:var(--ink)}
    body.dark-mode .topbar{background:#0d1929;border-color:#26364b;color:var(--ink)}
    body.dark-mode .btn,body.dark-mode .toolbar select,body.dark-mode .search,body.dark-mode .table-wrap,
    body.dark-mode .stat-card,body.dark-mode .panel,body.dark-mode .activity-card,body.dark-mode .center-card,
    body.dark-mode .event-card,body.dark-mode .modal,body.dark-mode .setup,body.dark-mode .error-box,
    body.dark-mode .rv-ann-modal,body.dark-mode .rv-map-panel{background:#101c2d;color:var(--ink);border-color:#293b52}
    body.dark-mode .btn{color:#dbe7f5}
    body.dark-mode .btn.primary{background:#1d568b;border-color:#1d568b;color:#fff}
    body.dark-mode .search input,body.dark-mode field input,body.dark-mode field select,body.dark-mode field textarea,
    body.dark-mode .rv-ann-form input,body.dark-mode .rv-ann-form textarea,body.dark-mode .rv-ann-form select,
    body.dark-mode .rv-map-search{background:#0b1626;color:var(--ink);border-color:#30445d}
    body.dark-mode .search input::placeholder,body.dark-mode input::placeholder,body.dark-mode textarea::placeholder{color:#718198}
    body.dark-mode .table-wrap th{background:#142236;color:#9cacc0}
    body.dark-mode .table-wrap td{border-color:#26364b}
    body.dark-mode .activity-row,body.dark-mode .rank-row,body.dark-mode .history-row,body.dark-mode .candidate{border-color:#26364b}
    body.dark-mode .date-box,body.dark-mode .stat-icon,body.dark-mode .center-icon,body.dark-mode .event-date,
    body.dark-mode .metric,body.dark-mode .icon-btn{background:#18263a;color:#dbe7f5}
    body.dark-mode .scorebar,body.dark-mode .bar{background:#26364b}
    body.dark-mode .pill.neutral{background:#263244;color:#b7c4d5}
    body.dark-mode .candidate.chosen{background:#152b45}
    body.dark-mode .segmented{background:#18263a}
    body.dark-mode .segmented button.active{background:#263a54;color:#e7eff8}
    body.dark-mode .popup{color:#172033}
    body.dark-mode .popup button{background:#fff;color:#173b63}
    body.dark-mode .rv-bell,body.dark-mode .rv-map-actions button{background:#132238;color:#dce8f6;border-color:#30445d}
    body.dark-mode .rv-ann-head{border-color:#293b52}
    body.dark-mode .rv-ann-close{background:#1c2b40;color:#dbe7f5}
    body.dark-mode .rv-ann-item{border-color:#293b52}
    body.dark-mode .rv-ann-item p,body.dark-mode .rv-ann-form label{color:#9aa9bc}
    body.dark-mode .rv-map-list{background:#101c2d;border-color:#30445d;box-shadow:0 16px 45px #0008}
    body.dark-mode .rv-map-result{border-color:#293b52}
    body.dark-mode .rv-map-result:hover{background:#18263a}
    body.dark-mode .login{background:#08111f;color:#e8eef7}
    body.dark-mode .login-form{color:#e8eef7}
    body.dark-mode .login-form input{background:#101c2d;color:#e8eef7;border-color:#30445d}
    body.dark-mode .login-form .btn{background:#101c2d;color:#e8eef7}
    body.dark-mode .login-form .btn.primary{background:#1d568b;color:#fff}
    body.dark-mode .empty h3{color:#e8eef7}
    body.dark-mode .toast{box-shadow:0 12px 30px #0006}
    .rv-theme-toggle{border:1px solid #e3e9f1;background:#fff;color:#173b63;border-radius:10px;width:38px;height:38px;display:grid;place-items:center;font-size:16px;font-weight:700;flex:none}
    .rv-theme-toggle:hover{transform:translateY(-1px)}
    .rv-theme-toggle:focus-visible{outline:2px solid #f3b343;outline-offset:2px}
    .rv-floating-theme{position:fixed;right:18px;bottom:18px;z-index:390;box-shadow:0 8px 24px #071b3530}
    @media(max-width:760px){.rv-floating-theme{right:14px;bottom:14px}}
  `;
  document.head.appendChild(themeStyle);

  function applyTheme(mode){
    const dark=mode==='dark';
    document.body.classList.toggle('dark-mode',dark);
    document.documentElement.classList.toggle('dark-mode',dark);
    localStorage.setItem('rv-theme',dark?'dark':'light');
    document.querySelectorAll('.rv-theme-toggle').forEach(b=>{
      b.innerHTML=dark?'☀️':'🌙';
      b.title=dark?'Cambiar a modo claro':'Cambiar a modo oscuro';
      b.setAttribute('aria-label',b.title);
    });
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.content=dark?'#08111f':'#071b35';
  }
  function installThemeToggle(){
    const existing=document.querySelector('.rv-theme-toggle');
    const top=document.querySelector('.top-actions');
    if(top&&!existing){
      const b=document.createElement('button');
      b.className='rv-theme-toggle';
      b.type='button';
      b.onclick=()=>applyTheme(document.body.classList.contains('dark-mode')?'light':'dark');
      top.prepend(b);
    }else if(!top&&!existing&&document.querySelector('.login,.setup,.error-box')){
      const b=document.createElement('button');
      b.className='rv-theme-toggle rv-floating-theme';
      b.type='button';
      b.onclick=()=>applyTheme(document.body.classList.contains('dark-mode')?'light':'dark');
      document.body.appendChild(b);
    }
    applyTheme(localStorage.getItem('rv-theme')||'light');
  }

  if(window.supabase?.createClient){const original=window.supabase.createClient.bind(window.supabase);window.supabase.createClient=(...args)=>{const client=original(...args);sb=client;window.__RV_SB=client;return client}}
  const style=document.createElement('style');style.textContent=`
  .rv-bell{position:relative;border:1px solid #e3e9f1;background:#fff;color:#173b63;border-radius:10px;width:38px;height:38px;display:grid;place-items:center;font-size:17px}.rv-badge{position:absolute;right:-4px;top:-5px;min-width:17px;height:17px;padding:0 4px;border-radius:99px;background:#c53d4b;color:#fff;font-size:9px;font-weight:800;display:grid;place-items:center;border:2px solid #fff}.rv-ann-overlay{position:fixed;inset:0;background:#04112294;z-index:450;display:grid;place-items:center;padding:18px}.rv-ann-modal{background:#fff;width:min(680px,100%);max-height:88vh;overflow:auto;border-radius:18px;box-shadow:0 24px 80px #071b3540}.rv-ann-head{padding:18px 20px;border-bottom:1px solid #e3e9f1;display:flex;align-items:center;justify-content:space-between}.rv-ann-head h3{margin:0;font-size:16px}.rv-ann-close{border:0;background:#f1f4f8;border-radius:9px;width:32px;height:32px;font-size:18px}.rv-ann-body{padding:18px}.rv-ann-item{padding:14px 0;border-bottom:1px solid #edf1f5}.rv-ann-item:last-child{border-bottom:0}.rv-ann-item h4{margin:0 0 5px;font-size:13px}.rv-ann-item p{margin:0;color:#667085;font-size:10px;line-height:1.55;white-space:pre-wrap}.rv-ann-meta{display:flex;gap:7px;align-items:center;margin-top:8px;color:#8a94a4;font-size:9px}.rv-priority{padding:3px 7px;border-radius:99px;font-weight:800}.rv-priority.urgent{background:#fdecef;color:#b53343}.rv-priority.important{background:#fff4df;color:#9a690d}.rv-priority.normal{background:#edf4fb;color:#1b4d7f}.rv-ann-form{display:grid;gap:11px}.rv-ann-form label{font-size:9px;font-weight:800;text-transform:uppercase;color:#667085}.rv-ann-form input,.rv-ann-form textarea,.rv-ann-form select{width:100%;border:1px solid #e3e9f1;border-radius:9px;padding:10px;font:inherit;font-size:11px;outline:0}.rv-ann-form textarea{min-height:110px;resize:vertical}.rv-ann-actions{display:flex;justify-content:flex-end;gap:7px;margin-top:3px}.rv-map-panel{background:#fff;border:1px solid #e3e9f1;border-radius:14px;padding:12px;margin-bottom:12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;position:relative}.rv-map-search{height:38px;flex:1;min-width:220px;border:1px solid #e3e9f1;border-radius:9px;padding:0 11px;outline:0;font-size:11px}.rv-map-count{display:flex;gap:7px;align-items:center;font-size:10px;color:#667085}.rv-map-dot{width:8px;height:8px;border-radius:50%;display:inline-block}.rv-map-dot.center{background:#1b4d7f}.rv-map-dot.event{background:#f3b343}.rv-map-actions button{border:1px solid #e3e9f1;background:#fff;color:#173b63;border-radius:8px;padding:8px 10px;font-size:10px;font-weight:700}.rv-map-list{position:absolute;z-index:401;top:58px;left:0;width:min(360px,calc(100% - 20px));max-height:420px;overflow:auto;background:#fff;border:1px solid #e3e9f1;border-radius:13px;box-shadow:0 16px 45px #071b3520;display:none}.rv-map-list.open{display:block}.rv-map-result{padding:10px 12px;border-bottom:1px solid #edf1f5;cursor:pointer}.rv-map-result:hover{background:#f7f9fc}.rv-map-result strong{display:block;font-size:10px}.rv-map-result small{display:block;color:#667085;font-size:9px;margin-top:3px}`;document.head.appendChild(style);
  function toast(msg,type='success'){const el=document.createElement('div');el.className=`toast ${type}`;el.textContent=msg;document.body.appendChild(el);setTimeout(()=>el.remove(),4000)}
  async function refreshAuth(){if(!sb)sb=window.__RV_SB;if(!sb)return false;const s=await sb.auth.getSession();session=s.data?.session||null;if(session){const p=await sb.from('profiles').select('*').eq('id',session.user.id).maybeSingle();profile=p.data||null}return !!session}
  function canAnnounce(){return ['admin','comunicacion'].includes(profile?.role)||profile?.is_master_admin===true}
  async function fetchAnnouncements(){if(!sb)return[];const {data,error}=await sb.from('announcements').select('*').order('created_at',{ascending:false}).limit(30);if(error){console.error(error);return[]}return data||[]}
  function formatTime(v){try{return new Intl.DateTimeFormat('es-DO',{dateStyle:'short',timeStyle:'short'}).format(new Date(v))}catch{return''}}
  function priorityLabel(p){return p==='urgent'?'Urgente':p==='important'?'Importante':'Normal'}
  async function openAnnouncements(){await refreshAuth();if(!session)return;notificationOpen=true;const items=await fetchAnnouncements();const o=document.createElement('div');o.className='rv-ann-overlay';o.innerHTML=`<div class="rv-ann-modal"><div class="rv-ann-head"><div><div class="eyebrow">COMUNICACIONES</div><h3>Anuncios de Regional 17</h3></div><button class="rv-ann-close">×</button></div><div class="rv-ann-body">${items.length?items.map(a=>`<article class="rv-ann-item"><h4>${esc(a.title)}</h4><p>${esc(a.content)}</p><div class="rv-ann-meta"><span class="rv-priority ${esc(a.priority||'normal')}">${priorityLabel(a.priority)}</span><span>${formatTime(a.created_at)}</span></div></article>`).join(''):'<div class="empty"><div class="empty-icon">🔔</div><h3>No hay anuncios nuevos</h3><p>Cuando se publique un anuncio aparecerá aquí.</p></div>'}${canAnnounce()?'<div class="rv-ann-actions"><button class="btn primary" data-rv-new-ann>＋ Publicar anuncio</button></div>':''}</div></div>`;document.body.appendChild(o);o.querySelector('.rv-ann-close').onclick=()=>{notificationOpen=false;o.remove()};o.onclick=e=>{if(e.target===o){notificationOpen=false;o.remove()}};o.querySelector('[data-rv-new-ann]')?.addEventListener('click',()=>openAnnouncementForm(o));items.forEach(a=>lastAnnouncementIds.add(a.id));updateBell()}
  function openAnnouncementForm(parent){const form=document.createElement('div');form.className='rv-ann-overlay';form.innerHTML=`<div class="rv-ann-modal"><div class="rv-ann-head"><div><div class="eyebrow">NUEVA COMUNICACIÓN</div><h3>Publicar anuncio</h3></div><button class="rv-ann-close">×</button></div><div class="rv-ann-body"><form class="rv-ann-form"><div><label>Título</label><input name="title" maxlength="140" required placeholder="Ej. Reunión general de voluntarios"></div><div><label>Mensaje</label><textarea name="content" maxlength="4000" required placeholder="Escribe el anuncio..."></textarea></div><div><label>Prioridad</label><select name="priority"><option value="normal">Normal</option><option value="important">Importante</option><option value="urgent">Urgente</option></select></div><div class="rv-ann-actions"><button type="button" class="btn rv-ann-cancel">Cancelar</button><button class="btn primary">Publicar anuncio</button></div></form></div></div>`;document.body.appendChild(form);form.querySelector('.rv-ann-close').onclick=form.querySelector('.rv-ann-cancel').onclick=()=>form.remove();form.querySelector('form').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.target),b=e.submitter;b.disabled=true;b.textContent='Publicando…';const {error}=await sb.from('announcements').insert({title:String(fd.get('title')).trim(),content:String(fd.get('content')).trim(),priority:fd.get('priority'),author_id:session.user.id});if(error){console.error(error);toast(error.message||'No se pudo publicar el anuncio','error');b.disabled=false;b.textContent='Publicar anuncio';return}form.remove();parent.remove();notificationOpen=false;toast('Anuncio publicado y notificación enviada');updateBell();openAnnouncements()}}
  function updateBell(){const badge=document.querySelector('.rv-badge');if(!badge)return;const n=lastAnnouncementIds.size;badge.textContent=n>99?'99+':String(n);badge.style.display=n?'grid':'none'}
  async function installHeader(){const top=document.querySelector('.top-actions');if(!top||top.querySelector('.rv-bell')){installThemeToggle();return}const b=document.createElement('button');b.className='rv-bell';b.setAttribute('aria-label','Anuncios y notificaciones');b.innerHTML='🔔<span class="rv-badge" style="display:none">0</span>';b.onclick=openAnnouncements;top.prepend(b);installThemeToggle();const items=await fetchAnnouncements();items.slice(0,10).forEach(a=>lastAnnouncementIds.add(a.id));updateBell()}
  function handleNewAnnouncement(payload){const a=payload.new;if(!a?.id)return;lastAnnouncementIds.add(a.id);updateBell();if(!notificationOpen)toast(`📢 ${a.title}`)}
  async function realDeleteVolunteer(id){await refreshAuth();if(!session||profile?.role!=='admin'){toast('Solo un administrador puede eliminar voluntarios.','error');return}const {data:v,error:readError}=await sb.from('voluntarios').select('id,nombre').eq('id',id).maybeSingle();if(readError||!v){toast('El voluntario ya no existe.','error');return}if(!confirm(`¿Eliminar definitivamente a ${v.nombre}?\n\nSi tiene historial o una cuenta vinculada, se conservará como inactivo para proteger esos registros.`))return;const {error}=await sb.from('voluntarios').delete().eq('id',id).select('id').maybeSingle();if(!error){toast('Voluntario eliminado correctamente');window.dispatchEvent(new Event('rv-reload'));return}console.error(error);const archived=await sb.from('voluntarios').update({estatus:'Inactivo',updated_by:session.user.id}).eq('id',id);if(archived.error){toast(archived.error.message||'No se pudo eliminar el voluntario','error');return}toast('No se pudo eliminar definitivamente porque tiene registros relacionados. Se archivó como inactivo.','error');window.dispatchEvent(new Event('rv-reload'))}
  async function fetchMapData(q){if(!sb)return[];const [c,e]=await Promise.all([sb.from('centros_educativos').select('id,nombre,direccion,municipio,provincia').eq('is_active',true),sb.from('eventos').select('id,nombre,direccion,fecha,hora').eq('is_active',true)]);const out=[];(c.data||[]).filter(x=>[x.nombre,x.direccion,x.municipio,x.provincia].join(' ').toLowerCase().includes(q)).forEach(x=>out.push({name:x.nombre,meta:`Centro · ${x.municipio||'Monte Plata'}`}));(e.data||[]).filter(x=>[x.nombre,x.direccion].join(' ').toLowerCase().includes(q)).forEach(x=>out.push({name:x.nombre,meta:`Evento · ${x.direccion||'Sin dirección'}`}));return out.slice(0,12)}
  function enhanceMap(){const map=document.querySelector('#map');if(!map||map.dataset.rvEnhanced)return;map.dataset.rvEnhanced='1';const toolbar=map.parentElement.querySelector('.map-toolbar');if(!toolbar)return;const panel=document.createElement('div');panel.className='rv-map-panel';panel.innerHTML='<input class="rv-map-search" placeholder="Buscar centro o evento por nombre…"><div class="rv-map-count"><i class="rv-map-dot center"></i> Centros</div><div class="rv-map-count"><i class="rv-map-dot event"></i> Eventos</div><div class="rv-map-actions"><button data-rv-map-clear>Limpiar búsqueda</button></div><div class="rv-map-list"></div>';toolbar.after(panel);const input=panel.querySelector('.rv-map-search'),list=panel.querySelector('.rv-map-list');input.oninput=async()=>{const q=input.value.trim().toLowerCase();if(!q){list.classList.remove('open');list.innerHTML='';return}const items=await fetchMapData(q);list.innerHTML=items.map(x=>`<div class="rv-map-result"><strong>${esc(x.name)}</strong><small>${esc(x.meta)}</small></div>`).join('')||'<div class="rv-map-result"><small>No se encontraron ubicaciones.</small></div>';list.classList.add('open')};panel.querySelector('[data-rv-map-clear]').onclick=()=>{input.value='';list.classList.remove('open');list.innerHTML=''}}
  const observer=new MutationObserver(()=>{installHeader();enhanceMap();installThemeToggle()});observer.observe(document.documentElement,{subtree:true,childList:true});document.addEventListener('click',e=>{const btn=e.target.closest?.('[data-del-v]');if(btn){e.preventDefault();e.stopImmediatePropagation();realDeleteVolunteer(btn.dataset.delV)}},true);window.addEventListener('rv-reload',()=>{const nav=document.querySelector('[data-view="volunteers"]');if(nav?.click)nav.click()});const wait=setInterval(()=>{sb=window.__RV_SB||sb;if(sb){clearInterval(wait);refreshAuth().then(()=>{installHeader();enhanceMap();installThemeToggle();sb.channel('rv-announcements-enhanced').on('postgres_changes',{event:'INSERT',schema:'public',table:'announcements'},handleNewAnnouncement).subscribe()})}},100);
  installThemeToggle();
})();
