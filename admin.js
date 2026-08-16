/* Regional 17 Volunteers — master admin role management */
(() => {
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const ready=()=>window.supabase&&window.RV_CONFIG?.SUPABASE_URL&&window.RV_CONFIG?.SUPABASE_ANON_KEY;
  let sb=null,isMaster=false,currentUserId=null;
  const toast=(m,err=false)=>{const e=document.createElement('div');e.className='toast'+(err?' error':'');e.textContent=m;document.body.appendChild(e);setTimeout(()=>e.remove(),3500)};
  async function init(){
    if(!ready())return;
    sb=window.supabase.createClient(window.RV_CONFIG.SUPABASE_URL,window.RV_CONFIG.SUPABASE_ANON_KEY);
    const {data:{session}}=await sb.auth.getSession();if(!session)return;
    currentUserId=session.user.id;
    const r=await sb.rpc('is_master_admin');
    if(!r.error&&r.data===true){isMaster=true;installNav();}
    sb.auth.onAuthStateChange(async(_e,s)=>{currentUserId=s?.user?.id||null;if(!s){isMaster=false;return}const x=await sb.rpc('is_master_admin');isMaster=!x.error&&x.data===true;installNav()});
  }
  function installNav(){const nav=document.querySelector('.sidebar nav');if(!isMaster||!nav||nav.querySelector('[data-master-admin]'))return;}
  function addNav(){const nav=document.querySelector('.sidebar nav');if(!isMaster||!nav||nav.querySelector('[data-master-admin]'))return;const b=document.createElement('button');b.className='nav-item';b.dataset.masterAdmin='1';b.innerHTML='<span>⚙</span>Administración';b.onclick=openAdmin;nav.appendChild(b)}
  function observe(){addNav();new MutationObserver(addNav).observe(document.body,{childList:true,subtree:true})}
  async function openAdmin(){
    const [{data:profiles,error:pe},{data:roles,error:re}]=await Promise.all([sb.from('profiles').select('id,email,full_name,role,created_at').order('created_at',{ascending:true}),sb.from('system_roles').select('code,name,description').eq('active',true).order('name')]);
    if(pe)return toast('No se pudieron cargar los usuarios',true);if(re)return toast('No se pudieron cargar los roles',true);
    const o=document.createElement('div');o.className='overlay';o.innerHTML=`<div class="modal admin-modal"><div class="modal-head"><div><h3>Administración de usuarios</h3><p>Administrador maestro · asignación de roles</p></div><button class="icon-btn" data-close>×</button></div><div class="modal-body"><div class="toolbar"><div class="search"><span>⌕</span><input id="adminQ" placeholder="Buscar por correo, nombre o rol"></div></div><div class="table-wrap"><table style="min-width:720px"><thead><tr><th>Usuario</th><th>Rol actual</th><th>Nuevo rol</th><th>Acción</th></tr></thead><tbody id="adminRows"></tbody></table></div></div></div>`;document.body.appendChild(o);o.querySelector('[data-close]').onclick=()=>o.remove();
    const rows=o.querySelector('#adminRows');
    const draw=()=>{const q=o.querySelector('#adminQ').value.toLowerCase().trim();rows.innerHTML=(profiles||[]).filter(p=>[p.email,p.full_name,p.role].join(' ').toLowerCase().includes(q)).map(p=>{const master=p.id===currentUserId;return `<tr><td><div class="person"><div class="avatar">${esc((p.full_name||p.email||'U')[0].toUpperCase())}</div><div><strong>${esc(p.full_name||'Sin nombre')}</strong><small>${esc(p.email||'')}</small></div></div></td><td><span class="pill ${p.role==='admin'?'success':'neutral'}">${esc(p.role||'voluntario')}</span>${master?'<small style="display:block;color:#9a690d;margin-top:4px">Administrador maestro</small>':''}</td><td><select data-role="${p.id}" ${master?'disabled':''}>${(roles||[]).map(r=>`<option value="${esc(r.code)}" ${p.role===r.code?'selected':''}>${esc(r.name)}</option>`).join('')}</select></td><td>${master?'<span class="pill neutral">Protegido</span>':`<button class="btn small primary" data-save="${p.id}">Guardar</button>`}</td></tr>`}).join('')||'<tr><td colspan="4">No hay usuarios.</td></tr>'};draw();o.querySelector('#adminQ').oninput=draw;
    rows.addEventListener('click',async e=>{const b=e.target.closest('[data-save]');if(!b)return;const id=b.dataset.save;if(id===currentUserId)return toast('El administrador maestro está protegido',true);const select=rows.querySelector(`[data-role="${id}"]`);b.disabled=true;b.textContent='Guardando…';const r=await sb.rpc('set_user_role',{target_user_id:id,new_role:select.value});if(r.error){toast(r.error.message||'No se pudo asignar el rol',true);b.disabled=false;b.textContent='Guardar';return}const p=profiles.find(x=>x.id===id);if(p)p.role=select.value;toast('Rol actualizado correctamente');draw()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{init();observe()},{once:true});else{init();observe()}
})();
