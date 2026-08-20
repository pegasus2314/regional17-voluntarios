/* Regional 17 · Resultados y ranking · vista general tipo hoja MUN */
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
      .rvr-head{position:sticky;top:0;z-index:5;background:#fff;border-bottom:1px solid #e6ecf3;padding:18px 22px;display:flex;justify-content:space-between;align-items:center;gap:14px}
      .rvr-head h2{margin:3px 0;color:#102a54;font-size:21px}.rvr-head p{margin:0;color:#718096;font-size:11px}.rvr-close{width:36px;height:36px;border:1px solid #dfe6f0;background:#fff;border-radius:10px;font-size:21px;cursor:pointer}
      .rvr-body{padding:18px 22px 24px}.rvr-filters{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}.rvr-filters select{border:1px solid #d8e1ec;border-radius:10px;padding:10px;background:#fff}
      .rvr-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}.rvr-card{background:#fff;border:1px solid #e1e8f2;border-radius:12px;padding:12px}.rvr-card span{display:block;color:#718096;font-size:10px}.rvr-card strong{display:block;color:#142d55;font-size:21px;margin-top:3px}
      .rvr-sheet{background:#fff;border:1px solid #aebbd0;border-radius:4px;overflow:auto;box-shadow:0 5px 18px rgba(16,42,84,.08)}
      .rvr-sheet-title{padding:16px 18px 12px;text-align:center;border-bottom:1px solid #d7dfeb}.rvr-sheet-title strong{display:block;color:#173b6b;font-size:19px}.rvr-sheet-title span{display:block;color:#5e718b;font-size:12px;font-style:italic;margin-top:3px}
      .rvr-table{width:100%;min-width:980px;border-collapse:collapse;table-layout:fixed}.rvr-table th,.rvr-table td{border:1px solid #aebbd0}.rvr-table th{background:#315b98;color:#fff;text-align:center;font-weight:800;font-size:11px;padding:9px 5px;line-height:1.15}.rvr-table thead tr:nth-child(2) th{background:#87a5d0;font-size:10px;padding:5px}.rvr-table td{padding:7px 6px;font-size:11px;line-height:1.2;text-align:center}.rvr-table td.name,.rvr-table td.country{text-align:left}.rvr-table td.name{font-weight:700}.rvr-table td.country{font-weight:500}.rvr-table tbody tr:nth-child(even){background:#f8fbff}.rvr-table tbody tr.score-high{background:#dcefc8}.rvr-table tbody tr.score-low{background:#f7d1d1}.rvr-table tbody tr.score-empty{background:#f9f9f9;color:#6b7280}.rvr-rank{font-weight:900;color:#173b6b}.rvr-score{font-weight:800}.rvr-total{font-size:12px;font-weight:900;color:#102a54}.rvr-table th.col-no{width:42px}.rvr-table th.col-name{width:190px}.rvr-table th.col-country{width:145px}.rvr-table th.col-criterion{width:105px}.rvr-table th.col-total{width:82px}
      .rvr-empty{padding:30px;text-align:center;color:#718096;font-size:12px}
      .dark .rvr-window,[data-theme="dark"] .rvr-window{background:#101923;border-color:#263545}.dark .rvr-head,[data-theme="dark"] .rvr-head,.dark .rvr-card,[data-theme="dark"] .rvr-card{background:#101923;border-color:#263545}.dark .rvr-head h2,.dark .rvr-card strong,[data-theme="dark"] .rvr-head h2,[data-theme="dark"] .rvr-card strong{color:#e8eef5}.dark .rvr-filters select,[data-theme="dark"] .rvr-filters select{background:#101923;color:#e8eef5;border-color:#304052}
      @media(max-width:760px){.rvr-cards{grid-template-columns:repeat(2,1fr)}.rvr-filters{grid-template-columns:1fr}.rvr-body,.rvr-head{padding:14px}.rvr-table{min-width:980px}}
    `;document.head.appendChild(s)
  }
  async function open(){
    close();styles();
    const o=document.createElement('div');o.id=ID;o.className='rvr-shell';
    o.innerHTML=`<section class="rvr-window"><header class="rvr-head"><div><div style="font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#2463c7">Sistema Regional 17</div><h2>Vista general de evaluación</h2><p>Hoja consolidada de puntuaciones · Oratoria 15 · Argumentación 25 · Negociación 20 · Liderazgo 15 · Redacción 25</p></div><button class="rvr-close" aria-label="Cerrar">×</button></header><div class="rvr-body"><div class="rvr-filters"><select id="rvr-eval"><option value="">Seleccionar evaluación...</option></select><select id="rvr-com"><option value="">Todas las comisiones</option></select></div><div class="rvr-cards"><div class="rvr-card"><span>Delegados evaluados</span><strong id="rvr-n">0</strong></div><div class="rvr-card"><span>Promedio general</span><strong id="rvr-avg">0.0</strong></div><div class="rvr-card"><span>Mayor puntuación</span><strong id="rvr-max">0.0</strong></div><div class="rvr-card"><span>Evaluaciones completadas</span><strong id="rvr-done">0</strong></div></div><div id="rvr-content" class="rvr-empty">Selecciona una evaluación.</div></div></section>`;
    document.body.appendChild(o);o.querySelector('.rvr-close').onclick=close;
    const db=await get();
    const {data:evals,error:ee}=await db.from('evaluaciones').select('id,nombre,tipo,estado,plantilla_id').order('created_at',{ascending:false});
    if(ee){toast('No se pudieron cargar las evaluaciones');return}
    const sel=o.querySelector('#rvr-eval');(evals||[]).forEach(e=>{const x=document.createElement('option');x.value=e.id;x.textContent=`${e.nombre} · ${e.tipo}`;sel.appendChild(x)});
    sel.onchange=async()=>{await load(o,sel.value)};
    o.querySelector('#rvr-com').onchange=async()=>{if(sel.value)await load(o,sel.value)};
  }
  async function load(o,eid){
    if(!eid)return;
    const content=o.querySelector('#rvr-content');content.innerHTML='<div class="rvr-empty">Cargando hoja...</div>';
    const db=await get();
    const ev=await db.from('evaluaciones').select('id,nombre,tipo,plantilla_id').eq('id',eid).maybeSingle();
    if(ev.error||!ev.data){content.innerHTML='<div class="rvr-empty">No se pudo cargar la evaluación.</div>';return}
    const pRes=await db.from('evaluacion_participantes').select('id,nombre,delegacion,delegacion_id').eq('evaluacion_id',eid);
    if(pRes.error){content.innerHTML='<div class="rvr-empty">No se pudieron cargar los delegados.</div>';return}
    const participants=pRes.data||[];const pids=participants.map(x=>x.id);
    let countries={};const dids=[...new Set(participants.map(x=>x.delegacion_id).filter(Boolean))];
    if(dids.length){const d=await db.from('evaluacion_delegaciones').select('id,pais,nombre_oficial,codigo_pais,bandera_emoji,comision_id').in('id',dids);if(!d.error)(d.data||[]).forEach(x=>countries[x.id]=x)}
    let commissions={};const comids=[...new Set(Object.values(countries).map(x=>x.comision_id).filter(Boolean))];
    if(comids.length){const c=await db.from('evaluacion_comisiones').select('id,evaluacion_id,nombre,orden').in('id',comids).order('orden');if(!c.error)(c.data||[]).forEach(x=>commissions[x.id]=x)}
    const cats=await db.from('evaluacion_categorias').select('id,plantilla_id,nombre,max_puntos,orden').eq('plantilla_id',ev.data.plantilla_id).order('orden');
    const criteriaRes=cats.data?.length?await db.from('evaluacion_plantilla_criterios').select('id,categoria_id,nombre,max_puntos,orden,activo').in('categoria_id',(cats.data||[]).map(x=>x.id)).eq('activo',true).order('orden'):null;
    let criteria=(criteriaRes?.data||[]).slice().sort((a,b)=>a.orden-b.orden);
    // The official MUN rubric for this system is exactly five criteria totaling 100.
    const official=[['Oratoria',15],['Argumentación',25],['Negociación',20],['Liderazgo',15],['Redacción',25]];
    if(criteria.length!==5||criteria.some((c,i)=>c.nombre!==official[i][0]||Number(c.max_puntos)!==official[i][1])){
      criteria=official.map((x,i)=>({id:null,nombre:x[0],max_puntos:x[1],orden:i+1}));
    }
    const scoreRes=pids.length?await db.from('evaluacion_puntuaciones').select('asignacion_id,criterio_id,puntuacion,observacion').in('asignacion_id',(await db.from('evaluacion_asignaciones').select('id,participante_id,estado').in('participante_id',pids)).data?.map(x=>x.id)||[]):null;
    const asgRes=pids.length?await db.from('evaluacion_asignaciones').select('id,participante_id,estado').in('participante_id',pids):{data:[]};
    const asgs=asgRes.data||[];const asgByParticipant={};asgs.forEach(x=>asgByParticipant[x.participante_id]=x);
    const scoresByAssignment={};(scoreRes?.data||[]).forEach(x=>(scoresByAssignment[x.asignacion_id]??={})[x.criterio_id]=Number(x.puntuacion||0));
    const criterionByName={};criteria.forEach(c=>criterionByName[c.nombre]=c);
    const rows=participants.map(p=>{
      const d=countries[p.delegacion_id];const asg=asgByParticipant[p.id];const raw=scoresByAssignment[asg?.id]||{};
      const vals=criteria.map(c=>{let v=raw[c.id];if(v===undefined){const key=Object.keys(raw).find(k=>{return false});v=undefined}return v});
      const total=vals.every(v=>v!==undefined)?vals.reduce((a,v)=>a+Number(v||0),0):null;
      return {...p,country:d,commission:d?.comision_id?commissions[d.comision_id]:null,vals,total,done:asg?.estado==='completada'};
    });
    const filter=o.querySelector('#rvr-com').value;const visible=filter?rows.filter(x=>x.commission?.id===filter):rows;
    visible.sort((a,b)=>(b.total??-1)-(a.total??-1));
    const scored=visible.filter(x=>x.total!==null);o.querySelector('#rvr-n').textContent=scored.length;o.querySelector('#rvr-done').textContent=visible.filter(x=>x.done).length;o.querySelector('#rvr-avg').textContent=scored.length?(scored.reduce((a,x)=>a+x.total,0)/scored.length).toFixed(2):'0.00';o.querySelector('#rvr-max').textContent=scored.length?Math.max(...scored.map(x=>x.total)).toFixed(2):'0.00';
    const comSel=o.querySelector('#rvr-com');const old=comSel.value;comSel.innerHTML='<option value="">Todas las comisiones</option>';Object.values(commissions).filter(c=>c.evaluacion_id===eid).forEach(c=>{const x=document.createElement('option');x.value=c.id;x.textContent=c.nombre;comSel.appendChild(x)});if(old&&[...comSel.options].some(x=>x.value===old))comSel.value=old;
    const header=`<tr><th class="col-no" rowspan="2">No.</th><th class="col-name" rowspan="2">Delegado/a</th><th class="col-country" rowspan="2">País</th>${criteria.map(c=>`<th class="col-criterion" rowspan="2">${esc(c.nombre)}<br><small>(${Number(c.max_puntos)})</small></th>`).join('')}<th class="col-total" rowspan="2">TOTAL<br>(100)</th></tr>`;
    const body=visible.map((x,i)=>{const scoreClass=x.total===null?'score-empty':x.total>=80?'score-high':x.total<60?'score-low':'';return `<tr class="${scoreClass}"><td class="rvr-rank">${i+1}</td><td class="name">${esc(x.nombre)}</td><td class="country">${esc(x.country?.bandera_emoji||'🌎')} ${esc(x.country?.pais||x.delegacion||'—')}</td>${x.vals.map((v,j)=>`<td>${v===undefined?'':Number(v).toFixed(v%1?1:0)}</td>`).join('')}<td class="rvr-total">${x.total===null?'0,0':Number(x.total).toFixed(2).replace('.',',')}</td></tr>`}).join('');
    content.innerHTML=`<div class="rvr-sheet"><div class="rvr-sheet-title"><strong>${esc(ev.data.nombre)}</strong><span>Rúbrica Oficial PLERD — Regional 17</span></div><table class="rvr-table"><thead>${header}</thead><tbody>${body||'<tr><td colspan="9" class="rvr-empty">No hay delegados registrados.</td></tr>'}</tbody></table></div>`;
  }
  window.addEventListener('rv-open-evaluation-results',open);window.RV_EVALUATION_RESULTS={open,close};
})();