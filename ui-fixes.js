/* Regional 17 Volunteers — módulos auxiliares, sin alterar el diseño original */
(() => {
  'use strict';
  const MAP_RE = /^\s*Mapa\s*$/i;
  let calendarLoading = false;
  function loadCalendar(){
    if(window.R17Calendar||document.querySelector('script[data-r17-calendar]')||calendarLoading)return;
    calendarLoading=true;
    const s=document.createElement('script');
    s.src='calendar.js?v=20260816';
    s.dataset.r17Calendar='1';
    s.onload=()=>{calendarLoading=false;window.R17Calendar?.install?.()};
    s.onerror=()=>{calendarLoading=false};
    document.body.appendChild(s);
  }
  function removeMapOnly(){document.querySelectorAll('.sidebar .nav-item').forEach(btn=>{if(MAP_RE.test((btn.textContent||'').trim()))btn.remove()})}
  function fix(){removeMapOnly();loadCalendar()}
  let pending=false;
  const schedule=()=>{if(pending)return;pending=true;setTimeout(()=>{pending=false;fix()},40)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix,{once:true});else fix();
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
})();
