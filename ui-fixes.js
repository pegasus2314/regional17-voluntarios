/* Regional 17 Volunteers — UI safety fixes */
(() => {
  'use strict';
  const removeMap=()=>document.querySelectorAll('[data-view="map"]').forEach(x=>x.remove());
  const filterCards=(inputId,selector)=>{const input=document.getElementById(inputId);if(!input)return;const q=input.value.toLowerCase().trim();document.querySelectorAll(selector).forEach(card=>{card.style.display=!q||card.textContent.toLowerCase().includes(q)?'':'none'})};
  const fix=()=>{removeMap();const aq=document.getElementById('activityQ');if(aq&&!aq.dataset.fixed){aq.dataset.fixed='1';aq.addEventListener('input',()=>filterCards('activityQ','.activity-card'))}const eq=document.getElementById('eq');if(eq&&!eq.dataset.fixed){eq.dataset.fixed='1';eq.addEventListener('input',()=>filterCards('eq','.event-card'))}};
  new MutationObserver(fix).observe(document.body,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix,{once:true});else fix();
})();
