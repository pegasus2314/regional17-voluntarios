(()=>{'use strict';
const GROUPS=[
 ['inicio','INICIO','⌂',['dashboard']],
 ['personas','PERSONAS','♙',['voluntario','acredit','usuario']],
 ['gestion','GESTIÓN EDUCATIVA','🏫',['centro','distrito']],
 ['mun','MUN REGIONAL 17','🏛️',['mun','modelo','delegado','comision','mesa','evaluacion','resultado']],
 ['agenda','AGENDA','📅',['actividade','evento','calendario']],
 ['recursos','RECURSOS','📚',['biblioteca','documento']],
 ['comunicacion','COMUNICACIÓN','💬',['chat','comunicado','anuncio']],
 ['administracion','ADMINISTRACIÓN','⚙️',['admin','rol','permiso','configuracion']]
];
const esc=s=>String(s||'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\\':'&#92;'}[c]));
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function classify(text){const t=norm(text);for(const g of GROUPS){if(g[3].some(k=>t.includes(k)))return g[0]}return'otros'}
function isCenterItem(node){const t=norm(node.textContent);const view=norm(node.getAttribute('data-view')||'');return t.includes('centro educativo')||t.includes('centros educativo')||view.includes('centro')||view.includes('educativo')}
function centerKey(node){const view=norm(node.getAttribute('data-view')||'');if(view.includes('centro'))return 'view:'+view;return 'label:centros-educativos'}
function enhance(){
 document.querySelectorAll('.sidebar nav:not([data-r17-nav])').forEach(nav=>{
  if(!nav.children.length)return;
  const nodes=[...nav.children].filter(x=>x.matches('.nav-item,[data-view]'));
  if(!nodes.length)return;
  const seenCenters=new Set();
  const unique=[];
  for(const n of nodes){
   if(isCenterItem(n)){
    const key=centerKey(n);
    if(seenCenters.has(key))continue;
    seenCenters.add(key);
   }
   unique.push(n);
  }
  nav.dataset.r17Nav='1';
  const buckets=new Map(GROUPS.map(g=>[g[0],[]]));buckets.set('otros',[]);
  unique.forEach(n=>{const group=classify(n.textContent);(buckets.get(group)||buckets.get('otros')).push(n)});
  nav.innerHTML='';
  for(const g of GROUPS){
   const items=buckets.get(g[0])||[];if(!items.length)continue;
   const group=document.createElement('section');group.className='nav-group';group.dataset.group=g[0];
   const head=document.createElement('button');head.type='button';head.className='nav-group-head';head.innerHTML=`<span>${g[2]}</span><strong>${esc(g[1])}</strong><b aria-hidden="true">⌄</b>`;head.setAttribute('aria-expanded','false');
   const body=document.createElement('div');body.className='nav-group-body';items.forEach(x=>body.appendChild(x));
   group.append(head,body);nav.appendChild(group);
   head.onclick=()=>{const open=group.classList.toggle('is-open');head.setAttribute('aria-expanded',String(open));};
   const active=items.some(x=>x.classList.contains('active'));if(active){group.classList.add('is-open');head.setAttribute('aria-expanded','true')}
  }
  const others=buckets.get('otros')||[];others.forEach(x=>nav.appendChild(x));
  nav.scrollTop=0;
 });
}
let scheduled=false;
const mo=new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;enhance()})});
function boot(){enhance();mo.observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
