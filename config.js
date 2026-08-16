window.RV_CONFIG={SUPABASE_URL:'https://ibsmrkwkmcjyekwllxic.supabase.co',SUPABASE_ANON_KEY:'sb_publishable_9vAku5bk8kjr55NdrheYEQ_0R5daGfS',MAP_DEFAULT_LAT:18.808,MAP_DEFAULT_LNG:-69.784,MAP_DEFAULT_ZOOM:10};
(function(){
  const load=s=>{const e=document.createElement('script');e.src=s;e.defer=true;document.head.appendChild(e)};
  load('stable-navigation.js');
  load('admin.js');
  load('management-overrides.js');
  load('announcements-enhancements.js');
  load('calendar.js');
  load('calendar-router.js');
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