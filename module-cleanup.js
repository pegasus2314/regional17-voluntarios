(()=>{'use strict';
const MUN_RE=/(^|\s)(mun|modelo distrital|modelo digital|modelo de centro|delegados|comisiones|mesas)(\s|$)/i;
function clean(){
 document.querySelectorAll('.nav-item,[role="button"]').forEach(el=>{const t=(el.textContent||'').replace(/\s+/g,' ').trim();if(MUN_RE.test(t))el.remove()});
 document.querySelectorAll('.nav-group[data-group="gestion"],.nav-group[data-group="modelos"]').forEach(el=>el.remove());
}
function boot(){clean();new MutationObserver(clean).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
