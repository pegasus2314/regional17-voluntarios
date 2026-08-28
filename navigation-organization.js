(()=>{'use strict';
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
const text=n=>norm(n?.textContent||'');
const canonical=n=>{const v=norm(n?.dataset?.view||''),t=text(n);if(v==='accreditation'||v==='acreditacion'||t==='acreditacion')return'acreditacion';if(v==='ranking'||t==='ranking')return'__removed_ranking';if(v==='distrito'||v==='distritos'||t==='distrito'||t==='distritos')return'__removed_distritos';return norm(n?.dataset?.view||n?.id||t)};
const isRemoved=n=>{const t=text(n),v=norm(n?.dataset?.view||'');return t.includes('modelo de centro')||t.includes('modelo distrital')||t.includes('modelo digital')||t==='ranking'||t==='distrito'||t==='distritos'||v==='ranking'||v==='distrito'||v==='distritos'||v.includes('modelo')||n?.dataset?.munEntry||n?.dataset?.munView||n?.dataset?.munCat};
function items(nav){return [...nav.querySelectorAll('.nav-item,[data-view]')].filter(n=>!n.classList.contains('nav-group-head')&&!n.classList.contains('r17-sidebar-collapse')&&!n.dataset.r17GroupProxy&&!isRemoved(n))}
function unique(list){const seen=new Set();return list.filter(n=>{const k=canonical(n);if(!k||seen.has(k)){n.remove();return false}seen.add(k);return true})}
function button(key,label,icon,external=false){const b=document.createElement(external?'a':'button');b.className='nav-item r17-flat-item';if(!external)b.type='button';b.dataset.view=key;b.innerHTML=`<span>${icon}</span><span>${label}</span>`;if(external){b.href='https://plerd-evaluacion-scoreboard-five.vercel.app/';b.target='_blank';b.rel='noopener noreferrer'}return b}
function injectInstitutionalStyle(){if(document.getElementById('r17-institutional-sidebar'))return;const s=document.createElement('style');s.id='r17-institutional-sidebar';s.textContent=`
.sidebar{width:280px!important;min-width:280px!important;background:linear-gradient(180deg,#071b35 0%,#0b2b50 55%,#0a2544 100%)!important;padding:20px 14px!important;border-right:1px solid rgba(255,255,255,.08)!important;box-shadow:8px 0 28px rgba(7,27,53,.10)!important;overflow-y:auto!important;overflow-x:hidden!important;}
.sidebar .brand{padding:4px 10px 22px!important;margin-bottom:8px!important;border-bottom:1px solid rgba(255,255,255,.10)!important;}
.sidebar .brand-mark{width:44px!important;height:44px!important;border-radius:12px!important;flex:0 0 44px!important;box-shadow:0 6px 16px rgba(0,0,0,.16)!important;}
.sidebar .brand strong{font-size:15px!important;letter-spacing:.2px!important;color:#fff!important;white-space:nowrap!important;}
.sidebar .brand span{font-size:10px!important;color:#9fb2c9!important;letter-spacing:.5px!important;text-transform:uppercase!important;}
.sidebar nav{display:flex!important;flex-direction:column!important;gap:5px!important;width:100%!important;margin-top:10px!important;}
.sidebar nav .r17-flat-item{width:100%!important;min-width:0!important;height:46px!important;min-height:46px!important;box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:12px!important;padding:0 13px!important;margin:0!important;border:1px solid transparent!important;border-radius:10px!important;background:transparent!important;color:#b8c8da!important;font-size:13px!important;font-weight:600!important;line-height:1!important;text-decoration:none!important;white-space:nowrap!important;overflow:visible!important;text-align:left!important;}
.sidebar nav .r17-flat-item>span:first-child{width:25px!important;min-width:25px!important;max-width:25px!important;height:25px!important;display:grid!important;place-items:center!important;flex:0 0 25px!important;font-size:16px!important;line-height:1!important;overflow:visible!important;}
.sidebar nav .r17-flat-item>span:last-child{display:block!important;position:static!important;width:auto!important;min-width:0!important;max-width:none!important;flex:1 1 auto!important;overflow:visible!important;text-overflow:clip!important;white-space:nowrap!important;line-height:1.2!important;transform:none!important;}
.sidebar nav .r17-flat-item:hover{background:rgba(255,255,255,.075)!important;color:#fff!important;border-color:rgba(255,255,255,.08)!important;}
.sidebar nav .r17-flat-item.active{background:linear-gradient(90deg,rgba(243,179,67,.20),rgba(243,179,67,.07))!important;color:#ffd477!important;border-color:rgba(243,179,67,.22)!important;box-shadow:inset 3px 0 0 #f3b343!important;}
.sidebar nav .r17-flat-item:focus-visible{outline:2px solid #f3b343!important;outline-offset:1px!important;}
.sidebar .side-bottom{margin-top:auto!important;padding-top:14px!important;border-top:1px solid rgba(255,255,255,.08)!important;}
.sidebar .user-mini{border-top:0!important;padding:11px 8px!important;}
.sidebar .side-action{height:38px!important;font-size:11px!important;border-radius:9px!important;background:rgba(255,255,255,.04)!important;}
@media(max-width:760px){.sidebar{width:280px!important;min-width:280px!important;}.sidebar nav .r17-flat-item{height:44px!important;min-height:44px!important;}}
`;
document.head.appendChild(s)}
function openAcreditacion(e){
 if(e){e.preventDefault();e.stopPropagation();if(typeof e.stopImmediatePropagation==='function')e.stopImmediatePropagation()}
 const fn=window.openAcreditacionDelegados;
 if(typeof fn==='function'){Promise.resolve(fn()).catch(err=>console.error('[Regional17] Acreditación:',err));return true}
 window.dispatchEvent(new CustomEvent('r17:open-acreditacion'));
 return false
}
function installAcreditacionDelegation(){if(window.__r17AcreditacionDelegation)return;window.__r17AcreditacionDelegation=true;document.addEventListener('click',e=>{const b=e.target?.closest?.('.nav-item[data-view="acreditacion"],.nav-item[data-view="accreditation"]');if(!b)return;openAcreditacion(e)},true)}
function makeFlat(nav){injectInstitutionalStyle();installAcreditacionDelegation();const raw=unique(items(nav));const byKey=new Map(raw.map(n=>[canonical(n),n]));const out=[];
 const add=(key,label,icon,external=false)=>{let n=byKey.get(key);if(n){n.classList.add('r17-flat-item');n.dataset.view=key;n.innerHTML=`<span>${icon}</span><span>${label}</span>`;byKey.delete(key)}else n=button(key,label,icon,external);if(key==='acreditacion'&&!external){n.onclick=e=>openAcreditacion(e)}if(key==='resultados'&&!external){n.onclick=e=>{e.preventDefault();e.stopPropagation();window.dispatchEvent(new CustomEvent('rv-open-evaluation-results'))}}out.push(n)};
 add('dashboard','Dashboard','⌂');
 add('volunteers','Voluntarios','👥');
 add('acreditacion','Acreditación','🪪');
 add('centers','Centros educativos','🏫');
 add('activities','Actividades','✓');
 add('events','Eventos','◷');
 add('map','Mapa','⌖');
 add('stats','Estadísticas','▥');
 add('evaluacion','Evaluaciones','📊',true);
 add('resultados','Resultados','📈');
 nav.innerHTML='';out.forEach(n=>nav.appendChild(n));nav.dataset.r17Organized='1';
 const sidebar=nav.closest('.sidebar');if(sidebar){sidebar.classList.remove('is-collapsed');sidebar.querySelectorAll('.r17-sidebar-collapse').forEach(x=>x.remove())}
}
let currentNav=null;function check(){const nav=document.querySelector('.sidebar nav');if(!nav)return;if(nav!==currentNav||nav.dataset.r17Organized!=='1'){currentNav=nav;makeFlat(nav);return}}
function boot(){installAcreditacionDelegation();check();document.addEventListener('r17:sidebar-rendered',check)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();