window.RV_CONFIG={SUPABASE_URL:'https://ibsmrkwkmcjyekwllxic.supabase.co',SUPABASE_ANON_KEY:'sb_publishable_9vAku5bk8kjr55NdrheYEQ_0R5daGfS'};
(() => {
  'use strict';
  const style=document.createElement('style');
  style.id='r17-safe-ui';
  style.textContent=`
    .sidebar .nav-item[data-view="map"],.nav-item[data-r17-map],[data-r17-map]{display:none!important}
    .login-form{padding:40px!important}.login-form field{display:block!important;margin-bottom:17px!important}.login-form field label{display:block!important;font-size:12px!important;font-weight:700!important;margin-bottom:8px!important;color:#506074!important}.login-form field input{width:100%!important;height:56px!important;padding:0 17px!important;border:1px solid #d7e0ea!important;border-radius:12px!important;background:#fbfcfe!important;font-size:14px!important;outline:none!important}.login-form field input:focus{border-color:#315f91!important;box-shadow:0 0 0 4px rgba(49,95,145,.10)!important}.login-form .btn.full,.login-form button[type="submit"]{width:100%!important;min-height:58px!important;padding:0 20px!important;border-radius:12px!important;font-size:14px!important;font-weight:800!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;background:#0d315d!important;color:#fff!important;border:0!important;box-shadow:0 9px 22px rgba(13,49,93,.18)!important}.login-form .btn.full:hover,.login-form button[type="submit"]:hover{background:#174b7f!important;transform:translateY(-1px)!important}.login-form .btn.full:active,.login-form button[type="submit"]:active{transform:none!important}
    @media(max-width:760px){.login-form{padding:28px 22px!important}.login-form field input{height:58px!important;font-size:15px!important}.login-form .btn.full,.login-form button[type="submit"]{min-height:60px!important;font-size:15px!important}}
  `;
  document.head.appendChild(style);
  const css=document.createElement('link');css.rel='stylesheet';css.href='modules-enhancements.css';document.head.appendChild(css);
  let queued=false;
  function installCalendar(){
    const nav=document.querySelector('.sidebar nav');
    if(!nav||nav.querySelector('[data-r17-calendar]')||!window.R17Calendar)return;
    const b=document.createElement('button');b.className='nav-item';b.dataset.r17Calendar='1';b.innerHTML='<span>📅</span>Calendario';b.onclick=e=>{e.preventDefault();window.R17Calendar.open()};nav.appendChild(b);
  }
  function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;installCalendar()})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{installCalendar();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true})},{once:true});else{installCalendar();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true})}
})();