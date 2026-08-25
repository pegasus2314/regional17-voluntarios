(()=>{'use strict';
const cfg=window.RV_CONFIG||{};
let client=null,ready=null;
async function getClient(){
 if(client)return client;
 if(!cfg.SUPABASE_URL||!cfg.SUPABASE_ANON_KEY||!window.supabase?.createClient)return null;
 client=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
 return client;
}
async function canDelete(){
 const s=await getClient();if(!s)return false;
 const {data:{session}}=await s.auth.getSession();
 if(!session?.user)return false;
 const {data:p}=await s.from('profiles').select('role').eq('id',session.user.id).maybeSingle();
 return ['admin','coordinador'].includes(p?.role);
}
function toast(msg,type='success'){const el=document.createElement('div');el.className=`toast ${type}`;el.textContent=msg;document.body.appendChild(el);setTimeout(()=>el.remove(),3500)}
async function removeActivity(id,name,card){if(!id)return;if(!confirm(`¿Eliminar la actividad "${name}"?\n\nLa actividad se archivará y dejará de aparecer en el listado.`))return;
 const s=await getClient();if(!s){toast('No se pudo conectar con Supabase','error');return}
 const allowed=await canDelete();if(!allowed){toast('No tienes permisos para eliminar actividades','error');return}
 const {error}=await s.from('actividades').update({is_active:false}).eq('id',id);if(error){console.error(error);toast('No se pudo eliminar la actividad','error');return}
 card?.remove();toast('Actividad eliminada correctamente');
}
function enhance(){document.querySelectorAll('.activities-page .activity-card,[data-view="activities"] ~ * .activity-card,.activity-card').forEach(card=>{
 if(card.dataset.activityDelete==='1')return;
 const edit=card.querySelector('[data-edit-a]');if(!edit)return;
 const id=edit.dataset.editA;if(!id)return;
 const name=card.querySelector('h3')?.textContent?.trim()||'esta actividad';
 const actions=card.querySelector('.card-actions');if(!actions)return;
 const b=document.createElement('button');b.type='button';b.className='btn small danger activity-delete-btn';b.dataset.delA=id;b.innerHTML='Eliminar';b.title='Eliminar actividad';
 b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();removeActivity(id,name,card)});actions.appendChild(b);card.dataset.activityDelete='1';
 });
}
const observer=new MutationObserver(()=>enhance());
function boot(){enhance();observer.observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();