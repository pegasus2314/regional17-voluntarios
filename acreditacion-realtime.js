/* Acreditación Realtime: sincroniza la tabla sin refrescar la página. */
(()=>{'use strict';
  const C=window.RV_CONFIG||{};
  const DIST=[['17-01','Yamasá'],['17-02','Monte Plata'],['17-03','Bayaguana'],['17-04','Sabana Grande de Boyá'],['17-05','Esperalvillo']];
  const esc=v=>String(v??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  let client=null, channel=null, running=false;
  const dn=id=>{const d=DIST.find(x=>x[0]===id);return d?`${d[0]} · ${d[1]}`:(id||'Sin distrito')};
  function toast(message,type='success'){
    let t=document.getElementById('acr-live-toast');
    if(!t){t=document.createElement('div');t.id='acr-live-toast';t.style.cssText='position:fixed;right:22px;bottom:22px;z-index:100000;padding:12px 16px;border-radius:12px;background:#0b7a45;color:#fff;font-weight:700;box-shadow:0 12px 30px #0003;opacity:0;transform:translateY(8px);transition:.2s';document.body.appendChild(t)}
    t.textContent=message;t.style.background=type==='error'?'#a52828':'#0b7a45';t.style.opacity='1';t.style.transform='translateY(0)';clearTimeout(t._timer);t._timer=setTimeout(()=>{t.style.opacity='0';t.style.transform='translateY(8px)'},2400);
  }
  function currentScope(){
    const activeArea=document.querySelector('#acr2-area [data-area].active')?.dataset.area || 'distrital';
    const activeDistrict=document.querySelector('#acr2-district [data-d].active')?.dataset.d || '';
    const q=(document.querySelector('#acr2-q')?.value||'').toLowerCase().trim();
    const state=document.querySelector('#acr2-state')?.value||'';
    return {area:activeArea,district:activeDistrict,q,state};
  }
  function visible(rows){
    const s=currentScope();
    return rows.filter(x=>(s.area?x.area===s.area:true)&&(!s.district||x.distrito_id===s.district)&&(!s.state||x.estado===s.state)&&(!s.q||[x.codigo,x.nombre,x.apellido,x.telefono,x.centro_educativo,x.distrito_id].join(' ').toLowerCase().includes(s.q)));
  }
  async function refresh(reason){
    if(!client||!document.querySelector('.acr2'))return;
    const {data,error}=await client.from('acreditacion_delegados').select('*').order('created_at',{ascending:false});
    if(error){console.error('[Acreditación Realtime]',error);return}
    const rows=data||[],s=currentScope(),all=rows.filter(x=>x.area===s.area&&(!s.district||x.distrito_id===s.district)),r=visible(rows);
    const stats=document.querySelector('#acr2-stats');
    if(stats){const p=all.filter(x=>x.estado==='Pendiente').length,a=all.filter(x=>x.estado==='Acreditado').length,c=all.filter(x=>x.estado==='Cancelado').length;stats.innerHTML=`<div class="acr2-stat"><b>${all.length}</b><span>Total</span></div><div class="acr2-stat"><b>${a}</b><span>🟢 Acreditados</span></div><div class="acr2-stat"><b>${p}</b><span>🟡 Pendientes</span></div><div class="acr2-stat"><b>${c}</b><span>🔴 Cancelados</span></div>`}
    const list=document.querySelector('#acr2-list');if(!list)return;
    if(!r.length){list.innerHTML='<div class="acr2-wrap acr2-empty">🪪<br><strong>No hay registros para esta selección.</strong></div>';return}
    const badge=s=>`<span class="acr2-status ${s==='Acreditado'?'a':s==='Cancelado'?'c':'p'}">${s==='Acreditado'?'🟢':s==='Cancelado'?'🔴':'🟡'} ${esc(s)}</span>`;
    list.innerHTML='<div class="acr2-wrap"><table class="acr2-table"><thead><tr><th>ID</th><th>Delegado</th><th>Centro</th><th>Distrito</th><th>Etapa</th><th>Teléfono</th><th>Estado</th><th></th></tr></thead><tbody>'+r.map(x=>`<tr><td class="acr2-id">${esc(x.codigo)}</td><td><strong>${esc(x.nombre)} ${esc(x.apellido)}</strong></td><td>${esc(x.centro_educativo)}</td><td>${esc(dn(x.distrito_id))}</td><td>${esc(x.etapa)}</td><td>${esc(x.telefono)}</td><td>${badge(x.estado)}</td><td><button class="acr2-btn" data-view="${esc(x.id)}">Ficha</button></td></tr>`).join('')+'</tbody></table></div>';
    if(reason)toast(reason);
  }
  async function start(){
    if(running)return;
    const lib=window.supabase;if(!lib||!C.SUPABASE_URL||!C.SUPABASE_ANON_KEY)return;
    client=lib.createClient(C.SUPABASE_URL,C.SUPABASE_ANON_KEY);
    const {data:{session}}=await client.auth.getSession();if(!session)return;
    running=true;
    channel=client.channel('acreditacion:delegados:live')
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'acreditacion_delegados'},()=>refresh('Nuevo acreditado registrado'))
      .on('postgres_changes',{event:'UPDATE',schema:'public',table:'acreditacion_delegados'},()=>refresh('Acreditación actualizada'))
      .on('postgres_changes',{event:'DELETE',schema:'public',table:'acreditacion_delegados'},()=>refresh('Acreditación eliminada'))
      .subscribe((status,error)=>{if(error)console.error('[Acreditación Realtime]',error);if(status==='SUBSCRIBED')console.info('[Acreditación] Realtime conectado')});
    client.auth.onAuthStateChange((event)=>{if(event==='SIGNED_OUT'&&channel){client.removeChannel(channel);channel=null;running=false}});
  }
  const boot=()=>{start();if(!document.querySelector('#acr-live-style')){const s=document.createElement('style');s.id='acr-live-style';s.textContent='.acr2-live-dot{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:800;color:#16834b}.acr2-live-dot i{width:8px;height:8px;border-radius:50%;background:#1fbf67;box-shadow:0 0 0 4px #1fbf6722}';document.head.appendChild(s)}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  new MutationObserver(()=>{if(document.querySelector('.acr2'))start()}).observe(document.documentElement,{subtree:true,childList:true});
})();