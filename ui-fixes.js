/* Regional 17 Volunteers — UI safety + module loader */
(() => {
  'use strict';
  const removeMap=()=>document.querySelectorAll('[data-view="map"]').forEach(x=>x.remove());
  const filterCards=(inputId,selector)=>{const input=document.getElementById(inputId);if(!input)return;const q=input.value.toLowerCase().trim();document.querySelectorAll(selector).forEach(card=>{card.style.display=!q||card.textContent.toLowerCase().includes(q)?'':'none'})};
  const loadCalendar=()=>{
    if(document.querySelector('script[data-r17-calendar-script]')||window.R17Calendar)return;
    const s=document.createElement('script');s.src='calendar.js?v=20260816';s.async=false;s.dataset.r17CalendarScript='1';s.onload=()=>window.R17Calendar?.install?.();document.body.appendChild(s);
  };
  const fix=()=>{
    removeMap();
    loadCalendar();
    const aq=document.getElementById('activityQ');if(aq&&!aq.dataset.fixed){aq.dataset.fixed='1';aq.addEventListener('input',()=>filterCards('activityQ','.activity-card'))}
    const eq=document.getElementById('eq');if(eq&&!eq.dataset.fixed){eq.dataset.fixed='1';eq.addEventListener('input',()=>filterCards('eq','.event-card'))}
  };
  new MutationObserver(fix).observe(document.body,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix,{once:true});else fix();
})();
