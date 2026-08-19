(()=>{'use strict';
const cfg=window.RV_CONFIG||{};
if(!cfg.SUPABASE_URL||!window.supabase?.createClient)return;
const db=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
let allowed=false;
async function check(){
 try{const u=await db.auth.getUser();if(!u.data.user)return;const p=await db.from('profiles').select('role').eq('id',u.data.user.id).single();allowed=['admin','coordinador'].includes(p.data?.role)}catch{allowed=false}
}
function mount(){
 if(!allowed)return;
 const hero=document.querySelector('.eval-hero');
 if(!hero||hero.querySelector('.eval-hero-admin')||!window.R17EvaluationAdmin)return;
 const wrap=document.createElement('div');wrap.className='eval-hero-admin';
 const b=document.createElement('button');b.type='button';b.textContent='⚙ Administración';b.title='Configurar evaluaciones, comisiones, participantes, mesas y evaluadores';
 b.onclick=()=>window.R17EvaluationAdmin.open();wrap.appendChild(b);hero.appendChild(wrap);
}
check().then(()=>mount());
new MutationObserver(()=>mount()).observe(document.body,{childList:true,subtree:true});
})();