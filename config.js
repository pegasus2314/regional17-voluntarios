window.RV_CONFIG={SUPABASE_URL:'https://ibsmrkwkmcjyekwllxic.supabase.co',SUPABASE_ANON_KEY:'sb_publishable_9vAku5bk8kjr55NdrheYEQ_0R5daGfS',MAP_DEFAULT_LAT:18.808,MAP_DEFAULT_LNG:-69.784,MAP_DEFAULT_ZOOM:10};
(function(){
  'use strict';
  if(window.supabase?.createClient && !window.__R17_SUPABASE_FACTORY_PATCHED){
    const nativeCreate=window.supabase.createClient.bind(window.supabase);
    let singleton=null;
    window.supabase.createClient=function(url,key,options){
      if(singleton && url===window.RV_CONFIG.SUPABASE_URL && key===window.RV_CONFIG.SUPABASE_ANON_KEY)return singleton;
      singleton=nativeCreate(url,key,options);
      window.__R17_SUPABASE_CLIENT=singleton;
      return singleton;
    };
    window.__R17_SUPABASE_FACTORY_PATCHED=true;
  }

  window.__R17_CALENDAR_VIEW=false;
  const htmlDescriptor=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');
  if(htmlDescriptor?.set && !window.__R17_INNERHTML_PATCHED){
    const nativeSet=htmlDescriptor.set;
    Object.defineProperty(Element.prototype,'innerHTML',{
      configurable:htmlDescriptor.configurable,
      enumerable:htmlDescriptor.enumerable,
      get:htmlDescriptor.get,
      set(value){
        if(this.id==='app' && typeof value==='string' && value.includes('<nav>') && !value.includes('data-view="calendar"')){
          value=value.replace('</nav>','<button data-view="calendar" class="nav-item"><span>🗓</span>Calendario</button></nav>');
        }
        nativeSet.call(this,value);
      }
    });
    window.__R17_INNERHTML_PATCHED=true;
  }

  document.addEventListener('click',async e=>{
    const button=e.target.closest?.('[data-view="calendar"]');
    if(!button)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    window.__R17_CALENDAR_VIEW=true;
    document.querySelectorAll('[data-view]').forEach(el=>el.classList.toggle('active',el===button));
    const title=document.querySelector('.topbar h1');
    if(title)title.textContent='Calendario';
    document.querySelector('.sidebar')?.classList.remove('open');
    try{
      if(window.R17Calendar?.open) await window.R17Calendar.open();
      else throw new Error('El módulo de calendario no está disponible');
    }catch(err){
      console.error('R17 calendar navigation:',err);
      const c=document.getElementById('content');
      if(c)c.innerHTML='<div class="error-box"><strong>No se pudo abrir el calendario.</strong><p>Recarga una sola vez y vuelve a intentarlo.</p></div>';
    }
  },true);

  document.addEventListener('click',e=>{
    if(e.target.closest?.('[data-view]:not([data-view="calendar"])'))window.__R17_CALENDAR_VIEW=false;
  },true);

  const load=s=>{const e=document.createElement('script');e.src=s;e.defer=true;document.head.appendChild(e)};
  load('stable-navigation.js');
  load('admin.js');
  load('management-overrides.js');
  load('announcements-enhancements.js');
  load('calendar.js');
  load('library.js');

  document.addEventListener('input',e=>{
    const el=e.target;
    if(!(el instanceof HTMLInputElement)||!el.closest('.search'))return;
    const start=el.selectionStart,end=el.selectionEnd;
    setTimeout(()=>{
      if(document.activeElement===el)return;
      el.focus({preventScroll:true});
      const pos=Math.min(start??el.value.length,el.value.length);
      el.setSelectionRange(pos,Math.min(end??pos,end??pos));
    },0);
  },true);
})();
