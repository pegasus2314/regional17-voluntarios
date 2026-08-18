// Créditos institucionales MUN Regional 17
(function(){
  'use strict';
  function addCredits(){
    if(document.getElementById('mun-credits')) return;
    const footer=document.createElement('footer');
    footer.id='mun-credits';
    footer.style.cssText='margin:32px auto 18px;padding:18px 24px;text-align:center;max-width:1100px;border-top:1px solid rgba(127,127,127,.18);font-family:Inter,system-ui,sans-serif;opacity:.9;line-height:1.6';
    footer.innerHTML='<div style="font-weight:800;font-size:14px;letter-spacing:.04em">MUN REGIONAL 17</div><div style="font-size:13px;margin-top:5px">Fundado por <strong>Albert Jesús Silvestre Javier</strong> · Secretario General</div><div style="font-size:13px">Gelson López · Secretario de Capacitaciones</div>';
    const app=document.getElementById('app');
    if(app) app.appendChild(footer); else document.body.appendChild(footer);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addCredits); else addCredits();
  new MutationObserver(addCredits).observe(document.body,{childList:true,subtree:true});
})();
