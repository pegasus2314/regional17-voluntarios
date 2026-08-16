(() => {
  'use strict';

  async function resolveRole(){
    try{
      const sb=window.__R17_SUPABASE_CLIENT || window.supabase?.createClient?.(window.RV_CONFIG?.SUPABASE_URL,window.RV_CONFIG?.SUPABASE_ANON_KEY);
      if(!sb)return;
      const {data:{user}}=await sb.auth.getUser();
      if(!user)return;
      const {data,error}=await sb.rpc('get_my_role');
      if(error)throw error;
      window.__R17_PROFILE_ROLE=String(data||'voluntario').toLowerCase();
    }catch(error){
      console.warn('R17 library role:',error);
      window.__R17_PROFILE_ROLE=window.__R17_PROFILE_ROLE||'voluntario';
    }finally{
      window.__R17_LIBRARY_ROLE_READY=true;
      if(window.__R17_LIBRARY_VIEW && window.R17Library?.refresh){
        window.R17Library.refresh();
      }
    }
  }

  resolveRole();
})();
