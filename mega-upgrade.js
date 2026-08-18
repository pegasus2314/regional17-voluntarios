/* Regional 17 — interaction/accessibility layer */
(()=>{'use strict';
const enhance=()=>{
 document.querySelectorAll('.modal').forEach(m=>{m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');const h=m.querySelector('.modal-head h3');if(h){if(!h.id)h.id='rv-dialog-title-'+Math.random().toString(36).slice(2);m.setAttribute('aria-labelledby',h.id)}});
 document.querySelectorAll('.modal input,.modal select,.modal textarea').forEach(el=>{const field=el.closest('field');const label=field?.querySelector('label');if(label&&!el.getAttribute('aria-label'))el.setAttribute('aria-label',label.textContent.trim());if(el.required)el.setAttribute('aria-required','true')});
 document.querySelectorAll('.search input').forEach(el=>{el.setAttribute('aria-label','Buscar');el.setAttribute('autocomplete','off')});
 document.querySelectorAll('button[title]').forEach(b=>{if(!b.getAttribute('aria-label'))b.setAttribute('aria-label',b.title)});
 document.querySelectorAll('.toast').forEach(t=>{t.setAttribute('role',t.classList.contains('error')?'alert':'status');t.setAttribute('aria-live','polite')});
};
let lastFocus=null;
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){const o=document.querySelector('.overlay');if(o){o.remove();return}document.querySelector('.sidebar.open')?.classList.remove('open')}
 if(e.key==='/'&&!/input|textarea|select/i.test(document.activeElement?.tagName||'')){const s=document.querySelector('.search input');if(s){e.preventDefault();s.focus();s.select()}}
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();const s=document.querySelector('.search input');if(s){s.focus();s.select()}else document.querySelector('.mobile-menu')?.click()}
});
document.addEventListener('click',e=>{const nav=e.target.closest('.nav-item,[data-view]');if(nav&&window.innerWidth<=760)document.querySelector('.sidebar.open')?.classList.remove('open');const close=e.target.closest('[data-close]');if(close)lastFocus=null});
new MutationObserver(enhance).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance);else enhance();
})();
