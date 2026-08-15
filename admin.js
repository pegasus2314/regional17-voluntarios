/* Regional 17 Volunteers — master admin + UX helpers */
(() => {
  'use strict';
  const cfg=window.RV_CONFIG||{};
  if(!cfg.SUPABASE_URL||!cfg.SUPABASE_ANON_KEY)return;
  const sb=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
  let masterId=null,master=false;
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const toast=(m,type='success')=>{const e=document.createElement('div');e.className='toast'+(type==='error'?' error':'');e.textContent=m;document.body.appendChild(e);setTimeout(()=>e.remove(),3500)};
  const roleLabels={admin:'Administrador',coordinador:'Coordinador',comunicacion:'Comunicaciones',voluntario:'Voluntario'};
  const help={
    'Nombre completo':'Escribe el nombre y apellido del voluntario.',
    'Cédula':'Número de identificación del voluntario. Déjalo vacío si todavía no está disponible.',
    'Distrito':'Selecciona el distrito educativo al que pertenece.',
    'Categoría':'Indica el ámbito o categoría de participación.',
    'Estatus':'Selecciona el estado actual del voluntario.',
    'Disponibilidad':'Indica cuándo puede participar en actividades.',
    'Notas':'Información adicional relevante para la coordinación.',
    'Nombre':'Nombre que identificará el registro.',
    'Descripción':'Explica brevemente el propósito o contenido.',
    'Fecha':'Fecha en la que se realizará la actividad o evento.',
    'Hora':'Hora de inicio de la actividad o evento.',
    'Dirección':'Lugar físico donde se realizará.',
    'Centro educativo':'Selecciona el centro educativo relacionado.'
  };
  function enhanceFields(){
    document.querySelectorAll('field[label]').forEach(f=>{
      if(f.querySelector('.field-help'))return;
      const label=f.getAttribute('label')||'';
      const h=document.createElement('small');h.className='field-help';h.textContent=help[label]||'Completa este dato con la información correspondiente.';f.appendChild(h);
    });
  }
  function addStyles(){if(document.getElementById('r17-admin-style'))return;const s=document.createElement('style');s.id='r17-admin-style';s.textContent=`field{display:block;margin-bottom:14px}field[label]{padding-top:1px}field[label]::before{content:attr(label);display:block;color:#667085;font-size:9px;font-weight:800;text-transform:uppercase;margin-bottom:5px}.field-help{display:block;color:#8a96a8;font-size:8px;line-height:1.4;margin-top:4px}.admin-card{background:#fff;border:1px solid #e3e9f1;border-radius:14px;padding:16px}.admin-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.role-desc{font-size:9px;color:#667085;line-height:1.4;margin-top:3px}@media(max-width:760px){.admin-grid{grid-template-columns:1fr}}`;document.head.appendChild(s)}
  async function init(){
    addStyles();enhanceFields();
    const {data:{session}}=await sb.auth.getSession();if(!session)return;
    masterId=session.user.id;
    const {data,error}=await sb.rpc('is_master_admin');
    if(error||data!==true)return;
    master=true;installAdminNav();
  }
  function installAdminNav(){
    const nav=document.querySelector('.sidebar nav');if(!nav||nav.querySelector('[data-master-admin]'))return;
    const b=document.createElement('button');b.className='nav-item';b.dataset.masterAdmin='1';b.innerHTML='<span>⚙</span>Administración';b.onclick=openAdmin;nav.appendChild(b);
  }
  async function openAdmin(){
    const [pr,rr]=await Promise.all([sb.from('profiles').select('id,full_name,role,created_at').order('created_at',{ascending:true}),sb.from('system_roles').select('code,name,description').eq('active',true).order('name')]);
    if(pr.error||rr.error)return toast('No se pudieron cargar los usuarios o roles.','error');
    const profiles=pr.data||[],roles=rr.data||[];
    const o=document.createElement('div');o.className='overlay';o.innerHTML=`<div class="modal" style="width:min(980px,100%)"><div class="modal-head"><div><h3>Administración de usuarios</h3><p style="margin:4px 0 0;color:#667085;font-size:10px">Administrador maestro · asignación de roles y permisos</p></div><button class="icon-btn" data-close>×</button></div><div class="modal-body"><div class="admin-grid" style="margin-bottom:14px">${roles.map(r=>`<div class="admin-card"><strong style="font-size:11px">${esc(roleLabels[r.code]||r.name)}</strong><div class="role-desc">${esc(r.description||'')}</div></div>`).join('')}</div><div class="search" style="margin-bottom:12px"><span>⌕</span><input id="adminQ" placeholder="Buscar usuario por nombre"></div><div class="table-wrap"><table style="min-width:760px"><thead><tr><th>Usuario</th><th>Rol actual</th><th>Asignar rol</th><th>Acción</th></tr></thead><tbody id="adminRows"></tbody></table></div></div></div>`;
    document.body.appendChild(o);o.querySelector('[data-close]').onclick=()=>o.remove();
    const rows=o.querySelector('#adminRows');
    const render=()=>{const q=o.querySelector('#adminQ').value.trim().toLowerCase();rows.innerHTML=profiles.filter(p=>(p.full_name||'').toLowerCase().includes(q)||p.role?.toLowerCase().includes(q)).map(p=>{const self=p.id===masterId;return `<tr><td><div class="person"><div class="avatar">${esc((p.full_name||'U')[0].toUpperCase())}</div><div><strong>${esc(p.full_name||'Sin nombre')}</strong><small>ID: ${esc(p.id.slice(0,8))}…</small></div></div></td><td><span class="pill ${p.role==='admin'?'success':'neutral'}">${esc(roleLabels[p.role]||p.role||'Voluntario')}</span>${self?'<small style="display:block;color:#9a690d;margin-top:4px">Administrador maestro</small>':''}</td><td><select data-role="${p.id}" ${self?'disabled':''}>${roles.map(r=>`<option value="${esc(r.code)}" ${p.role===r.code?'selected':''}>${esc(roleLabels[r.code]||r.name)}</option>`).join('')}</select></td><td>${self?'<span class="pill neutral">Protegido</span>':`<button class="btn small primary" data-save="${p.id}">Guardar</button>`}</td></tr>`}).join('')||'<tr><td colspan="4">No hay usuarios.</td></tr>';};
    render();o.querySelector('#adminQ').oninput=render;
    rows.addEventListener('click',async e=>{const b=e.target.closest('[data-save]');if(!b)return;const id=b.dataset.save,s=rows.querySelector(`[data-role="${id}"]`);b.disabled=true;b.textContent='Guardando…';const {error}=await sb.rpc('set_user_role',{target_user_id:id,new_role:s.value});if(error){toast(error.message||'No se pudo asignar el rol','error');b.disabled=false;b.textContent='Guardar';return;}const p=profiles.find(x=>x.id===id);if(p)p.role=s.value;toast('Rol actualizado correctamente');render();});
  }
  const deleteTables={'data-del-v':'voluntarios','data-del-c':'centros_educativos','data-del-a':'actividades','data-del-e':'eventos'};
  document.addEventListener('click',async e=>{
    const el=e.target.closest('[data-del-v],[data-del-c],[data-del-a],[data-del-e]');if(!el)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    const attr=Object.keys(deleteTables).find(k=>el.hasAttribute(k));if(!attr)return;const id=el.getAttribute(attr),table=deleteTables[attr];
    if(!id)return;
    const ok=window.confirm('¿Eliminar este registro?\n\nEsta acción no se puede deshacer.');if(!ok)return;
    el.disabled=true;el.textContent='Eliminando…';
    const {error}=await sb.from(table).delete().eq('id',id);
    if(error){toast(error.message||'No se pudo eliminar el registro','error');el.disabled=false;el.textContent='Eliminar';return;}
    toast('Registro eliminado correctamente');setTimeout(()=>location.reload(),250);
  },true);
  const obs=new MutationObserver(()=>{enhanceFields();if(master)installAdminNav()});obs.observe(document.documentElement,{childList:true,subtree:true});
  init();
})();