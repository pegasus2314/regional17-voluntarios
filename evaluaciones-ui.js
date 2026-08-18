(()=>{'use strict';
const cfg=window.RV_CONFIG||{};
if(!cfg.SUPABASE_URL||!window.supabase?.createClient)return;
const db=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
let user=null,evals=[],templates=[],categories=[],criteria=[],participants=[],assignments=[],scores=[],selectedEval=null,selectedParticipant=null,view='evaluate';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const toast=(m,t='success')=>window.toast?window.toast(m,t):alert(m);
const closed=e=>['cerrada','finalizada'].includes(String(e?.estado||'').toLowerCase());
const fmt=n=>Number.isFinite(Number(n))?Number(n).toFixed(1).replace('.0',''): '0';

async function load(){
 const u=await db.auth.getUser(); user=u.data.user; if(!user)return;
 const [e,t,cat,c,p,a,s]=await Promise.all([
  db.from('evaluaciones').select('*').order('fecha',{ascending:false}),
  db.from('evaluacion_plantillas').select('*').order('nombre'),
  db.from('evaluacion_categorias').select('*').order('orden'),
  db.from('evaluacion_plantilla_criterios').select('*').eq('activo',true).order('orden'),
  db.from('evaluacion_participantes').select('*').order('nombre'),
  db.from('evaluacion_asignaciones').select('*').order('created_at'),
  db.from('evaluacion_puntuaciones').select('*')
 ]);
 for(const x of [e,t,cat,c,p,a,s])if(x.error)throw x.error;
 evals=e.data||[];templates=t.data||[];categories=cat.data||[];criteria=c.data||[];participants=p.data||[];assignments=a.data||[];scores=s.data||[];
}
function evaluationParticipants(){return participants.filter(p=>p.evaluacion_id===selectedEval?.id)}
function criteriaForEval(){
 const ids=categories.filter(c=>c.plantilla_id===selectedEval?.plantilla_id).map(c=>c.id);
 return criteria.filter(c=>ids.includes(c.categoria_id));
}
function assignmentFor(p){return assignments.find(x=>x.evaluacion_id===selectedEval?.id&&x.participante_id===p?.id&&x.evaluador_id===user?.id)||null}
function scoreRowsForParticipant(p){
 const a=assignmentFor(p);return scores.filter(s=>s.asignacion_id===a?.id)
}
function participantResult(p){
 const cs=criteriaForEval(),rows=scoreRowsForParticipant(p),total=rows.reduce((n,s)=>n+Number(s.puntuacion||0),0),max=cs.reduce((n,c)=>n+Number(c.max_puntos||0),0);
 return {p,total,max,pct:max?total/max*100:0,count:rows.length,criteria:cs.length,assigned:!!assignmentFor(p)};
}
function render(){
 const r=document.getElementById('content');if(!r)return;
 const open=evals.filter(e=>!closed(e)).length;
 r.innerHTML=`<div class="eval-shell">
 <div class="eval-hero"><div><span class="eval-kicker">CENTRO DE EVALUACIONES</span><h2>Evaluaciones profesionales</h2><p class="eval-muted">Evalúa por comisión, participante y criterio.</p></div><span class="eval-status open">${open} abiertas</span></div>
 <div class="eval-grid"><section class="eval-card"><div class="eval-toolbar"><select class="eval-select" id="evalFilter"><option value="">Todas las evaluaciones</option>${evals.map(e=>`<option value="${e.id}" ${selectedEval?.id===e.id?'selected':''}>${esc(e.nombre)}</option>`).join('')}</select></div><div class="eval-list">${evals.length?evals.map(e=>`<button class="eval-item ${selectedEval?.id===e.id?'active':''}" data-eid="${e.id}"><strong>${esc(e.nombre)}</strong><small>${esc(e.tipo||'Evaluación')} · ${esc(e.estado||'sin estado')}</small></button>`).join(''):'<div class="eval-empty">No hay evaluaciones.</div>'}</div></section>
 <section class="eval-card">${selectedEval?main():emptyMain()}</section></div></div>`;
 bind();
}
function emptyMain(){return'<div class="eval-empty"><h3>Selecciona una evaluación</h3><p>Elige una evaluación para comenzar.</p></div>'}
function main(){
 const ps=evaluationParticipants();
 return `<div class="eval-toolbar"><select class="eval-select" id="partFilter"><option value="">Seleccionar participante</option>${ps.map(p=>`<option value="${p.id}" ${selectedParticipant?.id===p.id?'selected':''}>${esc(p.nombre)}${p.delegacion?' · '+esc(p.delegacion):''}</option>`).join('')}</select><span class="eval-status ${closed(selectedEval)?'closed':'open'}">${esc(selectedEval.estado||'abierta')}</span><button class="btn ${view==='results'?'primary':''}" id="resultsBtn">📊 Resultados</button><button class="btn ${view==='evaluate'?'primary':''}" id="evaluateBtn">⭐ Evaluar</button></div>${view==='results'?resultsPanel(ps):(selectedParticipant?scorePanel():participantList(ps))}`
}
function participantList(ps){return ps.length?`<div><div class="eval-toolbar"><div><h3 style="margin:0">Participantes</h3><span class="eval-muted">Selecciona una persona para evaluar.</span></div></div>${ps.map(p=>{const r=participantResult(p);return `<div class="eval-participant" data-pid="${p.id}"><div class="eval-avatar">${esc((p.nombre||'?')[0].toUpperCase())}</div><div style="flex:1"><strong>${esc(p.nombre)}</strong><small>${esc(p.delegacion||'Sin delegación')} · ${esc(p.identificador||'')}</small></div><span class="eval-status ${r.count===r.criteria&&r.criteria?'open':''}">${r.count}/${r.criteria}</span></div>`}).join('')}</div>`:'<div class="eval-empty">Esta evaluación todavía no tiene participantes.</div>'}
function scorePanel(){
 const p=selectedParticipant,a=assignmentFor(p),cs=criteriaForEval(),existing=cs.map(c=>scores.find(s=>s.asignacion_id===a?.id&&s.criterio_id===c.id));
 const total=existing.reduce((n,s)=>n+Number(s?.puntuacion||0),0),max=cs.reduce((n,c)=>n+Number(c.max_puntos||0),0),pct=max?Math.min(100,total/max*100):0;
 const note=existing.find(Boolean)?.observacion||'';
 return `<div class="eval-participant"><div class="eval-avatar">${esc((p.nombre||'?')[0].toUpperCase())}</div><div><strong>${esc(p.nombre)}</strong><small>${esc(p.delegacion||'')}</small></div><span class="eval-status ${a?'open':'closed'}">${a?'Asignado':'No asignado'}</span></div><div class="eval-total">${fmt(total)} / ${fmt(max)}</div><div class="eval-progress" aria-label="Progreso de puntuación"><span style="width:${pct}%"></span></div><p class="eval-muted">${existing.filter(Boolean).length} de ${cs.length} criterios puntuados</p><div class="eval-criteria">${cs.length?cs.map(c=>criterion(c,existing.find(x=>x?.criterio_id===c.id))).join(''):'<div class="eval-empty">No hay criterios activos.</div>'}</div><textarea class="eval-note" id="evalNote" placeholder="Retroalimentación general (opcional)" ${closed(selectedEval)?'disabled':''}>${esc(note)}</textarea><div class="eval-actions"><button class="btn" id="backEval">← Participantes</button><button class="btn primary" id="saveEval" ${closed(selectedEval)||!a?'disabled':''}>Guardar evaluación</button></div>`
}
function criterion(c,s){
 const max=Math.max(0,Number(c.max_puntos||0)),val=Number(s?.puntuacion||0),limit=Math.min(Math.floor(max),20);
 const buttons=Array.from({length:limit+1},(_,i)=>`<button type="button" data-score="${i}" data-criterion="${c.id}" class="${i===val?'selected':''}" ${closed(selectedEval)?'disabled':''}>${i}</button>`).join('');
 return `<div class="eval-criterion"><div class="eval-criterion-head"><div><strong>${esc(c.nombre)}</strong><div class="eval-muted">${esc(c.descripcion||'')}</div></div><b>${fmt(val)}/${fmt(max)}</b></div><div class="eval-score">${buttons}</div></div>`
}
function resultsPanel(ps){
 const rows=ps.map(participantResult).filter(x=>x.assigned).sort((a,b)=>b.pct-a.pct||b.total-a.total||a.p.nombre.localeCompare(b.p.nombre));
 const done=rows.filter(x=>x.count===x.criteria&&x.criteria).length,avg=rows.length?rows.reduce((n,r)=>n+r.pct,0)/rows.length:0;
 return `<div class="eval-results"><div class="eval-result-summary"><div class="eval-stat"><strong>${rows.length}</strong><span>Asignados</span></div><div class="eval-stat"><strong>${done}</strong><span>Completados</span></div><div class="eval-stat"><strong>${fmt(avg)}%</strong><span>Promedio</span></div></div><div class="eval-toolbar"><div><h3 style="margin:0">Ranking</h3><span class="eval-muted">Ordenado por porcentaje obtenido.</span></div></div>${rows.length?rows.map((r,i)=>`<div class="eval-result-row"><div><strong>#${i+1} · ${esc(r.p.nombre)}</strong><small>${esc(r.p.delegacion||'Sin delegación')} · ${r.count}/${r.criteria} criterios</small></div><strong>${fmt(r.pct)}%</strong><div><div class="eval-progress"><span style="width:${Math.min(100,r.pct)}%"></span></div><small>${fmt(r.total)} / ${fmt(r.max)} puntos</small></div></div>`).join(''):'<div class="eval-empty">No hay participantes asignados a este evaluador todavía.</div>'}</div>`
}
function bind(){
 document.querySelectorAll('[data-eid]').forEach(b=>b.onclick=()=>{selectedEval=evals.find(e=>e.id===b.dataset.eid);selectedParticipant=null;view='evaluate';render()});
 document.getElementById('evalFilter')?.addEventListener('change',e=>{const id=e.target.value;document.querySelectorAll('[data-eid]').forEach(b=>b.style.display=!id||b.dataset.eid===id?'block':'none')});
 document.querySelectorAll('[data-pid]').forEach(b=>b.onclick=()=>{selectedParticipant=participants.find(p=>p.id===b.dataset.pid);view='evaluate';render()});
 document.getElementById('partFilter')?.addEventListener('change',e=>{selectedParticipant=participants.find(p=>p.id===e.target.value)||null;view='evaluate';render()});
 document.getElementById('resultsBtn')?.addEventListener('click',()=>{selectedParticipant=null;view='results';render()});
 document.getElementById('evaluateBtn')?.addEventListener('click',()=>{view='evaluate';render()});
 document.getElementById('backEval')?.addEventListener('click',()=>{selectedParticipant=null;render()});
 document.querySelectorAll('[data-score]').forEach(b=>b.onclick=()=>{document.querySelectorAll(`[data-criterion="${b.dataset.criterion}"]`).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');b.closest('.eval-criterion').querySelector('.eval-criterion-head b').textContent=`${b.dataset.score}/${b.closest('.eval-criterion').querySelectorAll('[data-score]').length-1}`});
 document.getElementById('saveEval')?.addEventListener('click',save);
}
async function save(){
 if(!selectedEval||closed(selectedEval))return toast('Esta evaluación está cerrada.','error');
 const a=assignmentFor(selectedParticipant);if(!a)return toast('Este participante no está asignado a tu usuario como evaluador.','error');
 const rows=[...document.querySelectorAll('[data-score].selected')].map(b=>({criterio_id:b.dataset.criterion,puntuacion:Number(b.dataset.score)}));
 if(!rows.length)return toast('Selecciona al menos una puntuación.','error');
 const observation=document.getElementById('evalNote')?.value?.trim()||null;
 for(const r of rows){const old=scores.find(s=>s.asignacion_id===a.id&&s.criterio_id===r.criterio_id);const payload={puntuacion:r.puntuacion,evaluado_por:user.id,observacion:observation,updated_at:new Date().toISOString()};const q=old?await db.from('evaluacion_puntuaciones').update(payload).eq('id',old.id):await db.from('evaluacion_puntuaciones').insert({...payload,asignacion_id:a.id,criterio_id:r.criterio_id,created_at:new Date().toISOString()});if(q.error)return toast(q.error.message,'error')}
 toast('Evaluación guardada correctamente');await load();render();
}
function install(){const nav=document.querySelector('.sidebar nav');if(!nav||nav.querySelector('[data-r17-evals]'))return;const b=document.createElement('button');b.className='nav-item';b.dataset.r17Evals='1';b.innerHTML='<span>★</span>Evaluaciones';b.onclick=async e=>{e.preventDefault();try{await load();const h=document.querySelector('.topbar h1');if(h)h.textContent='Evaluaciones';render()}catch(err){console.error(err);toast('No se pudieron cargar las evaluaciones','error')}};nav.appendChild(b)}
new MutationObserver(install).observe(document.body,{childList:true,subtree:true});
window.R17Evaluations={open:async()=>{await load();install();document.querySelector('[data-r17-evals]')?.click()}};
})();