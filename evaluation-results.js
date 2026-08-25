/* Regional 17 · Resultados sincronizados del sistema de evaluación */
(() => {
  'use strict';
  const ID='rv-evaluation-results';
  const cfg=window.RV_CONFIG||{};
  let sb=null;
  const get=async()=>sb||(sb=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY));
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const close=()=>document.getElementById(ID)?.remove();
  const toast=m=>{const e=document.createElement('div');e.className='toast info';e.textContent=m;document.body.appendChild(e);setTimeout(()=>e.remove(),2800)};
  function styles(){
    if(document.getElementById(ID+'-style'))return;
    const s=document.createElement('style');s.id=ID+'-style';s.textContent=`
      .rvr-shell{position:fixed;inset:0;z-index:10070;background:rgba(7,27,53,.5);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:12px}
      .rvr-window{width:min(1320px,100%);max-height:96vh;overflow:auto;background:#f7f9fc;border:1px solid #dfe6f0;border-radius:16px;box-shadow:0 25px 80px rgba(7,27,53,.28)}
      .rvr-head{position:sticky;top:0;z-index:5;background:#fff;border-bottom:1px solid #e6ecf3;padding:18px 22px;display:flex;justify-content:space-between;align-items:center;gap:14px}.rvr-head h2{margin:3px 0;color:#102a54;font-size:21px}.rvr-head p{margin:0;color:#718096;font-size:11px}.rvr-close{width:36px;height:36px;border:1px solid #dfe6f0;background:#fff;border-radius:10px;font-size:21px;cursor:pointer}
      .rvr-body{padding:18px 22px 24px}.rvr-filters{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}.rvr-filters select{border:1px solid #d8e1ec;border-radius:10px;padding:10px;background:#fff;color:#183153}
      .rvr-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}.rvr-card{background:#fff;border:1px solid #e1e8f2;border-radius:12px;padding:12px}.rvr-card span{display:block;color:#718096;font-size:10px}.rvr-card strong{display:block;color:#142d55;font-size:21px;margin-top:3px}
      .rvr-sheet{background:#fff;border:1px solid #aebbd0;border-radius:6px;overflow:auto;box-shadow:0 5px 18px rgba(16,42,84,.08)}.rvr-sheet-title{padding:16px 18px 12px;text-align:center;border-bottom:1px solid #d7dfeb}.rvr-sheet-title strong{display:block;color:#173b6b;font-size:19px}.rvr-sheet-title span{display:block;color:#5e718b;font-size:12px;font-style:italic;margin-top:3px}
      .rvr-table{width:100%;min-width:1000px;border-collapse:collapse}.rvr-table th,.rvr-table td{border:1px solid #aebbd0}.rvr-table th{background:#315b98;color:#fff;text-align:center;font-weight:800;font-size:11px;padding:9px 6px}.rvr-table td{padding:8px 7px;font-size:11px;line-height:1.25;text-align:center}.rvr-table td.name,.rvr-table td.country{text-align:left}.rvr-table td.name{font-weight:800}.rvr-table tbody tr:nth-child(even){background:#f8fbff}.rvr-table tbody tr.score-high{background:#dcefc8}.rvr-rank{font-weight:900;color:#173b6b}.rvr-total{font-size:13px;font-weight:900;color:#102a54}.rvr-winner{font-size:15px}.rvr-empty{padding:30px;text-align:center;color:#718096;font-size:12px}.rvr-source{display:inline-flex;align-items:center;gap:6px;margin-top:9px;padding:6px 9px;border-radius:999px;background:#edf6ff;color:#2463c7;font-size:10px;font-weight:800}
      .dark .rvr-window,[data-theme="dark"] .rvr-window{background:#101923;border-color:#263545}.dark .rvr-head,[data-theme="dark"] .rvr-head,.dark .rvr-card,[data-theme="dark"] .rvr-card{background:#101923;border-color:#263545}.dark .rvr-head h2,.dark .rvr-card strong,[data-theme="dark"] .rvr-head h2,[data-theme="dark"] .rvr-card strong{color:#e8eef5}.dark .rvr-filters select,[data-theme="dark"] .rvr-filters select{background:#101923;color:#e8eef5;border-color:#304052}
      @media(max-width:760px){.rvr-cards{grid-template-columns:repeat(2,1fr)}.rvr-filters{grid-template-columns:1fr}.rvr-body,.rvr-head{padding:14px}.rvr-table{min-width:1000px}}
    `;document.head.appendChild(s)
  }
  async function open(){
    close();styles();
    const o=document.createElement('div');o.id=ID;o.className='rvr-shell';
    o.innerHTML=`<section class="rvr-window"><header class="rvr-head"><div><div style="font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#2463c7">Sistema Regional 17</div><h2>📊 Resultados de Evaluación</h2><p>Resultados sincronizados automáticamente desde el sistema externo de evaluación.</p><span class="rvr-source">● Sincronización en tiempo real con Supabase</span></div><button class="rvr-close" aria-label="Cerrar">×</button></header><div class="rvr-body"><div class="rvr-filters"><select id="rvr-model"><option value="">Seleccionar modelo...</option></select><select id="rvr-com"><option value="">Todas las comisiones</option></select></div><div class="rvr-cards"><div class="rvr-card"><span>Participantes evaluados</span><strong id="rvr-n">0</strong></div><div class="rvr-card"><span>Promedio</span><strong id="rvr-avg">0.0</strong></div><div class="rvr-card"><span>Mayor puntuación</span><strong id="rvr-max">0.0</strong></div><div class="rvr-card"><span>🥇 Primer lugar</span><strong id="rvr-winner">—</strong></div></div><div id="rvr-content" class="rvr-empty">Selecciona un modelo de evaluación.</div></div></section>`;
    document.body.appendChild(o);o.querySelector('.rvr-close').onclick=close;
    try{
      const db=await get();
      const {data:models,error}=await db.from('scoreboard_models').select('id,nombre,fecha,estado,distrito_id,distritos(nombre)').order('created_at',{ascending:false});
      if(error)throw error;
      const sel=o.querySelector('#rvr-model');(models||[]).forEach(m=>{const x=document.createElement('option');x.value=m.id;x.textContent=`${m.nombre}${m.fecha?' · '+m.fecha:''}`;sel.appendChild(x)});
      sel.onchange=async()=>{o.querySelector('#rvr-com').value='';await load(o,sel.value)};
      o.querySelector('#rvr-com').onchange=async()=>{if(sel.value)await load(o,sel.value)};
      if(models?.length===1){sel.value=models[0].id;await load(o,models[0].id)}
    }catch(err){console.error(err);toast('No se pudieron cargar los resultados de evaluación');o.querySelector('#rvr-content').innerHTML='<div class="rvr-empty">No fue posible conectar con los resultados del sistema de evaluación.</div>'}
  }
  async function load(o,modelId){
    if(!modelId)return;
    const content=o.querySelector('#rvr-content');content.innerHTML='<div class="rvr-empty">Cargando resultados...</div>';
    try{
      const db=await get();
      const {data,error}=await db.from('regional17_evaluation_results').select('evaluation_id,model_id,modelo,fecha_modelo,distrito_id,distrito,delegate_id,volunteer_id,participante,pais,nuid,modelo_comite,commission_id,comision,total,scores,comments,created_at,posicion').eq('model_id',modelId).order('total',{ascending:false});
      if(error)throw error;
      const rows=data||[];
      const comSel=o.querySelector('#rvr-com');const previous=comSel.value;comSel.innerHTML='<option value="">Todas las comisiones</option>';const seen=new Set();rows.forEach(r=>{if(r.commission_id&&!seen.has(r.commission_id)){seen.add(r.commission_id);const x=document.createElement('option');x.value=r.commission_id;x.textContent=r.comision||'Comisión';comSel.appendChild(x)}});if(previous&&seen.has(previous))comSel.value=previous;
      const filter=comSel.value;const visible=filter?rows.filter(r=>r.commission_id===filter):rows;
      visible.sort((a,b)=>Number(b.total||0)-Number(a.total||0));
      const scored=visible.filter(r=>Number.isFinite(Number(r.total)));const avg=scored.length?scored.reduce((a,r)=>a+Number(r.total),0)/scored.length:0;const max=scored.length?Math.max(...scored.map(r=>Number(r.total))):0;const winner=scored[0]?.participante||'—';
      o.querySelector('#rvr-n').textContent=scored.length;o.querySelector('#rvr-avg').textContent=avg.toFixed(2);o.querySelector('#rvr-max').textContent=max.toFixed(2);o.querySelector('#rvr-winner').textContent=winner.length>18?winner.slice(0,18)+'…':winner;
      if(!visible.length){content.innerHTML='<div class="rvr-empty">Todavía no hay calificaciones publicadas para este modelo.</div>';return}
      const body=visible.map((r,i)=>{const total=Number(r.total||0);const cls=total>=80?'score-high':'';const rank=i+1;return `<tr class="${cls}"><td class="rvr-rank ${rank===1?'rvr-winner':''}">${rank===1?'🥇':rank===2?'🥈':rank===3?'🥉':rank}</td><td class="name">${esc(r.participante)}</td><td class="country">${esc(r.pais||'—')}</td><td>${esc(r.modelo_comite||'—')}</td><td>${esc(r.comision||'General')}</td><td>${r.volunteer_id?'Vinculado':'—'}</td><td class="rvr-total">${total.toFixed(2).replace('.',',')} / 100</td></tr>`}).join('');
      const title=rows[0]?.modelo||'Resultados de evaluación';const district=rows[0]?.distrito||'';
      content.innerHTML=`<div class="rvr-sheet"><div class="rvr-sheet-title"><strong>${esc(title)}</strong><span>${esc(district)} · Resultados oficiales sincronizados</span></div><table class="rvr-table"><thead><tr><th>Pos.</th><th>Participante</th><th>País</th><th>Comité</th><th>Comisión</th><th>Voluntario</th><th>TOTAL</th></tr></thead><tbody>${body}</tbody></table></div>`;
    }catch(err){console.error(err);content.innerHTML='<div class="rvr-empty">No se pudieron cargar las calificaciones. Verifica los permisos del usuario.</div>'}
  }
  window.addEventListener('rv-open-evaluation-results',open);window.RV_EVALUATION_RESULTS={open,close};
})();