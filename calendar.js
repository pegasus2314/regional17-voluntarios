/* Regional 17 Volunteers — Calendario y Cronograma sobre la tabla eventos existente */
(() => {
  'use strict';
  const ROLES = ['admin','coordinador'];
  let sb = null, session = null, profile = null, events = [], centers = [], month = new Date(), mode = 'calendar';
  const esc = v => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const canManage = () => ROLES.includes(profile?.role);
  const fmt = d => new Intl.DateTimeFormat('es-DO',{dateStyle:'medium'}).format(new Date(d+'T00:00:00'));
  const time = t => t ? String(t).slice(0,5) : '';
  const toast = (m, err=false) => { const e=document.createElement('div'); e.className='toast'+(err?' error':''); e.textContent=m; document.body.appendChild(e); setTimeout(()=>e.remove(),3500); };
  const today = () => { const d=new Date(); return new Date(d.getFullYear(),d.getMonth(),d.getDate()); };
  const status = date => { const d=new Date(date+'T00:00:00'), t=today(); return d<t?'completed':d.getTime()===t.getTime()?'today':'upcoming'; };
  async function init(){
    if(!window.supabase || !window.RV_CONFIG?.SUPABASE_URL) return;
    sb=window.supabase.createClient(window.RV_CONFIG.SUPABASE_URL,window.RV_CONFIG.SUPABASE_ANON_KEY);
    const s=await sb.auth.getSession(); session=s.data?.session||null;
    if(session) await loadProfile();
    injectNav();
    if(session) await load();
    sb.auth.onAuthStateChange(async (_e,s)=>{session=s; if(s){await loadProfile();injectNav();} else {profile=null;events=[];}});
  }
  async function loadProfile(){ const r=await sb.from('profiles').select('role,full_name').eq('id',session.user.id).maybeSingle(); profile=r.data||{role:'voluntario'}; }
  async function load(){
    const [er,cr]=await Promise.all([
      sb.from('eventos').select('*').eq('is_active',true).order('fecha',{ascending:true}).order('hora',{ascending:true}),
      sb.from('centros_educativos').select('id,nombre').eq('is_active',true).order('nombre')
    ]);
    if(er.error) throw er.error; events=er.data||[]; centers=cr.data||[];
  }
  function injectNav(){
    const nav=document.querySelector('.sidebar nav'); if(!nav || nav.querySelector('[data-r17-calendar]')) return;
    const b=document.createElement('button'); b.className='nav-item'; b.dataset.r17Calendar='1'; b.innerHTML='<span>📅</span>Calendario'; b.onclick=e=>{e.preventDefault();open();}; nav.insertBefore(b,nav.querySelector('[data-view="map"]')||nav.lastElementChild);
  }
  function daysIn(y,m){return new Date(y,m+1,0).getDate()}
  function calendarGrid(){
    const y=month.getFullYear(), m=month.getMonth(), first=new Date(y,m,1), start=(first.getDay()+6)%7, total=daysIn(y,m), cells=[];
    for(let i=0;i<start;i++) cells.push('<div class="cal-day muted"></div>');
    for(let d=1;d<=total;d++){
      const iso=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const ev=events.filter(x=>x.fecha===iso); cells.push(`<div class="cal-day ${iso===isoToday()?'is-today':''}"><b>${d}</b>${ev.slice(0,4).map(e=>`<button class="cal-event" data-event="${e.id}"><span>${time(e.hora)}</span>${esc(e.nombre)}</button>`).join('')}${ev.length>4?`<small>+${ev.length-4} más</small>`:''}</div>`);
    }
    return cells.join('');
  }
  function isoToday(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
  function timeline(){
    const list=[...events].sort((a,b)=>`${a.fecha}${a.hora||''}`.localeCompare(`${b.fecha}${b.hora||''}`));
    return list.map(e=>`<div class="timeline-item"><div class="timeline-dot ${status(e.fecha)}"></div><div class="timeline-date">${fmt(e.fecha)}${e.hora?`<br><small>${time(e.hora)}</small>`:''}</div><div class="timeline-card"><div class="timeline-top"><div><h4>${esc(e.nombre)}</h4><p>${esc(e.direccion||'Sin ubicación')}</p></div><span class="timeline-status ${status(e.fecha)}">${status(e.fecha)==='completed'?'Completado':status(e.fecha)==='today'?'Hoy':'Próximo'}</span></div><p>${esc(e.descripcion||'Sin descripción')}</p><div class="card-actions"><button class="btn small primary" data-event="${e.id}">Ver detalle</button>${canManage()?`<button class="btn small" data-edit="${e.id}">Editar</button><button class="btn small danger" data-delete="${e.id}">Eliminar</button>`:''}</div></div></div>`).join('')||'<div class="empty"><div class="empty-icon">🗓️</div><h3>No hay eventos</h3><p>Agrega el primer evento para comenzar el cronograma.</p></div>';
  }
  function detail(e){
    const o=document.createElement('div');o.className='overlay';o.innerHTML=`<div class="modal calendar-detail"><div class="modal-head"><div><h3>${esc(e.nombre)}</h3><p>${fmt(e.fecha)}${e.hora?' · '+time(e.hora):''}</p></div><button class="icon-btn" data-close>×</button></div><div class="modal-body"><div class="detail-grid"><div><span>📅 Fecha</span><strong>${fmt(e.fecha)}</strong></div><div><span>⏰ Hora</span><strong>${e.hora?time(e.hora):'No especificada'}</strong></div><div><span>📍 Lugar</span><strong>${esc(e.direccion||'No especificado')}</strong></div><div><span>🏫 Centro</span><strong>${esc(centers.find(c=>c.id===e.centro_id)?.nombre||'No asociado')}</strong></div></div><div class="detail-description"><b>Descripción</b><p>${esc(e.descripcion||'Sin descripción')}</p></div><div class="modal-actions">${canManage()?`<button class="btn" data-edit>Editar</button>`:''}<button class="btn primary" data-close>Cerrar</button></div></div></div>`;document.body.appendChild(o);o.querySelectorAll('[data-close]').forEach(x=>x.onclick=()=>o.remove());o.querySelector('[data-edit]')?.addEventListener('click',()=>{o.remove();form(e)});}
  function form(existing=null){
    const o=document.createElement('div');o.className='overlay';o.innerHTML=`<div class="modal"><div class="modal-head"><div><h3>${existing?'Editar evento':'Nuevo evento'}</h3><p>Se guarda en la tabla existente <b>eventos</b>.</p></div><button class="icon-btn" data-close>×</button></div><div class="modal-body"><form id="eventForm"><div class="form-grid"><field><label>Nombre</label><input name="nombre" required maxlength="180" value="${esc(existing?.nombre)}"></field><field><label>Fecha</label><input name="fecha" type="date" required value="${esc(existing?.fecha)}"></field><field><label>Hora</label><input name="hora" type="time" value="${esc(time(existing?.hora))}"></field><field><label>Centro educativo</label><select name="centro_id"><option value="">Sin centro</option>${centers.map(c=>`<option value="${c.id}" ${existing?.centro_id===c.id?'selected':''}>${esc(c.nombre)}</option>`).join('')}</select></field></div><field><label>Dirección / lugar</label><input name="direccion" maxlength="250" value="${esc(existing?.direccion)}"></field><field><label>Descripción</label><textarea name="descripcion" maxlength="2000">${esc(existing?.descripcion)}</textarea></field><div class="modal-actions"><button type="button" class="btn" data-close>Cancelar</button><button class="btn primary">${existing?'Guardar cambios':'Crear evento'}</button></div></form></div></div>`;document.body.appendChild(o);o.querySelector('[data-close]').onclick=()=>o.remove();o.querySelector('form').onsubmit=async ev=>{ev.preventDefault();const b=ev.submitter;b.disabled=true;b.textContent='Guardando…';const fd=new FormData(ev.target),p={nombre:String(fd.get('nombre')).trim(),fecha:fd.get('fecha'),hora:fd.get('hora')||null,direccion:String(fd.get('direccion')).trim()||null,descripcion:String(fd.get('descripcion')).trim()||null,centro_id:fd.get('centro_id')||null};try{let r=existing?await sb.from('eventos').update({...p,updated_at:new Date().toISOString()}).eq('id',existing.id):await sb.from('eventos').insert({...p,created_by:session.user.id,is_active:true});if(r.error)throw r.error;o.remove();await load();refresh();toast(existing?'Evento actualizado':'Evento creado')}catch(e){console.error(e);toast(e.message||'No se pudo guardar el evento',true);b.disabled=false;b.textContent=existing?'Guardar cambios':'Crear evento'}}}
  function refresh(){const body=document.getElementById('r17CalendarBody');if(body) body.innerHTML=bodyHTML();bind(body?.parentElement||document)}
  function bodyHTML(){return mode==='calendar'?`<div class="calendar-head"><button class="btn small" data-prev>‹</button><h3>${month.toLocaleString('es-DO',{month:'long',year:'numeric'})}</h3><button class="btn small" data-next>›</button><button class="btn small" data-today>Hoy</button></div><div class="cal-week">${['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(x=>`<b>${x}</b>`).join('')}</div><div class="cal-grid">${calendarGrid()}</div>`:`<div class="timeline">${timeline()}</div>`}
  function bind(root){root.querySelector('[data-prev]')?.addEventListener('click',()=>{month.setMonth(month.getMonth()-1);refresh()});root.querySelector('[data-next]')?.addEventListener('click',()=>{month.setMonth(month.getMonth()+1);refresh()});root.querySelector('[data-today]')?.addEventListener('click',()=>{month=new Date();refresh()});root.querySelectorAll('[data-event]').forEach(b=>b.onclick=()=>{const e=events.find(x=>x.id===b.dataset.event);if(e)detail(e)});root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{const e=events.find(x=>x.id===b.dataset.edit);if(e)form(e)});root.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{const e=events.find(x=>x.id===b.dataset.delete);if(!e||!confirm(`¿Eliminar "${e.nombre}"?`))return;const r=await sb.from('eventos').update({is_active:false,updated_at:new Date().toISOString()}).eq('id',e.id);if(r.error)return toast(r.error.message,true);await load();refresh();toast('Evento eliminado')})}
  async function open(){if(!session)return toast('Inicia sesión para acceder al calendario',true);try{await load()}catch(e){toast('No se pudieron cargar los eventos',true);return}const o=document.createElement('div');o.className='overlay';o.id='r17Calendar';o.innerHTML=`<div class="modal calendar-modal"><div class="modal-head"><div><h3>📅 Calendario Regional 17</h3><p>Eventos y planificación regional</p></div><div class="modal-head-actions"><button class="btn small ${mode==='calendar'?'primary':''}" data-mode="calendar">Calendario</button><button class="btn small ${mode==='timeline'?'primary':''}" data-mode="timeline">Cronograma</button>${canManage()?'<button class="btn small primary" data-add>＋ Evento</button>':''}<button class="icon-btn" data-close>×</button></div></div><div class="modal-body" id="r17CalendarBody">${bodyHTML()}</div></div>`;document.body.appendChild(o);o.querySelector('[data-close]').onclick=()=>o.remove();o.addEventListener('click',e=>{if(e.target===o)o.remove()});o.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;o.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('primary',x.dataset.mode===mode));refresh()});o.querySelector('[data-add]')?.addEventListener('click',()=>form());bind(o)}
  window.R17Calendar={open};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
