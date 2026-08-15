window.RV_CONFIG={SUPABASE_URL:'https://ibsmrkwkmcjyekwllxic.supabase.co',SUPABASE_ANON_KEY:'sb_publishable_9vAku5bk8kjr55NdrheYEQ_0R5daGfS',MAP_DEFAULT_LAT:18.808,MAP_DEFAULT_LNG:-69.784,MAP_DEFAULT_ZOOM:10};
(function(){
  const css=`
  #rv-chat-box{background:#efeae2!important;border:1px solid #d7d0c7!important;border-radius:14px!important;padding:18px 12px!important;position:relative;scroll-behavior:smooth}
  #rv-chat-box:before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.22;background-image:radial-gradient(#b9afa4 0.7px,transparent 0.7px);background-size:18px 18px}
  #rv-chat-box>*{position:relative;z-index:1}
  #rv-chat-box>div:not(.empty){display:flex!important;align-items:flex-end!important;gap:7px!important;width:100%!important;padding:4px 3px!important;border:0!important;margin:0!important}
  #rv-chat-box>div:not(.empty) .avatar{width:30px!important;height:30px!important;border-radius:50%!important;font-size:10px!important;background:#dfe7ec!important;color:#3b4d59!important}
  #rv-chat-box>div:not(.empty)>div:nth-child(2){max-width:min(75%,560px)!important;background:#fff!important;border-radius:8px 8px 8px 2px!important;padding:7px 9px 6px!important;box-shadow:0 1px 1px #00000012!important}
  #rv-chat-box>div:not(.empty) strong{display:block!important;color:#1f6b55!important;font-size:10px!important;margin-bottom:2px!important}
  #rv-chat-box>div:not(.empty) p{font-size:12px!important;line-height:1.42!important;color:#1f2933!important;margin:0!important;white-space:pre-wrap!important;overflow-wrap:anywhere!important}
  #rv-chat-box>div:not(.empty) small{display:block!important;text-align:right!important;color:#7b858d!important;font-size:8px!important;margin-top:4px!important}
  #rv-chat-box>div.wa-me{justify-content:flex-end!important}
  #rv-chat-box>div.wa-me .avatar{display:none!important}
  #rv-chat-box>div.wa-me>div:nth-child(2){background:#d9fdd3!important;border-radius:8px 8px 2px 8px!important}
  #rv-chat-box>div.wa-me strong{color:#176c3f!important}
  #rv-chat-form{background:#f0f2f5!important;border-radius:0 0 14px 14px!important;padding:9px!important;gap:8px!important}
  #rv-chat-input{background:#fff!important;border:0!important;border-radius:22px!important;padding:11px 15px!important;outline:0!important;box-shadow:0 1px 2px #0000000c!important}
  #rv-chat-form .btn{border:0!important;border-radius:50%!important;width:43px!important;height:43px!important;padding:0!important;font-size:0!important;position:relative!important;flex:none!important}
  #rv-chat-form .btn:after{content:"➤";font-size:17px;line-height:43px}
  `;
  const st=document.createElement('style');st.id='rv-whatsapp-chat-style';st.textContent=css;document.head.appendChild(st);
  let timer=null,lastBox=null;
  async function decorate(){
    const box=document.getElementById('rv-chat-box'); if(!box||box===lastBox&&box.dataset.waDecorated==='1'&&!box.children.length)return;
    lastBox=box;box.dataset.waDecorated='1';
    try{
      const s=window.supabase.createClient(window.RV_CONFIG.SUPABASE_URL,window.RV_CONFIG.SUPABASE_ANON_KEY);
      const [{data:{user}},{data:msgs}]=await Promise.all([s.auth.getUser(),s.from('chat_messages').select('user_id').order('created_at',{ascending:true}).limit(200)]);
      const rows=[...box.children].filter(x=>!x.classList.contains('empty'));
      rows.forEach((row,i)=>row.classList.toggle('wa-me',!!user&&msgs?.[i]?.user_id===user.id));
    }catch(e){}
  }
  const obs=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(decorate,40)});
  obs.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',decorate);setTimeout(decorate,500);
})();
(function(){var s=document.createElement('script');s.src='admin.js';s.defer=true;document.head.appendChild(s)})();