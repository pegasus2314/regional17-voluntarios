(() => {
  'use strict';
  if (window.__R17_MUN_LIVE_SYNC__) return;
  window.__R17_MUN_LIVE_SYNC__ = true;
  let refreshing=false;

  function readState(){
    try{return JSON.parse(localStorage.getItem('r17_mun_state_v2')||'{"models":[],"selectedModel":null,"selectedCommission":null}');}
    catch{return {models:[],selectedModel:null,selectedCommission:null};}
  }

  async function refresh(){
    if(refreshing)return;
    refreshing=true;
    try{
      const wasMUN=!!document.querySelector('.mun-simple,.eval-sheet');
      document.querySelector('[data-mun-view]')?.remove();
      document.querySelector('script[data-r17-mun-replace-live]')?.remove();
      const s=document.createElement('script');
      s.src='./mun-replace.js?live='+Date.now();
      s.dataset.r17MunReplaceLive='1';
      document.body.appendChild(s);
      await new Promise(r=>setTimeout(r,100));
      const freshNav=document.querySelector('[data-mun-view]');
      if(wasMUN&&freshNav){
        freshNav.click();
        await new Promise(r=>setTimeout(r,50));
        const st=readState();
        const model=[...document.querySelectorAll('[data-model]')].find(x=>x.dataset.model===st.selectedModel);
        if(model){
          model.click();
          await new Promise(r=>setTimeout(r,50));
          const com=[...document.querySelectorAll('[data-com]')].find(x=>x.dataset.com===st.selectedCommission);
          com?.click();
        }
      }
    }finally{refreshing=false;}
  }
  window.__r17RefreshMUN=refresh;
})();
