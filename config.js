window.RV_CONFIG={SUPABASE_URL:'https://ibsmrkwkmcjyekwllxic.supabase.co',SUPABASE_ANON_KEY:'sb_publishable_9vAku5bk8kjr55NdrheYEQ_0R5daGfS',MAP_DEFAULT_LAT:18.808,MAP_DEFAULT_LNG:-69.784,MAP_DEFAULT_ZOOM:10};
(function(){
  // Reuse one Supabase client in this browser context. This prevents multiple GoTrueClient instances.
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
  const load=s=>{const e=document.createElement('script');e.src=s;e.defer=true;document.head.appendChild(e)};
  load('stable-navigation.js');
  load('admin.js');
  load('management-overrides.js');
  load('announcements-enhancements.js');
  load('calendar.js');
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