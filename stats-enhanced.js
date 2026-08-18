(() => {
  'use strict';
  if (window.__R17_STATS_ENHANCED__) return;
  window.__R17_STATS_ENHANCED__ = true;

  const cfg = window.RV_CONFIG || {};
  if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY || !window.supabase) return;
  const client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  const esc = v => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const num = v => Number(v || 0);
  const fmt = v => num(v).toLocaleString('es-DO');
  let cache = null;
  let busy = false;

  const style = document.createElement('style');
  style.id = 'r17-stats-enhanced-style';
  style.textContent = `
    .r17-stats{display:flex;flex-direction:column;gap:18px}.r17-stats-head{background:linear-gradient(135deg,#071b35,#174a7d);color:#fff;border-radius:24px;padding:25px 28px;display:flex;justify-content:space-between;align-items:flex-end;gap:20px;box-shadow:0 18px 40px rgba(7,27,53,.16);overflow:hidden;position:relative}.r17-stats-head:after{content:'';position:absolute;width:210px;height:210px;border-radius:50%;right:-80px;top:-110px;background:rgba(255,255,255,.08)}.r17-stats-head h2{margin:5px 0 4px;font-size:25px;letter-spacing:-.5px}.r17-stats-head p{margin:0;color:#c9d9e8;font-size:12px}.r17-kicker{font-size:10px;font-weight:800;letter-spacing:.14em;color:#8fc1e8}.r17-refresh{position:relative;z-index:2;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.1);color:#fff;border-radius:12px;padding:10px 14px;font-weight:800;cursor:pointer}.r17-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.r17-kpi{background:linear-gradient(145deg,#fff,#f8fbfe);border:1px solid rgba(23,74,125,.11);border-radius:19px;padding:18px;box-shadow:0 9px 25px rgba(7,27,53,.06);position:relative;overflow:hidden}.r17-kpi:before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(#174a7d,#6aa6d6)}.r17-kpi .ico{font-size:20px}.r17-kpi b{display:block;margin-top:8px;font-size:27px;color:#071b35;letter-spacing:-.7px}.r17-kpi span{font-size:10px;color:#64748b;font-weight:700}.r17-kpi small{display:block;margin-top:7px;color:#174a7d;font-size:9px;font-weight:800}.r17-grid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(300px,.65fr);gap:18px}.r17-panel{background:#fff;border:1px solid rgba(23,74,125,.11);border-radius:21px;overflow:hidden;box-shadow:0 10px 30px rgba(7,27,53,.06)}.r17-panel-head{padding:18px 21px;border-bottom:1px solid #e8eef4}.r17-panel-head h3{margin:0;color:#071b35;font-size:14px}.r17-panel-head p{margin:5px 0 0;color:#7a8798;font-size:10px}.r17-panel-body{padding:17px 21px}.r17-district{padding:10px 0}.r17-district-top{display:flex;justify-content:space-between;gap:10px;font-size:11px}.r17-district-top span{color:#526075;font-weight:700}.r17-district-top b{color:#071b35}.r17-track{height:10px;background:#e9eff5;border-radius:99px;overflow:hidden;margin-top:7px}.r17-track i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#174a7d,#63a3d4)}.r17-district small{display:block;margin-top:5px;color:#8a96a6;font-size:9px}.r17-rank{display:flex;align-items:center;gap:11px;padding:11px 0;border-bottom:1px solid #edf1f5}.r17-rank:last-child{border-bottom:0}.r17-rank .place{width:30px;height:30px;border-radius:10px;background:#edf5fc;display:grid;place-items:center;font-weight:900;color:#174a7d}.r17-rank .grow{flex:1;min-width:0}.r17-rank strong{display:block;font-size:11px;color:#071b35}.r17-rank small{display:block;color:#7a8798;font-size:9px;margin-top:3px}.r17-rank b{font-size:13px;color:#174a7d}.r17-mini-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.r17-mini{background:#f7fafc;border:1px solid #e7eef4;border-radius:14px;padding:13px}.r17-mini b{display:block;font-size:19px;color:#071b35}.r17-mini span{font-size:9px;color:#718096;font-weight:700}.r17-status{display:flex;align-items:center;gap:12px;margin-bottom:13px}.r17-status .ring{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(#174a7d var(--p),#e7eef4 0)}.r17-status .ring:after{content:attr(data-value);width:38px;height:38px;border-radius:50%;background:#fff;display:grid;place-items:center;font-size:10px;font-weight:900;color:#071b35}.r17-month{display:flex;align-items:center;gap:10px;margin:8px 0}.r17-month label{width:48px;font-size:9px;color:#64748b}.r17-month .bar{flex:1;height:8px;background:#edf1f5;border-radius:99px;overflow:hidden}.r17-month .bar i{display:block;height:100%;background:#4f8fc4;border-radius:99px}.r17-month b{width:28px;text-align:right;font-size:10px;color:#071b35}.r17-note{font-size:9px;color:#8a96a6;margin-top:8px}.r17-filter{display:flex;gap:8px;align-items:center;margin-top:14px}.r17-filter select{border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.1);color:#fff;border-radius:10px;padding:8px 10px;font-size:10px;position:relative;z-index:2}
    body.dark .r17-kpi,body.dark .r17-panel{background:linear-gradient(145deg,#0d2744,#0a2038);border-color:rgba(148,190,226,.14)}body.dark .r17-kpi b,body.dark .r17-panel-head h3,body.dark .r17-district-top b,body.dark .r17-rank strong,body.dark .r17-mini b,body.dark .r17-month b{color:#f4f8fc}body.dark .r17-kpi span,body.dark .r17-panel-head p,body.dark .r17-district-top span,body.dark .r17-rank small,body.dark .r17-mini span,body.dark .r17-note,body.dark .r17-district small,body.dark .r17-month label{color:#a9bacb}body.dark .r17-panel-head,.dark .r17-rank{border-color:rgba(148,190,226,.1)}body.dark .r17-mini{background:#102c47;border-color:rgba(148,190,226,.1)}body.dark .r17-status .ring:after{background:#0d2744;color:#f4f8fc}
    @media(max-width:1000px){.r17-kpis{grid-template-columns:repeat(2,1fr)}.r17-grid{grid-template-columns:1fr}}@media(max-width:600px){.r17-stats-head{padding:20px;border-radius:18px;align-items:flex-start;flex-direction:column}.r17-stats-head h2{font-size:21px}.r17-kpis{grid-template-columns:1fr 1fr;gap:9px}.r17-kpi{padding:14px;border-radius:15px}.r17-kpi b{font-size:21px}.r17-panel{border-radius:17px}.r17-panel-body{padding:14px}.r17-mini-grid{gap:8px}}
  `;
  document.head.appendChild(style);

  async function get(table, select='*') {
    const {data, error} = await client.from(table).select(select);
    if (error) throw error;
    return data || [];
  }

  async function load() {
    const [volunteers,districts,centers,activities,events,parts,performance] = await Promise.all([
      get('voluntarios','*'),get('distritos','*'),get('centros_educativos','*'),get('actividades','*'),get('eventos','*'),get('participaciones','*'),get('voluntario_desempeno','*')
    ]);
    return {volunteers,districts,centers:centers.filter(c=>c.is_active!==false),activities:activities.filter(a=>a.is_active!==false),events:events.filter(e=>e.is_active!==false),parts,performance};
  }

  const districtName=(d,id)=>d.find(x=>x.id===id)?.nombre||id||'Sin distrito';
  const escName=v=>String(v?.nombre||v?.full_name||'Sin nombre');

  function html(d, selected='all') {
    const vols=selected==='all'?d.volunteers:d.volunteers.filter(v=>String(v.distrito_id)===selected);
    const active=vols.filter(v=>v.estatus==='Activo').length;
    const pending=vols.filter(v=>v.estatus==='En espera').length;
    const inactive=vols.filter(v=>v.estatus==='Inactivo').length;
    const hours=d.performance.reduce((s,p)=>s+num(p.horas),0);
    const avg=d.performance.length?d.performance.reduce((s,p)=>s+num(p.indice),0)/d.performance.length:0;
    const evaluated=d.performance.filter(p=>p.evaluacion!=null).length;
    const attendance=d.parts.length?d.parts.filter(p=>p.asistencia===true).length/d.parts.length*100:0;
    const byDistrict=d.districts.map(x=>({id:x.id,nombre:x.nombre,total:vols.filter(v=>v.distrito_id===x.id).length,active:vols.filter(v=>v.distrito_id===x.id&&v.estatus==='Activo').length})).sort((a,b)=>b.total-a.total);
    const maxDistrict=Math.max(...byDistrict.map(x=>x.total),1);
    const roles={};d.parts.forEach(p=>{const k=p.rol_id||'Sin rol';roles[k]=(roles[k]||0)+1});
    const roleRows=Object.entries(roles).sort((a,b)=>b[1]-a[1]).slice(0,6);
    const months={};d.activities.forEach(a=>{if(a.fecha){const k=a.fecha.slice(0,7);months[k]=(months[k]||0)+1}});
    const monthRows=Object.entries(months).sort().slice(-8);const maxMonth=Math.max(...monthRows.map(x=>x[1]),1);
    const participation=d.parts.length;
    const top=byDistrict.filter(x=>x.total>0).slice(0,5);
    const rate=vols.length?active/vols.length*100:0;
    return `<div class="r17-stats">
      <div class="r17-stats-head"><div><span class="r17-kicker">CENTRO DE ANALÍTICA · REGIONAL 17</span><h2>Estadísticas y rendimiento regional</h2><p>Indicadores calculados con los datos disponibles en la plataforma.</p><div class="r17-filter"><select id="r17-district-filter"><option value="all">Todos los distritos</option>${d.districts.map(x=>`<option value="${esc(x.id)}" ${selected===String(x.id)?'selected':''}>${esc(x.nombre)}</option>`).join('')}</select></div></div><button class="r17-refresh" id="r17-refresh">↻ Actualizar</button></div>
      <div class="r17-kpis">
        <div class="r17-kpi"><div class="ico">♙</div><b>${fmt(vols.length)}</b><span>Voluntarios</span><small>${fmt(active)} activos · ${fmt(pending)} en espera</small></div>
        <div class="r17-kpi"><div class="ico">✓</div><b>${fmt(d.activities.length)}</b><span>Actividades</span><small>${fmt(participation)} participaciones registradas</small></div>
        <div class="r17-kpi"><div class="ico">⌂</div><b>${fmt(d.centers.length)}</b><span>Centros educativos</span><small>${fmt(d.districts.length)} distritos registrados</small></div>
        <div class="r17-kpi"><div class="ico">◷</div><b>${fmt(hours)}</b><span>Horas colaboradas</span><small>${fmt(d.events.length)} eventos activos</small></div>
        <div class="r17-kpi"><div class="ico">↗</div><b>${avg.toFixed(1)}</b><span>Índice promedio</span><small>${fmt(evaluated)} registros evaluados</small></div>
        <div class="r17-kpi"><div class="ico">◉</div><b>${attendance.toFixed(0)}%</b><span>Asistencia</span><small>${fmt(d.parts.length)} participaciones contabilizadas</small></div>
        <div class="r17-kpi"><div class="ico">⚡</div><b>${rate.toFixed(0)}%</b><span>Actividad del equipo</span><small>${fmt(inactive)} inactivos</small></div>
        <div class="r17-kpi"><div class="ico">★</div><b>${fmt(top[0]?.total||0)}</b><span>Distrito líder</span><small>${esc(top[0]?.nombre||'Sin datos')}</small></div>
      </div>
      <div class="r17-grid">
        <section class="r17-panel"><div class="r17-panel-head"><h3>Participación por distrito</h3><p>Voluntarios registrados y activos en cada distrito.</p></div><div class="r17-panel-body">${byDistrict.map(x=>`<div class="r17-district"><div class="r17-district-top"><span>${esc(x.nombre)}</span><b>${fmt(x.total)}</b></div><div class="r17-track"><i style="width:${x.total/maxDistrict*100}%"></i></div><small>${fmt(x.active)} activos · ${vols.length?((x.total/vols.length)*100).toFixed(1):0}% del filtro actual</small></div>`).join('')||'<div class="r17-note">Sin distritos disponibles.</div>'}</div></section>
        <section class="r17-panel"><div class="r17-panel-head"><h3>Ranking distrital</h3><p>Mayor concentración de voluntarios.</p></div><div class="r17-panel-body">${top.map((x,i)=>`<div class="r17-rank"><div class="place">${i+1}</div><div class="grow"><strong>${esc(x.nombre)}</strong><small>${fmt(x.active)} activos</small></div><b>${fmt(x.total)}</b></div>`).join('')||'<div class="r17-note">Sin datos para clasificar.</div>'}</div></section>
      </div>
      <div class="r17-grid">
        <section class="r17-panel"><div class="r17-panel-head"><h3>Evolución de actividades</h3><p>Últimos meses con registros disponibles.</p></div><div class="r17-panel-body">${monthRows.map(([m,n])=>`<div class="r17-month"><label>${esc(m)}</label><div class="bar"><i style="width:${n/maxMonth*100}%"></i></div><b>${n}</b></div>`).join('')||'<div class="r17-note">No hay fechas de actividades disponibles.</div>'}</div></section>
        <section class="r17-panel"><div class="r17-panel-head"><h3>Distribución de roles</h3><p>Participaciones por función registrada.</p></div><div class="r17-panel-body">${roleRows.map(([r,n])=>`<div class="r17-month"><label title="${esc(r)}">${esc(r).slice(0,9)}</label><div class="bar"><i style="width:${n/Math.max(...roleRows.map(x=>x[1]),1)*100}%"></i></div><b>${n}</b></div>`).join('')||'<div class="r17-note">No hay roles registrados.</div>'}</div></section>
      </div>
      <div class="r17-panel"><div class="r17-panel-head"><h3>Resumen operativo</h3><p>Lectura rápida de los indicadores principales.</p></div><div class="r17-panel-body"><div class="r17-status"><div class="ring" style="--p:${rate}%" data-value="${rate.toFixed(0)}%"></div><div><strong style="font-size:13px;color:var(--text,#071b35)">Equipo activo</strong><div class="r17-note">${fmt(active)} de ${fmt(vols.length)} voluntarios tienen estatus Activo.</div></div></div><div class="r17-mini-grid"><div class="r17-mini"><b>${fmt(d.events.length)}</b><span>Eventos activos</span></div><div class="r17-mini"><b>${fmt(evaluated)}</b><span>Evaluaciones registradas</span></div><div class="r17-mini"><b>${fmt(pending)}</b><span>Voluntarios en espera</span></div><div class="r17-mini"><b>${fmt(inactive)}</b><span>Voluntarios inactivos</span></div></div></div></div>
    </div>`;
  }

  async function enhance() {
    const target=document.querySelector('.stats-grid.wide');
    if(!target || busy) return;
    if(target.closest('.r17-stats')) return;
    busy=true;
    try {
      if(!cache) cache=await load();
      const content=document.getElementById('content');
      if(!content) return;
      content.innerHTML=html(cache);
      document.getElementById('r17-district-filter')?.addEventListener('change',e=>{content.innerHTML=html(cache,e.target.value);bind()});
      document.getElementById('r17-refresh')?.addEventListener('click',async()=>{cache=null;await enhance()});
    } catch(e) { console.error('R17 stats enhancer',e); }
    finally { busy=false; }
  }
  function bind(){document.getElementById('r17-district-filter')?.addEventListener('change',async e=>{const c=document.getElementById('content');c.innerHTML=html(cache,e.target.value);bind()});document.getElementById('r17-refresh')?.addEventListener('click',async()=>{cache=null;const c=document.getElementById('content');c.innerHTML='<div class="loading"><span class="spinner"></span>Actualizando estadísticas…</div>';try{cache=await load();c.innerHTML=html(cache);bind()}catch(e){console.error(e)}})}
  const observer=new MutationObserver(()=>{clearTimeout(window.__r17StatsTimer);window.__r17StatsTimer=setTimeout(enhance,30)});
  observer.observe(document.body,{childList:true,subtree:true});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',enhance,{once:true}); else enhance();
})();