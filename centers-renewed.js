(()=>{'use strict';
const norm=s=>String(s||'').toLowerCase().trim();
function enhanceCenters(){
 const content=document.querySelector('#content');
 if(!content||!document.querySelector('.center-card')||content.dataset.centersRenewed==='1')return;
 const cards=[...content.querySelectorAll('.center-card')];
 const grid=cards[0]?.closest('.cards-grid'); if(!grid)return;
 const groups=new Map();
 cards.forEach(card=>{
   const small=card.querySelector('small');
   const district=(small?.textContent||'Sin distrito').split('·')[0].trim()||'Sin distrito';
   if(!groups.has(district))groups.set(district,[]);
   groups.get(district).push(card);
 });
 const toolbar=content.querySelector('.toolbar');
 const head=document.createElement('div');head.className='centers-renewed-head';
 head.innerHTML=`<div><div class="eyebrow">DIRECTORIO REGIONAL</div><h2>Centros Educativos</h2><p>Explora los centros organizados por distrito para encontrar rápidamente cada sede.</p></div><div class="centers-total"><strong>${cards.length}</strong><span>centros activos</span></div>`;
 if(toolbar)content.insertBefore(head,toolbar);else content.insertBefore(head,grid);
 const wrapper=document.createElement('div');wrapper.className='centers-renewed-list';
 [...groups.entries()].sort((a,b)=>a[0].localeCompare(b[0],'es')).forEach(([district,items])=>{
   const section=document.createElement('section');section.className='centers-district';
   const title=document.createElement('div');title.className='centers-district-head';title.innerHTML=`<div class="centers-district-title"><span class="district-mark">⌖</span><div><h3>${district}</h3><p>Centros registrados en este distrito</p></div></div><span class="centers-district-count">${items.length} ${items.length===1?'centro':'centros'}</span>`;
   const g=document.createElement('div');g.className='cards-grid';items.forEach(card=>g.appendChild(card));section.append(title,g);wrapper.appendChild(section);
 });
 grid.replaceWith(wrapper);content.dataset.centersRenewed='1';
}
const observer=new MutationObserver(()=>enhanceCenters());observer.observe(document.body,{childList:true,subtree:true});enhanceCenters();
})();
