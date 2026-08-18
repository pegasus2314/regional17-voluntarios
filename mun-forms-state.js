/* Keep MUN form context aligned with the existing local state */
(() => {
  'use strict';
  const KEY='r17_mun_state_v2';
  document.addEventListener('click',e=>{
    const model=e.target.closest?.('[data-model]');
    if(model){
      try{const s=JSON.parse(localStorage.getItem(KEY)||'{}');s.selectedModel=model.dataset.model;s.selectedCommission=null;localStorage.setItem(KEY,JSON.stringify(s));}catch{}
      return;
    }
    const commission=e.target.closest?.('[data-com]');
    if(commission){
      try{const s=JSON.parse(localStorage.getItem(KEY)||'{}');s.selectedCommission=commission.dataset.com;localStorage.setItem(KEY,JSON.stringify(s));}catch{}
    }
  },true);
})();
