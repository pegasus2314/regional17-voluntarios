(()=>{'use strict';
const cfg=window.RV_CONFIG||{};
if(!cfg.SUPABASE_URL||!window.supabase?.createClient)return;
const db=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=v=>Number(v||0).toFixed(2).replace(/\.00$/,'');
let busy=false;
async function getData(eid){
 const [ev,parts,assign,score,crit,cats,com]=await Promise.all([
  db.from('evaluaciones').select('*').eq('id',eid).maybeSingle(),
  db.from('evaluacion_participantes').select('*').eq('evaluacion_id',eid).order('nombre'),
  db.from('evaluacion_asignaciones').select('*').eq('evaluacion_id',eid).order('created_at'),
  db.from('evaluacion_puntuaciones').select('*'),
  db.from('evaluacion_plantilla_criterios').select('*').eq('activo',true).order('orden'),
  db.from('evaluacion_categorias').select('*').order('orden'),
  db.from('evaluacion_comisiones').select('*').eq('evaluacion_id',eid).order('orden')
 ]);
 for(const q of [ev,parts,assign,score,crit,cats,com])if(q.error)throw q.error;
 const evaluation=ev.data,participants=parts.data||[],assignments=assign.data||[],scores=score.data||[],criteria=crit.data||[],categories=cats.data||[],commissions=com.data||[];
 const pmap=new Map(participants.map(p=>[p.id,p])), cmap=new Map(commissions.map(c=>[c.id,c])), crmap=new Map(criteria.map(c=>[c.id,c])), catmap=new Map(categories.map(c=>[c.id,c]));
 const details=[];
 for(const a of assignments){
  const p=pmap.get(a.participante_id); if(!p)continue;
  const rows=scores.filter(s=>s.asignacion_id===a.id);
  const byCriterion=new Map(rows.map(s=>[s.criterio_id,s]));
  const total=rows.reduce((n,s)=>n+Number(s.puntuacion||0),0);
  const max=criteria.filter(c=>catmap.has(c.categoria_id)).reduce((n,c)=>n+Number(c.max_puntos||0),0);
  details.push({assignment:a,participant:p,commission:cmap.get(p.comision_id),byCriterion,total,max});
 }
 const resultMap=new Map();
 for(const d of details){
  let r=resultMap.get(d.participant.id); if(!r){r={participant:d.participant,commission:d.commission,evaluations:0,total:0,max:d.max,criteria:{}};resultMap.set(d.participant.id,r)}
  r.evaluations++;r.total+=d.total;
  for(const c of criteria){const s=d.byCriterion.get(c.id);if(!s)continue;if(!r.criteria[c.id])r.criteria[c.id]={sum:0,count:0};r.criteria[c.id].sum+=Number(s.puntuacion||0);r.criteria[c.id].count++}
 }
 const results=[...resultMap.values()].map(r=>{const avg=r.evaluations?r.total/r.evaluations:0;const row={Participante:r.participant.nombre,Delegación:r.participant.delegacion||'',Comisión:r.commission?.nombre||'',Evaluadores:r.evaluations,Total:avg,'Máximo':r.max,Porcentaje:r.max?avg/r.max*100:0};for(const c of criteria){const x=r.criteria[c.id];row[c.nombre]=x?x.sum/x.count:''}return row}).sort((a,b)=>Number(b.Porcentaje)-Number(a.Porcentaje)||String(a.Participante).localeCompare(String(b.Participante)));
 const detailRows=[];
 for(const d of details){const row={Participante:d.participant.nombre,Delegación:d.participant.delegacion||'',Comisión:d.commission?.nombre||'',Evaluador:d.assignment.evaluador_id,Estado:d.assignment.estado||'pendiente'};for(const c of criteria){const s=d.byCriterion.get(c.id);row[c.nombre]=s?Number(s.puntuacion):''}row.Total=d.total;row.Máximo=d.max;row.Porcentaje=d.max?d.total/d.max*100:0;detailRows.push(row)}
 return {evaluation,results,detailRows,criteria};
}
function selectedId(){return document.getElementById('evalFilter')?.value||document.querySelector('.eval-item.active')?.dataset.eid||''}
function notify(m,t='success'){if(window.toast)window.toast(m,t);else alert(m)}
function filename(name,ext){return `${String(name||'evaluacion').replace(/[^a-z0-9áéíóúñü _-]/gi,'').trim().replace(/\s+/g,'_')}.${ext}`}
function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}
function csv(rows){if(!rows.length)return '';const cols=[...new Set(rows.flatMap(r=>Object.keys(r)))];const q=v=>`"${String(v??'').replace(/"/g,'""')}"`;return '\ufeff'+cols.map(q).join(',')+'\n'+rows.map(r=>cols.map(c=>q(r[c])).join(',')).join('\n')}
async function exportXlsx(){const id=selectedId();if(!id)return notify('Selecciona una evaluación primero.','error');if(busy)return;busy=true;try{const d=await getData(id);if(!d.results.length)return notify('No hay resultados disponibles para exportar.','error');if(!window.XLSX)return notify('No se cargó el exportador de Excel. Recarga la página.','error');const wb=XLSX.utils.book_new();const ws=XLSX.utils.json_to_sheet(d.results);const wd=XLSX.utils.json_to_sheet(d.detailRows);XLSX.utils.book_append_sheet(wb,ws,'Resultados');XLSX.utils.book_append_sheet(wb,wd,'Detalle');XLSX.writeFile(wb,filename(d.evaluation?.nombre,'xlsx'));notify('Excel generado correctamente')}catch(e){console.error(e);notify('No se pudo exportar el Excel.','error')}finally{busy=false}}
async function exportCsv(){const id=selectedId();if(!id)return notify('Selecciona una evaluación primero.','error');try{const d=await getData(id);if(!d.results.length)return notify('No hay resultados disponibles para exportar.','error');downloadBlob(new Blob([csv(d.results)],{type:'text/csv;charset=utf-8'}),filename(d.evaluation?.nombre,'csv'));notify('CSV generado correctamente')}catch(e){console.error(e);notify('No se pudo exportar el CSV.','error')}}
async function printPdf(){const id=selectedId();if(!id)return notify('Selecciona una evaluación primero.','error');try{const d=await getData(id);if(!d.results.length)return notify('No hay resultados disponibles para imprimir.','error');const cols=Object.keys(d.results[0]);const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${esc(d.evaluation?.nombre||'Resultados')}</title><style>body{font-family:Arial,sans-serif;padding:28px;color:#182433}h1{font-size:22px;margin:0 0 6px}p{color:#667085}table{width:100%;border-collapse:collapse;font-size:9px;margin-top:18px}th,td{border:1px solid #cfd6df;padding:6px;text-align:left}th{background:#edf2f7}tr:nth-child(even){background:#f8fafc}@media print{button{display:none}}</style></head><body><h1>${esc(d.evaluation?.nombre||'Resultados')}</h1><p>Resultados de evaluación · ${new Date().toLocaleString('es-DO')}</p><table><thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${d.results.map(r=>`<tr>${cols.map(c=>`<td>${esc(r[c])}</td>`).join('')}</tr>`).join('')}</tbody></table><script>window.onload=()=>setTimeout(()=>window.print(),250)<\/script></body></html>`;const w=window.open('','_blank');if(!w)return notify('El navegador bloqueó la ventana de impresión. Permite ventanas emergentes.','error');w.document.write(html);w.document.close()}catch(e){console.error(e);notify('No se pudo preparar el PDF.','error')}}
function install(){const toolbar=document.querySelector('#resultsBtn')?.parentElement;if(!toolbar||toolbar.querySelector('[data-eval-export]'))return;const wrap=document.createElement('span');wrap.dataset.evalExport='1';wrap.style.cssText='display:flex;gap:8px;flex-wrap:wrap';wrap.innerHTML='<button class="btn" data-export-xlsx>📥 Excel</button><button class="btn" data-export-csv>CSV</button><button class="btn" data-export-pdf>PDF</button>';toolbar.appendChild(wrap);wrap.querySelector('[data-export-xlsx]').onclick=exportXlsx;wrap.querySelector('[data-export-csv]').onclick=exportCsv;wrap.querySelector('[data-export-pdf]').onclick=printPdf}
new MutationObserver(install).observe(document.body,{childList:true,subtree:true});
})();