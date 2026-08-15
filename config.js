window.RV_CONFIG={SUPABASE_URL:'https://ibsmrkwkmcjyekwllxic.supabase.co',SUPABASE_ANON_KEY:'sb_publishable_9vAku5bk8kjr55NdrheYEQ_0R5daGfS',MAP_DEFAULT_LAT:18.808,MAP_DEFAULT_LNG:-69.784,MAP_DEFAULT_ZOOM:10};
(function(){
  const load=s=>{const e=document.createElement('script');e.src=s;e.defer=true;document.head.appendChild(e)};
  load('chat.js');
  load('admin.js');
  document.addEventListener('input',e=>{
    const el=e.target;
    if(!(el instanceof HTMLInputElement)||!el.closest('.search'))return;
    const start=el.selectionStart,end=el.selectionEnd;
    setTimeout(()=>{
      const n=document.querySelector('.search input');
      if(!n)return;
      n.focus({preventScroll:true});
      const pos=Math.min(start??n.value.length,n.value.length);
      n.setSelectionRange(pos,Math.min(end??pos,n.value.length));
    },0);
  },true);
})();