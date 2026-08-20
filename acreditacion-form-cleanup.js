/* Acreditación — elimina la duplicación visual de Área.
   Etapa es el único campo visible; Área se mantiene internamente por compatibilidad con la tabla existente. */
(()=>{
  'use strict';
  const sync=()=>{
    const etapa=document.querySelector('#f-etapa');
    const area=document.querySelector('#f-area');
    if(!etapa||!area)return;
    const map={MINUME:'minume',Centro:'centro',Distrital:'distrital'};
    area.value=map[etapa.value]||'distrital';
    const label=area.closest('label');
    if(label) label.style.display='none';
  };
  const observe=()=>{
    sync();
    const etapa=document.querySelector('#f-etapa');
    if(etapa&&!etapa.dataset.areaSync){
      etapa.dataset.areaSync='1';
      etapa.addEventListener('change',sync);
    }
  };
  new MutationObserver(observe).observe(document.body,{childList:true,subtree:true});
  observe();
})();
