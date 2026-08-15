window.RV_CONFIG={SUPABASE_URL:'https://ibsmrkwkmcjyekwllxic.supabase.co',SUPABASE_ANON_KEY:'sb_publishable_9vAku5bk8kjr55NdrheYEQ_0R5daGfS',MAP_DEFAULT_LAT:18.808,MAP_DEFAULT_LNG:-69.784,MAP_DEFAULT_ZOOM:10};
(function(){
'use strict';
const css=`
#rv-chat-box{background:#efeae2!important;border:0!important;border-radius:14px!important;padding:14px 10px!important;position:relative;scroll-behavior:smooth;overflow-x:hidden!important}
#rv-chat-box:before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.18;background-image:radial-gradient(#b9afa4 .7px,transparent .7px);background-size:18px 18px}
#rv-chat-box>*{position:relative;z-index:1}
#rv-chat-box .wa-row{display:flex!important;align-items:flex-end!important;gap:6px!important;width:100%!important;padding:3px 2px!important;border:0!important;margin:0!important}
#rv-chat-box .wa-row.other{justify-content:flex-start!important}
#rv-chat-box .wa-row.me{justify-content:flex-end!important}
#rv-chat-box .wa-avatar{width:28px!important;height:28px!important;border-radius:50%!important;display:grid!important;place-items:center!important;background:#dfe7ec!important;color:#3b4d59!important;font-size:9px!important;font-weight:800!important;flex:none!important}
#rv-chat-box .wa-bubble{max-width:min(78%,560px)!important;padding:6px 9px 5px!important;border-radius:8px 8px 8px 2px!important;background:#fff!important;box-shadow:0 1px 1px #00000012!important;overflow-wrap:anywhere!important}
#rv-chat-box .me .wa-bubble{background:#d9fdd3!important;border-radius:8px 8px 2px 8px!important}
#rv-chat-box .wa-name{display:block!important;color:#1f6b55!important;font-size:10px!important;font-weight:700!important;margin-bottom:2px!important}
#rv-chat-box .me .wa-name{color:#176c3f!important}
#rv-chat-box .wa-text{font-size:12px!important;line-height:1.4!important;color:#1f2933!important;margin:0!important;white-space:pre-wrap!important}
#rv-chat-box .wa-time{display:block!important;text-align:right!important;color:#7b858d!important;font-size:8px!important;margin-top:3px!important}
#rv-chat-form{background:#f0f2f5!important;border-radius:0 0 14px 14px!important;padding:8px!important;gap:8px!important}
#rv-chat-input{background:#fff!important;border:0!important;border-radius:22px!important;padding:11px 15px!important;outline:0!important;box-shadow:0 1px 2px #0000000c!important;min-width:0!important}
#rv-chat-form .btn{border:0!important;border-radius:50%!important;width:43px!important;height:43px!important;padding:0!important;font-size:0!important;position:relative!important;flex:none!important}
#rv-chat-form .btn:after{content:"➤";font-size:17px;line-height:43px}
#r17-chat-panel{background:#efeae2;border-radius:14px;padding:0;overflow:hidden}
button[data-view="map"]{display:none!important}
@media(max-width:760px){#rv-chat-box{height:58vh!important}.wa-bubble{max-width:82%!important}}
`;
const st=document.createElement('style');st.id='r17-chat-map-style';st.textContent=css;document.head.appendChild(st);
let chatChannel=null;
const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
const sb=()=>window.supabase.createClient(window.RV_CONFIG.SUPABASE_URL,window.RV_CONFIG.SUPABASE_ANON_KEY);
const toast=(m,type='success')=>{const e=document.createElement('div');e.className='toast'+(type==='error'?' error':'');e.textContent=m;document.body.appendChild(e);setTimeout(()=>e.remove(),3000)};
async function openChat(){
 const root=document.getElementById('content');if(!root)return;
 const s=sb();root.innerHTML=`<div class="panel" id="r17-chat-panel"><div class="panel-head" style="background:#fff;padding:15px 17px;margin:0"><div><h3>💬 Chat Regional 17</h3><p>Conversación general en tiempo real</p></div><span class="live"><i></i> En línea</span></div><div id="rv-chat-box" style="height:55vh;overflow:auto">Cargando mensajes…</div><form id="rv-chat-form" style="display:flex"><input id="rv-chat-input" autocomplete="off" maxlength="2000" required placeholder="Escribe un mensaje…"><button class="btn primary" type="submit" aria-label="Enviar mensaje">Enviar</button></form></div>`;
 const box=root.querySelector('#rv-chat-box'),form=root.querySelector('#rv-chat-form'),input=root.querySelector('#rv-chat-input');
 const {data:{user}}=await s.auth.getUser();if(!user){box.innerHTML='<div class="empty">Debes iniciar sesión para usar el chat.</div>';return}
 const render=async()=>{const [mr,pr]=await Promise.all([s.from('chat_messages').select('id,user_id,message,created_at').order('created_at',{ascending:true}).limit(200),s.from('profiles').select('id,full_name')]);if(mr.error){box.innerHTML=`<div class="empty"><h3>No se pudo cargar el chat</h3><p>${esc(mr.error.message)}</p></div>`;return}const names=new Map((pr.data||[]).map(p=>[p.id,p.full_name||'Usuario']));box.innerHTML=(mr.data||[]).map(m=>{const mine=m.user_id===user.id,name=names.get(m.user_id)||'Usuario',initial=esc(name.trim().charAt(0).toUpperCase()||'U'),time=new Date(m.created_at).toLocaleTimeString('es-DO',{hour:'numeric',minute:'2-digit'});return `<div class="wa-row ${mine?'me':'other'}">${mine?'':`<div class="wa-avatar">${initial}</div>`}<div class="wa-bubble"><span class="wa-name">${esc(name)}</span><p class="wa-text">${esc(m.message)}</p><small class="wa-time">${time}</small></div></div>`}).join('')||'<div class="empty">Todavía no hay mensajes. Sé el primero en escribir.</div>';box.scrollTop=box.scrollHeight};
 await render();
 form.onsubmit=async e=>{e.preventDefault();const message=input.value.trim();if(!message)return;const button=form.querySelector('button');button.disabled=true;const {error}=await s.from('chat_messages').insert({user_id:user.id,message});button.disabled=false;if(error){toast(error.message||'No se pudo enviar el mensaje','error');return}input.value='';input.focus();await render()};
 if(chatChannel)await s.removeChannel(chatChannel);chatChannel=s.channel('r17-chat-live').on('postgres_changes',{event:'INSERT',schema:'public',table:'chat_messages'},render).subscribe();input.focus();
}
function cleanNav(){const nav=document.querySelector('.sidebar nav');if(!nav)return;nav.querySelectorAll('button[data-view="map"]').forEach(b=>b.remove());nav.querySelectorAll('button').forEach(b=>{if((b.dataset.r17Chat==='1'))return;if((b.textContent||'').trim()==='Chat')b.remove()});if(!nav.querySelector('[data-r17Chat="1"]')){const b=document.createElement('button');b.className='nav-item';b.dataset.r17Chat='1';b.innerHTML='<span>💬</span>Chat';b.onclick=e=>{e.preventDefault();e.stopPropagation();history.replaceState(null,'','#chat');openChat()};nav.appendChild(b)}}
document.addEventListener('click',e=>{const b=e.target.closest('.sidebar nav button');if(!b)return;const text=(b.textContent||'').trim();if(text==='Chat'){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();history.replaceState(null,'','#chat');openChat()}else if(text==='Mapa'||b.dataset.view==='map'){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();b.remove()}},true);
const observer=new MutationObserver(()=>{cleanNav()});observer.observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('load',()=>setTimeout(cleanNav,500));setTimeout(cleanNav,1200);
})();
(function(){const s=document.createElement('script');s.src='admin.js';s.defer=true;document.head.appendChild(s)})();