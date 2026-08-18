// Créditos institucionales MUN Regional 17
(function(){
  'use strict';
  function addCredits(){
    const content=document.getElementById('content');
    if(!content)return;
    const existing=document.getElementById('mun-credits');
    const dashboard=!!content.querySelector('.hero');
    if(!dashboard){if(existing)existing.remove();return}
    if(existing)return;
    const card=document.createElement('section');
    card.id='mun-credits';
    card.className='panel';
    card.style.cssText='margin:20px 0 8px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap';
    card.innerHTML='<div><div style="font-size:11px;font-weight:800;letter-spacing:.12em;opacity:.65">MUN REGIONAL 17</div><h3 style="margin:5px 0 4px">Equipo fundador y de capacitación</h3><p style="margin:0;opacity:.75">Fundado por <strong>Albert Jesús Silvestre Javier</strong> · Secretario General</p><p style="margin:3px 0 0;opacity:.75"><strong>Gelson López</strong> · Secretario de Capacitaciones</p></div><div style="font-size:30px;opacity:.7">🏛️</div>';
    content.appendChild(card);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addCredits);else addCredits();
  new MutationObserver(addCredits).observe(document.body,{childList:true,subtree:true});
})();