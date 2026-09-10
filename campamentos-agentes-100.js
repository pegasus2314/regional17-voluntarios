/* Regional 17 · Acreditación — Campamentos / Agentes al 100 */
(()=>{'use strict';
const EGRESADOS={
  '17-02':[
    'Abril Martínez Hernández','Adenis Ortega','Airebys Torres Buten','Alanny Gonzales','Anfferni Ortega','Arlette Nahomy Jorge Peralta','Ashley Denisse Batista Antonio','Elizabeth Pérez','Eysi Elianna Sánchez Santana','Ezequiel Hernández Mueses','Fredelmi Mariano Soriano','Kisme Amelia Reyes Durán','Lisbeth de Jesús de la Cruz','Luis Beri de Jesús de la Cruz','Ramona Yernalis Manzanillo','Yadhier Elías Figueroa','York David Hernández Luis'
  ],
  '17-03':[
    'Alex Manuel Núñez','Alexander Nicolás Aquino Genao','Ana Carina Estimable Bazil','Carlos Alejandro de León Ramírez','Dalvin Daniel Reyes Frías','Daniel Ramón Reyes Frías','David Alejandro Pérez Frías','Enmanuel Alexander de León Ramírez','Esmerlin Emilio Mieses Castillo','Eunice Nicole Consoro Brito','Evena Charles','Jean Carlos Tolentino','Jhoemir Alexander Bueno Ortiz','Jhon Mauri Soriano Decena','Joubelkie Occena','Lorenzo Severino Simeon','Marileyni Guillen Adames','Marisol Vizcaino','Marjorie Odette Santana Jiménez','Marolin Guillén Adames','Maryirith Dafne Pérez Frías','Saúl de Jesús Hidalgo'
  ],
  '17-04':[
    'Alexa Desena de Jesús','Antonio Francisco Polanco','Arlenis Batista Rodríguez','Bahyron Miguel Beltre de la Rosa','Diogeris Mejia Ceballos','Edelier Yariel Mateo Ortiz','Eimy Alexandra Camacho Valentín','Geisy Maria Pinales Peguero','Jennifer Pimentel Encarnacion','Liana Vidal de la Cruz','Luz Atany Puello Brito','Mildre Rosario Lapes','Pedro Luis Correa Bautista','Rafael Mosquea Sánchez','Valery Yulian Alcántara Pérez','Yeison Arias Ramírez','Yoldani Bueno Reyes'
  ]
};
const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
const total=Object.values(EGRESADOS).reduce((n,a)=>n+a.length,0);
function render(){
  const root=document.querySelector('#content .r17-acreditacion');
  if(!root||root.querySelector('.r17-campamentos-100'))return;
  const section=document.createElement('section');
  section.className='r17-campamentos-100';
  section.innerHTML=`<div class="r17-campamentos-head"><div><span class="r17-campamentos-kicker">ACREDITACIÓN · ETAPA CAMPAMENTOS</span><h2>Agentes al 100</h2><p>Listado de egresados del Campamento de Ciudadanos al 100. Solo se tomaron en cuenta quienes asistieron 3 de 4 días o participaron durante los dos últimos días.</p></div><div class="r17-campamentos-total"><strong>${total}</strong><span>egresados</span></div></div><div class="r17-campamentos-grid">${Object.entries(EGRESADOS).map(([d,nombres])=>`<article class="r17-campamento-card"><header><div><span>Distrito</span><h3>${esc(d)}</h3></div><b>${nombres.length}</b></header><ol>${nombres.map((nombre,i)=>`<li><span>${i+1}</span><strong>${esc(nombre)}</strong></li>`).join('')}</ol></article>`).join('')}</div>`;
  root.appendChild(section);
}
const observer=new MutationObserver(render);
function boot(){render();observer.observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
