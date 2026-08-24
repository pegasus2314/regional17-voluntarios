(()=>{'use strict';
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
const text=n=>norm(n?.textContent||'');
const keyOf=n=>norm(n?.dataset?.view||n?.id||text(n));
const isRemoved=n=>{const t=text(n),v=norm(n?.dataset?.view||'');return t.includes('modelo de centro')||t.includes('modelo distrital')||t.includes('modelo digital')||v.includes('modelo')||n?.dataset?.munEntry||n?.dataset?.munView||n?.dataset?.munCat};
function items(nav){return [...nav.querySelectorAll('.nav-item,[data-view]')].filter(n=>!n.classList.contains('nav-group-head')&&!n.classList.contains('r17-sidebar-collapse')&&!n.dataset.r17GroupProxy&&!isRemoved(n))}
function unique(list){const seen=new Set();return list.filter(n=>{const k=keyOf(n);if(!k||seen.has(k)){n.remove();return false}seen.add(k);return true})}
function button(key,label,icon,external=false){const b=document.createElement(external?'a':'button');b.className='nav-item r17-flat-item';if(!external)b.type='button';b.dataset.view=key;b.innerHTML=`<span>${icon}</span><span>${label}</span>`;if(external){b.href='https://plerd-evaluacion-scoreboard-five.vercel.app/';b.target='_blank';b.rel='noopener noreferrer'}return b}
function makeFlat(nav){const raw=unique(items(nav));const byKey=new Map(raw.map(n=>[keyOf(n),n]));const out=[];
 const add=(key,label,icon,external=false)=>{let n=byKey.get(key);if(n){n.classList.add('r17-flat-item');n.innerHTML=`<span>${icon}</span><span>${label}</span>`;byKey.delete(key)}else n=button(key,label,icon,external);if(key==='acreditacion'&&!external){n.onclick=e=>{e.preventDefault();e.stopPropagation();if(typeof window.openAcreditacionDelegados==='function')window.openAcreditacionDelegados();else window.dispatchEvent(new CustomEvent('r17:open-acreditacion'))}}out.push(n)};
 add('dashboard','Dashboard','⌂');
 add('volunteers','Voluntarios','👥');
 add('acreditacion','Acreditación','🪪');
 add('centers','Centros educativos','🏫');
 add('activities','Actividades','✓');
 add('events','Eventos','◷');
 add('map','Mapa','⌖');
 add('stats','Estadísticas','▥');
 add('distritos','Distritos','📍');
 add('evaluacion','Evaluaciones','📊',true);
 add('resultados','Resultados','📈');
 add('ranking','Ranking','🏆');
 raw.forEach(n=>{if(byKey.has(keyOf(n))){n.classList.add('r17-flat-item');out.push(n);byKey.delete(keyOf(n))}});
 nav.innerHTML='';out.forEach(n=>nav.appendChild(n));nav.dataset.r17Organized='1';
 const sidebar=nav.closest('.sidebar');if(sidebar){sidebar.querySelectorAll('.r17-sidebar-collapse').forEach(x=>x.remove())}
}
let currentNav=null;function check(){const nav=document.querySelector('.sidebar nav');if(!nav)return;if(nav!==currentNav||nav.dataset.r17Organized!=='1'){currentNav=nav;makeFlat(nav);return}}
function boot(){check();document.addEventListener('r17:sidebar-rendered',check)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();