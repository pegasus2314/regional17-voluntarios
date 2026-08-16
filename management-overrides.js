/* Regional 17 Volunteers — management helpers + stable calendar bridge */
(()=>{'use strict';
const cfg=window.RV_CONFIG||{};
let sb=null;
function client(){if(sb)return sb;if(!cfg.SUPABASE_URL||!cfg.SUPABASE_ANON_KEY||!window.supabase)return null;sb=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);return sb}
async function removeActivity(id,card){if(!id)return;if(!confirm('¿Eliminar esta actividad?\n\nLa actividad se archivará y dejará de aparecer en la aplicación.'))return;const s=client();if(!s)return alert('No se pudo conectar con Supabase.');const {data:{user}}=await s.auth.getUser();if(!user)return alert('Debes iniciar sesión.');const {error}=await s.from('actividades').update({is_active:false,deleted_at:new Date().toISOString(),deleted_by:user.id}).eq('id',id);if(error)return alert(error.message||'No se pudo eliminar la actividad.');card?.remove();window.dispatchEvent(new CustomEvent('r17:activity-deleted',{detail:{id}}))}
async function removeVolunteer(id,row){if(!id)return;if(!confirm('¿Eliminar definitivamente este voluntario?\n\nEsta acción no se puede deshacer.'))return;const s=client();if(!s)return alert('No se pudo conectar con Supabase.');const {data:{user}}=await s.auth.getUser();if(!user)return alert('Debes iniciar sesión.');const {data:deleted,error}=await s.from('voluntarios').delete().eq('id',id).select('id');if(error)return alert(error.message||'No se pudo eliminar el voluntario.');if(!deleted?.length)return alert('No se eliminó ningún registro. Verifica tus permisos.');row?.remove();window.dispatchEvent(new CustomEvent('r17:volunteer-deleted',{detail:{id}}));alert('Voluntario eliminado correctamente.');window.location.reload()}
window.R17Management={removeActivity,removeVolunteer};

// Add Calendar to the app.js-generated navigation without MutationObserver or polling.
const mount=document.getElementById('app');
if(mount){
 const desc=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');
 if(desc?.get&&desc?.set&&!mount.__r17CalendarBridge){
  Object.defineProperty(mount,'__r17CalendarBridge',{value:true});
  Object.defineProperty(mount,'innerHTML',{configurable:true,enumerable:desc.enumerable,get(){return desc.get.call(this)},set(value){
    if(typeof value==='string'&&value.includes('<nav>')&&!value.includes('data-r17-calendar')){
      value=value.replace('<nav>','<nav><button type="button" class="nav-item" data-r17-calendar="1"><span>▦</span>Calendario</button>');
    }
    desc.set.call(this,value);
  }});
 }
}
function ensureCalendarButton(){
 const nav=document.querySelector('.sidebar nav');
 if(!nav||nav.querySelector('[data-r17-calendar]'))return;
 const b=document.createElement('button');b.type='button';b.className='nav-item';b.setAttribute('data-r17-calendar','1');b.innerHTML='<span>▦</span>Calendario';nav.appendChild(b);
}
document.addEventListener('DOMContentLoaded',ensureCalendarButton,{once:true});
let calendarHandling=false;
document.addEventListener('click',async event=>{
 const button=event.target?.closest?.('[data-r17-calendar]');
 if(!button)return;
 event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
 if(calendarHandling)return;
 calendarHandling=true;
 document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));
 button.classList.add('active');
 const title=document.querySelector('.topbar h1');if(title)title.textContent='Calendario y cronograma';
 try{if(window.R17Calendar?.open)await window.R17Calendar.open();else alert('El módulo Calendario no está disponible.');}
 finally{calendarHandling=false;}
},true);
})();
