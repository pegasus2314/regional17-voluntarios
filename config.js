window.RV_CONFIG={SUPABASE_URL:'https://ibsmrkwkmcjyekwllxic.supabase.co',SUPABASE_ANON_KEY:'sb_publishable_9vAku5bk8kjr55NdrheYEQ_0R5daGfS'};
(() => {
  'use strict';
  const style=document.createElement('style');
  style.id='r17-map-removal';
  style.textContent='.sidebar .nav-item[data-view="map"],.nav-item[data-r17-map],[data-r17-map]{display:none!important}';
  document.head.appendChild(style);
  let queued=false;
  function installCalendar(){
    const nav=document.querySelector('.sidebar nav');
    if(!nav||nav.querySelector('[data-r17-calendar]')||!window.R17Calendar)return;
    const b=document.createElement('button');
    b.className='nav-item';
    b.dataset.r17Calendar='1';
    b.innerHTML='<span>📅</span>Calendario';
    b.onclick=e=>{e.preventDefault();window.R17Calendar.open()};
    nav.appendChild(b);
  }
  function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;installCalendar()})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{installCalendar();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true})},{once:true});
  else{installCalendar();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true})}
})();