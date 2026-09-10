/* Regional 17 · Acreditación — Campamentos / Agentes al 100 */
(()=>{'use strict';
const EGRESADOS={
  '17-02':[
    'Abril Martínez Hernández','Adenis Ortega','Airebys Torres Buten','Alanny Gonzales','Anfferni Ortega','Arlette Nahomy Jorge Peralta','Ashley Denisse Batista Antonio','Elizabeth Pérez','Eysi Elianna Sánchez Santana','Ezequiel Hernández Mueses','Fredelmi Mariano Soriano','Kisme Amelia Reyes Durán','Lisbeth de Jesús de la Cruz','Luis Beri de Jesús de la cruz','Ramona Yernalis Manzanillo','Yadhier Elías Figueroa','York David Hernández Luis'
  ],
  '17-03':[
    'Alex Manuel Núñez','Alexander Nicolás Aquino Genao','Ana Carina estimable bazil','Carlos Alejandro de León Ramírez','Dalvin daniel reyes Frias','daniel Ramón reyes Frias','David Alejandro Pérez frias','enmanuel alexander de León Ramírez','Esmerlin Emilio mieses Castillo','Eunice Nicole consoro Brito','evena charles','jean Carlos Tolentino','jhoemir Alexander Bueno Ortiz','Jhon mauri Soriano decena','joubelkie occena','Lorenzo Severino Simeon','marileyni guillen adames','Marisol vizcaino','Marjorie Odette Santana Jiménez','marolin Guillén adames','Maryirith Dafne Pérez frias','Saúl de Jesús Hidalgo'
  ],
  '17-04':[
    'Alexa desena de Jesús','Antonio Francisco Polanco','arlenis Batista Rodríguez','Bahyron Miguel Beltre de la rosa','diogeris mejia Ceballos','edelier yariel mateo Ortiz','eimy alexandra Camacho Valentín','geisy maria pinales peguero','Jennifer Pimentel encarnacion','liana Vidal de la cruz','luz atany puello Brito','mildre rosario lapes','Pedro Luis correa bautista','Rafael Mosquea Sánchez','valery Yulian Alcántara Pérez','Yeison Arias Ramírez','Yoldani Bueno Reyes'
  ]
};
const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
const total=Object.values(EGRESADOS).reduce((n,a)=>n+a.length,0);
function addCampamentosOption(){
  document.querySelectorAll('select[name="etapa"]').forEach(select=>{
    if(![...select.options].some(o=>o.value==='Campamentos')){
      const option=document.createElement('option');option.value='Campamentos';option.textContent='Campamentos';select.appendChild(option);
    }
  });
}
function render(){
  addCampamentosOption();
  const root=document.querySelector('#content .r17-acreditacion');
  if(!root||root.querySelector('.r17-campamentos-100'))return;
  const section=document.createElement('section');
  section.className='r17-campamentos-100';
  section.innerHTML=`<div class="r17-campamentos-head"><div><span class="r17-campamentos-kicker">ACREDITACIÓN · ETAPA CAMPAMENTOS</span><h2>Agentes al 100</h2><p>Listado de egresados del Campamento de Ciudadanos al 100. Solo se tomaron en cuenta quienes llegaron a asistir 3 de 4 días o participaron durante los dos últimos días.</p></div><div class="r17-campamentos-total"><strong>${total}</strong><span>egresados</span></div></div><div class="r17-campamentos-grid">${Object.entries(EGRESADOS).map(([d,nombres])=>`<article class="r17-campamento-card"><header><div><span>Distrito</span><h3>${esc(d)}</h3></div><b>${nombres.length}</b></header><ol>${nombres.map((nombre,i)=>`<li><span>${i+1}</span><strong>${esc(nombre)}</strong></li>`).join('')}</ol></article>`).join('')}</div>`;
  root.appendChild(section);
}
const observer=new MutationObserver(render);
function boot(){render();observer.observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
