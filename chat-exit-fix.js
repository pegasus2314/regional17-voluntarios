(() => {
  'use strict';
  function installExit(){
    const chat=document.querySelector('.rv-chat');
    if(!chat || chat.querySelector('[data-chat-exit]')) return;
    const tools=chat.querySelector('.rv-chat-tools');
    if(!tools) return;
    const btn=document.createElement('button');
    btn.type='button';
    btn.dataset.chatExit='1';
    btn.innerHTML='← Salir';
    btn.title='Volver al dashboard';
    btn.onclick=(e)=>{
      e.preventDefault();
      e.stopPropagation();
      try{ if(window.__RV_CHAT_CHANNEL && window.__RV_SB) window.__RV_SB.removeChannel(window.__RV_CHAT_CHANNEL); }catch{}
      const back=document.querySelector('[data-nav="dashboard"], [data-view="dashboard"], .nav-item');
      if(back && typeof back.click==='function') back.click();
      else if(typeof window.renderDashboard==='function') window.renderDashboard();
      else window.location.hash='#dashboard';
    };
    tools.prepend(btn);
  }
  const observer=new MutationObserver(installExit);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('r17-chat-open',()=>setTimeout(installExit,0));
  setTimeout(installExit,300);
  setTimeout(installExit,1000);
})();
