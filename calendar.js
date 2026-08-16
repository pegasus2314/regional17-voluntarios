/* Regional 17 Volunteers — calendar + schedule module */
(() => {
  'use strict';
  const esc = v => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const fmt = d => new Intl.DateTimeFormat('es-DO',{day:'numeric',month:'long',year:'numeric'}).format(new Date(d+'T00:00:00'));
  const monthFmt = d => new Intl.DateTimeFormat('es-DO',{month:'long',year:'numeric'}).format(d);
  const key = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const supabaseClient = () => window.supabase.createClient(window.RV_CONFIG.SUPABASE_URL,window.RV_CONFIG.SUPABASE_ANON_KEY);
  let items=[], cursor=new Date();

  const style = document.createElement('style');
  style.textContent = `
    .r17-calendar-shell{display:grid;gap:16px}
    .r17-calendar-hero{background:linear-gradient(135deg,#071b35,#174777);border-radius:18px;padding:24px;color:#fff;display:flex;justify-content:space-between;align-items:center;gap:20px;overflow:hidden;position:relative}
    .r17-calendar-hero:after{content:'';position:absolute;width:180px;height:180px;border-radius:50%;right:-55px;top:-70px;background:#f3b34322;border:1px solid #ffffff18}
    .r17-calendar-hero h2{margin:5px 0;font-size:24px}.r17-calendar-hero p{margin:0;color:#c9d8e9;font-size:11px}.r17-kicker{font-size:9px;letter-spacing:1.5px;font-weight:800;color:#ffd477}
    .r17-calendar-tools{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}.r17-month-nav{display:flex;align-items:center;gap:8px}.r17-month-title{text-transform:capitalize;font-size:18px;font-weight:800;min-width:190px;text-align:center}
    .r17-icon-btn{border:1px solid var(--line);background:#fff;color:var(--navy2);width:36px;height:36px;border-radius:9px;font-weight:800}.r17-icon-btn:hover{background:#f5f8fc}
    .r17-tabs{display:flex;background:#e9eef5;border-radius:10px;padding:3px}.r17-tab{border:0;background:transparent;padding:8px 12px;border-radius:8px;font-size:10px;font-weight:800;color:#667085}.r17-tab.active{background:#fff;color:#0d315d;box-shadow:0 1px 4px #071b3512}
    .r17-calendar-grid{background:#fff;border:1px solid var(--line);border-radius:15px;overflow:hidden}.r17-weekdays,.r17-days{display:grid;grid-template-columns:repeat(7,1fr)}.r17-weekdays{background:#f8fafc;border-bottom:1px solid var(--line)}.r17-weekdays div{padding:10px;text-align:center;font-size:9px;font-weight:800;text-transform:uppercase;color:#7b8798}
    .r17-day{min-height:115px;border-right:1px solid #edf1f5;border-bottom:1px solid #edf1f5;padding:8px;position:relative;background:#fff}.r17-day:nth-child(7n){border-right:0}.r17-day.muted{background:#fbfcfe;color:#b4bdc9}.r17-day.today{background:#fffaf0}.r17-day-number{font-size:10px;font-weight:800;display:flex;justify-content:space-between;align-items:center;margin-bottom:5px}.r17-day-number b{width:24px;height:24px;border-radius:8px;display:grid;place-items:center}.r17-day.today .r17-day-number b{background:#f3b343;color:#3c2b05}
    .r17-event-chip{display:block;width:100%;border:0;text-align:left;border-radius:7px;padding:5px 6px;margin:3px 0;background:#edf4fb;color:#174777;font-size:8px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.r17-event-chip.activity{background:#e9f7f0;color:#18734d}.r17-event-chip.event{background:#fff2d9;color:#94620a}.r17-event-chip small{opacity:.7;font-weight:600}
    .r17-agenda{display:grid;gap:10px}.r17-agenda-day{background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden}.r17-agenda-head{padding:12px 15px;background:#f8fafc;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--line)}.r17-agenda-date{width:42px;height:42px;border-radius:11px;background:#0d315d;color:#ffd477;display:grid;place-items:center}.r17-agenda-date b{font-size:17px}.r17-agenda-date span{font-size:7px;text-transform:uppercase}.r17-agenda-head strong{font-size:12px;text-transform:capitalize}.r17-agenda-head small{display:block;color:#7b8798;font-size:9px;margin-top:3px}.r17-agenda-item{display:flex;gap:12px;padding:12px 15px;border-bottom:1px solid #edf1f5;align-items:flex-start}.r17-agenda-item:last-child{border-bottom:0}.r17-time{width:48px;color:#0d315d;font-weight:800;font-size:10px;padding-top:2px}.r17-dot{width:8px;height:8px;border-radius:50%;background:#1e9b62;margin-top:3px;flex:none}.r17-dot.event{background:#f3b343}.r17-agenda-item strong{font-size:11px}.r17-agenda-item p{font-size:9px;color:#667085;margin:4px 0 0}.r17-empty{padding:40px;text-align:center;color:#7b8798;background:#fff;border:1px solid var(--line);border-radius:14px}.r17-empty b{display:block;font-size:25px;margin-bottom:8px}.r17-calendar-legend{display:flex;gap:12px;flex-wrap:wrap;font-size:9px;color:#667085}.r17-calendar-legend span{display:flex;align-items:center;gap:5px}.r17-calendar-legend i{width:8px;height:8px;border-radius:50%;background:#1e9b62}.r17-calendar-legend i.event{background:#f3b343}
    @media(max-width:760px){.r17-calendar-hero{padding:20px}.r17-calendar-hero h2{font-size:20px}.r17-month-title{min-width:150px;font-size:15px}.r17-day{min-height:82px;padding:5px}.r17-weekdays div{padding:7px 2px;font-size:7px}.r17-day-number{font-size:8px}.r17-day-number b{width:21px;height:21px}.r17-event-chip{font-size:7px;padding:4px}.r17-event-chip small{display:none}}
  `;
  document.head.appendChild(style);

  async function load(){
    try{
      const sb=supabaseClient();
      const [a,e]=await Promise.all([
        sb.from('actividades').select('*').eq('is_active',true).order('fecha',{ascending:true}),
        sb.from('eventos').select('*').eq('is_active',true).order('fecha',{ascending:true})
      ]);
      if(a.error)throw a.error;if(e.error)throw e.error;
      items=[...(a.data||[]).map(x=>({...x,_type:'activity'})),...(e.data||[]).map(x=>({...x,_type:'event'}))];
      render();
    }catch(err){console.error(err);const c=document.getElementById('content');if(c)c.innerHTML='<div class="r17-empty"><b>⚠</b>No se pudo cargar el calendario.</div>'}
  }

  function monthDays(){
    const first=new Date(cursor.getFullYear(),cursor.getMonth(),1), start=new Date(first);start.setDate(first.getDate()-((first.getDay()+6)%7));
    return Array.from({length:42},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return d});
  }
  function forDay(d){const k=key(d);return items.filter(x=>x.fecha===k).sort((a,b)=>(a.hora||'').localeCompare(b.hora||''));}
  function chip(x){return `<button class="r17-event-chip ${x._type==='event'?'event':'activity'}" data-cal-id="${esc(x.id)}" data-cal-type="${x._type}">${x.hora?`<small>${esc(x.hora.slice(0,5))} · </small>`:''}${esc(x.nombre)}</button>`}
  function calendarView(){
    const days=monthDays();
    return `<div class="r17-calendar-grid"><div class="r17-weekdays"><div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div><div>Dom</div></div><div class="r17-days">${days.map(d=>{const same=d.getMonth()===cursor.getMonth(),today=key(d)===key(new Date());return `<div class="r17-day ${same?'':'muted'} ${today?'today':''}"><div class="r17-day-number"><b>${d.getDate()}</b>${forDay(d).length?`<span>${forDay(d).length}</span>`:''}</div>${forDay(d).slice(0,4).map(chip).join('')}${forDay(d).length>4?`<small>+${forDay(d).length-4} más</small>`:''}</div>`}).join('')}</div></div>`;
  }
  function agendaView(){
    const start=new Date(cursor.getFullYear(),cursor.getMonth(),1),end=new Date(cursor.getFullYear(),cursor.getMonth()+1,0);
    const days=[];for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1)){const copy=new Date(d),rows=forDay(copy);if(rows.length)days.push({d:copy,rows})}
    if(!days.length)return '<div class="r17-empty"><b>🗓</b>No hay actividades programadas este mes.</div>';
    return `<div class="r17-agenda">${days.map(({d,rows})=>`<section class="r17-agenda-day"><header class="r17-agenda-head"><div class="r17-agenda-date"><b>${d.getDate()}</b><span>${d.toLocaleString('es-DO',{weekday:'short'}).replace('.','')}</span></div><div><strong>${d.toLocaleString('es-DO',{weekday:'long'})}</strong><small>${fmt(key(d))}</small></div></header>${rows.map(x=>`<div class="r17-agenda-item"><div class="r17-time">${x.hora?esc(x.hora.slice(0,5)):'Todo el día'}</div><i class="r17-dot ${x._type==='event'?'event':''}"></i><div><strong>${esc(x.nombre)}</strong><p>${esc(x.direccion||'Sin ubicación')}${x.descripcion?` · ${esc(x.descripcion)}`:''}</p></div><span class="pill ${x._type==='event'?'neutral':'success'}">${x._type==='event'?'Evento':'Actividad'}</span></div>`).join('')}</section>`).join('')}</div>`;
  }
  function render(){
    const c=document.getElementById('content');if(!c)return;
    c.innerHTML=`<div class="r17-calendar-shell"><div class="r17-calendar-hero"><div><span class="r17-kicker">PLANIFICACIÓN REGIONAL</span><h2>Calendario y cronograma</h2><p>Visualiza actividades y eventos de Regional 17 en una sola agenda.</p></div><div style="font-size:42px;position:relative;z-index:1">🗓️</div></div><div class="r17-calendar-tools"><div class="r17-month-nav"><button class="r17-icon-btn" id="r17-prev">‹</button><div class="r17-month-title">${monthFmt(cursor)}</div><button class="r17-icon-btn" id="r17-next">›</button><button class="btn small" id="r17-today">Hoy</button></div><div class="r17-tabs"><button class="r17-tab active" data-cal-tab="calendar">Calendario</button><button class="r17-tab" data-cal-tab="agenda">Cronograma</button></div></div><div class="r17-calendar-legend"><span><i></i> Actividades</span><span><i class="event"></i> Eventos</span></div><div id="r17-cal-body">${window.__r17CalTab==='agenda'?agendaView():calendarView()}</div></div>`;
    document.getElementById('r17-prev').onclick=()=>{cursor.setMonth(cursor.getMonth()-1);render()};
    document.getElementById('r17-next').onclick=()=>{cursor.setMonth(cursor.getMonth()+1);render()};
    document.getElementById('r17-today').onclick=()=>{cursor=new Date();render()};
    document.querySelectorAll('[data-cal-tab]').forEach(b=>b.onclick=()=>{window.__r17CalTab=b.dataset.calTab;render()});
  }
  function activate(){
    const nav=document.querySelector('.sidebar nav');if(!nav)return;
    if(!nav.querySelector('[data-r17-calendar]')){const b=document.createElement('button');b.className='nav-item';b.dataset.r17Calendar='1';b.innerHTML='<span>▦</span>Calendario';b.onclick=()=>{window.__r17CalendarActive=true;document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));b.classList.add('active');const h=document.querySelector('.topbar h1');if(h)h.textContent='Calendario y cronograma';load()};nav.appendChild(b)}
  }
  const observer=new MutationObserver(activate);observer.observe(document.body,{childList:true,subtree:true});
  const boot=()=>setTimeout(activate,250);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.__r17OpenCalendar=()=>{window.__r17CalendarActive=true;activate();document.querySelector('[data-r17-calendar]')?.click()};
})();
