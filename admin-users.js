/* Regional 17 — Administración > Usuarios */
(() => {
  'use strict';
  const C = window.RV_CONFIG || {};
  let sb = null, master = false;
  const esc = v => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const toast = (m, bad=false) => { const e=document.createElement('div'); e.className='toast'+(bad?' error':''); e.textContent=m; document.body.appendChild(e); setTimeout(()=>e.remove(),3500); };
  const init = async () => {
    if (!window.supabase || !C.SUPABASE_URL || !C.SUPABASE_ANON_KEY) return;
    sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY);
    const {data:{session}} = await sb.auth.getSession();
    if (!session) return;
    const r = await sb.rpc('is_master_admin'); master = !r.error && r.data === true;
    if (master) addNav();
    sb.auth.onAuthStateChange(async (_e,s) => { if (!s) { master=false; return; } const x=await sb.rpc('is_master_admin'); master=!x.error&&x.data===true; if(master)addNav(); });
  };
  const addNav = () => {
    const nav=document.querySelector('.sidebar nav'); if(!nav||!master||nav.querySelector('[data-admin-users]'))return;
    const b=document.createElement('button'); b.className='nav-item'; b.dataset.adminUsers='1'; b.innerHTML='<span>👥</span>Usuarios'; b.onclick=open;
    nav.appendChild(b);
  };
  const invoke = async payload => { const {data,error}=await sb.functions.invoke('admin-manage-user',{body:payload}); if(error) throw new Error(error.message||'No se pudo completar la operación'); if(data?.error) throw new Error(data.error); return data; };
  async function open(){
    if(!master)return;
    const [{data:profiles,error:pe},{data:roles,error:re},{data:distritos,error:de}] = await Promise.all([
      sb.from('profiles').select('id,email,full_name,role,distrito_id,created_at').order('created_at',{ascending:true}),
      sb.from('system_roles').select('code,name,description').eq('active',true).order('name'),
      sb.from('distritos').select('id,nombre').order('id')
    ]);
    if(pe||re||de){toast('No se pudieron cargar los datos de usuarios',true);return;}
    const roleList=roles||[], districtList=distritos||[];
    const o=document.createElement('div'); o.className='overlay';
    o.innerHTML=`<div class="modal admin-users-modal"><div class="modal-head"><div><h3>Administración · Usuarios</h3><p>Control centralizado de cuentas, roles y distritos.</p></div><div style="display:flex;gap:7px"><button class="btn primary" data-new>+ Nueva cuenta</button><button class="icon-btn" data-close>×</button></div></div><div class="modal-body"><div class="admin-users-summary"><div><b id="auTotal">0</b><span>Usuarios</span></div><div><b id="auAdmins">0</b><span>Administradores</span></div><div><b id="auCoord">0</b><span>Coordinadores</span></div><div><b id="auVol">0</b><span>Voluntarios</span></div></div><div class="toolbar"><div class="search"><span>⌕</span><input id="auQ" placeholder="Buscar por nombre o correo"></div><select id="auRole"><option value="">Todos los roles</option>${roleList.map(r=>`<option value="${esc(r.code)}">${esc(r.name)}</option>`).join('')}</select><select id="auDistrict"><option value="">Todos los distritos</option>${districtList.map(d=>`<option value="${esc(d.id)}">${esc(d.id)} · ${esc(d.nombre)}</option>`).join('')}</select></div><div class="table-wrap"><table style="min-width:920px"><thead><tr><th>Usuario</th><th>Rol</th><th>Distrito</th><th>Creado</th><th>Acciones</th></tr></thead><tbody id="auRows"></tbody></table></div></div></div>`;
    document.body.appendChild(o);
    const rows=o.querySelector('#auRows'),q=o.querySelector('#auQ'),rf=o.querySelector('#auRole'),df=o.querySelector('#auDistrict');
    const draw=()=>{
      const text=q.value.toLowerCase().trim(); let list=(profiles||[]).filter(p=>(!rf.value||p.role===rf.value)&&(!df.value||p.distrito_id===df.value)&&`${p.full_name||''} ${p.email||''}`.toLowerCase().includes(text));
      o.querySelector('#auTotal').textContent=profiles?.length||0; o.querySelector('#auAdmins').textContent=(profiles||[]).filter(p=>p.role==='admin').length; o.querySelector('#auCoord').textContent=(profiles||[]).filter(p=>p.role==='coordinador').length; o.querySelector('#auVol').textContent=(profiles||[]).filter(p=>p.role==='voluntario').length;
      rows.innerHTML=list.map(p=>{const district=districtList.find(d=>d.id===p.distrito_id); const protectedUser=p.role==='admin' && p.id!==undefined; return `<tr><td><div class="person"><div class="avatar">${esc((p.full_name||p.email||'U')[0].toUpperCase())}</div><div><strong>${esc(p.full_name||'Sin nombre')}</strong><small>${esc(p.email||'')}</small></div></div></td><td><span class="pill ${p.role==='admin'?'success':'neutral'}">${esc((roleList.find(r=>r.code===p.role)||{}).name||p.role||'Voluntario')}</span></td><td>${district?esc(district.id+' · '+district.nombre):'<span style="color:var(--muted)">Sin asignar</span>'}</td><td>${p.created_at?new Intl.DateTimeFormat('es-DO',{dateStyle:'medium'}).format(new Date(p.created_at)):'—'}</td><td><div style="display:flex;gap:5px;flex-wrap:wrap"><button class="btn small" data-edit="${p.id}">Editar</button>${p.role!=='admin'?`<button class="btn small danger" data-reset="${p.id}">Contraseña</button><button class="btn small danger" data-disable="${p.id}">Desactivar</button>`:'<span class="admin-protected">🔒 Protegido</span>'}</div></td></tr>`}).join('')||'<tr><td colspan="5"><div class="empty">No hay usuarios con esos filtros.</div></td></tr>';
    };
    draw(); q.oninput=draw; rf.onchange=draw; df.onchange=draw;
    o.querySelector('[data-close]').onclick=()=>o.remove(); o.addEventListener('click',e=>{if(e.target===o)o.remove()}); o.querySelector('[data-new]').onclick=()=>form();
    rows.addEventListener('click',async e=>{
      const edit=e.target.closest('[data-edit]'); if(edit){const p=(profiles||[]).find(x=>x.id===edit.dataset.edit);if(p)form(p);return;}
      const reset=e.target.closest('[data-reset]'); if(reset){const pass=prompt('Nueva contraseña (mínimo 8 caracteres):');if(pass===null)return;if(pass.length<8){toast('La contraseña debe tener al menos 8 caracteres',true);return;}try{await invoke({action:'reset_password',id:reset.dataset.reset,password:pass});toast('Contraseña actualizada');}catch(err){toast(err.message,true)}return;}
      const dis=e.target.closest('[data-disable]'); if(dis){if(!confirm('¿Desactivar esta cuenta? El usuario no podrá iniciar sesión.'))return;try{await invoke({action:'disable',id:dis.dataset.disable});toast('Cuenta desactivada');}catch(err){toast(err.message,true)}}
    });
    async function form(existing){
      const x=document.createElement('div');x.className='overlay';
      x.innerHTML=`<div class="modal admin-user-form"><div class="modal-head"><div><h3>${existing?'Editar cuenta':'Crear nueva cuenta'}</h3><p>${existing?'Actualiza los datos y permisos.':'La cuenta se crea directamente en Supabase Auth.'}</p></div><button class="icon-btn" data-x>×</button></div><div class="modal-body"><form id="auForm"><div class="detail-grid"><div><span>Nombre completo</span><input name="full_name" required value="${esc(existing?.full_name||'')}" placeholder="Ej. Juan Pérez"></div><div><span>Correo electrónico</span><input name="email" type="email" required value="${esc(existing?.email||'')}" placeholder="usuario@correo.com"></div><div><span>Rol</span><select name="role">${roleList.map(r=>`<option value="${esc(r.code)}" ${existing?.role===r.code?'selected':''}>${esc(r.name)}</option>`).join('')}</select></div><div><span>Distrito</span><select name="distrito_id"><option value="">Sin asignar</option>${districtList.map(d=>`<option value="${esc(d.id)}" ${existing?.distrito_id===d.id?'selected':''}>${esc(d.id)} · ${esc(d.nombre)}</option>`).join('')}</select></div>${!existing?'<div><span>Contraseña inicial</span><input name="password" type="password" minlength="8" required placeholder="Mínimo 8 caracteres"></div>':''}</div><div class="form-help" style="margin:12px 0">Las cuentas son administradas por el sistema; no hay registro público.</div><button class="btn primary" style="width:100%" type="submit">${existing?'Guardar cambios':'Crear cuenta'}</button></form></div></div>`;
      document.body.appendChild(x);x.querySelector('[data-x]').onclick=()=>x.remove();x.addEventListener('click',e=>{if(e.target===x)x.remove()});
      x.querySelector('#auForm').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const payload={action:existing?'update':'create',full_name:fd.get('full_name'),email:fd.get('email'),role:fd.get('role'),distrito_id:fd.get('distrito_id')||null};if(!existing)payload.password=fd.get('password');try{await invoke(existing?{...payload,id:existing.id}:payload);toast(existing?'Cuenta actualizada':'Cuenta creada correctamente');x.remove();o.remove();open();}catch(err){toast(err.message,true)}};
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{init();new MutationObserver(addNav).observe(document.body,{childList:true,subtree:true})},{once:true});else{init();new MutationObserver(addNav).observe(document.body,{childList:true,subtree:true});}
})();
