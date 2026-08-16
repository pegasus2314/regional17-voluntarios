/* Regional 17 Volunteers — navegación segura y módulos */
(() => {
  'use strict';
  const MAP_RE = /^\s*mapa\s*$/i;
  const DESCRIPTIONS = {
    Dashboard:'Resumen general de la gestión',
    Voluntarios:'Registro y seguimiento del equipo',
    Actividades:'Planificación y control operativo',
    'Centros educativos':'Centros de la Regional 17',
    Eventos:'Agenda y compromisos',
    Estadísticas:'Indicadores y desempeño',
    Biblioteca:'Recursos académicos y documentos',
    Calendario:'Agenda y planificación regional'
  };

  let calendarLoading = false;
  function loadCalendar(){
    if (window.R17Calendar || document.querySelector('script[data-r17-calendar]') || calendarLoading) return;
    calendarLoading = true;
    const s=document.createElement('script');
    s.src='calendar.js?v=20260816';
    s.dataset.r17Calendar='1';
    s.onload=()=>{ calendarLoading=false; window.R17Calendar?.install?.(); };
    s.onerror=()=>{ calendarLoading=false; };
    document.body.appendChild(s);
  }

  function enhanceNav(){
    const nav=document.querySelector('.sidebar nav');
    if(!nav) return;

    // El mapa ya no forma parte de la aplicación.
    nav.querySelectorAll('.nav-item').forEach(btn=>{
      if(MAP_RE.test((btn.textContent||'').trim())) btn.remove();
    });

    // Agrega descripciones sin alterar la navegación existente.
    nav.querySelectorAll('.nav-item').forEach(btn=>{
      const label=(btn.textContent||'').replace(/^[^A-Za-zÁÉÍÓÚáéíóúÑñ]+/,'').trim();
      const description=DESCRIPTIONS[label];
      if(!description || btn.dataset.r17Enhanced==='1') return;
      const icon=btn.querySelector('span:first-child');
      const copy=document.createElement('span');
      copy.className='r17-nav-copy';
      copy.innerHTML=`<strong>${label}</strong><small>${description}</small>`;
      btn.dataset.r17Enhanced='1';
      if(icon){ btn.textContent=''; btn.appendChild(icon); }
      btn.appendChild(copy);
    });
  }

  function fix(){
    enhanceNav();
    loadCalendar();
  }

  const schedule=(()=>{let pending=false;return()=>{if(pending)return;pending=true;setTimeout(()=>{pending=false;fix()},0)}})();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fix,{once:true});
  else fix();
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
})();
