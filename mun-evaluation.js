/* Hoja de evaluación MUN Regional 17 */
(() => {
  'use strict';
  const KEY='r17_mun_state_v1';
  const getState=()=>JSON.parse(localStorage.getItem(KEY)||'{"models":[]}');
  const save=s=>localStorage.setItem(KEY,JSON.stringify(s));
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const content=()=>document.getElementById('content');
  function commissionFromPage(s){
    const model=s.models.find(m=>m.id===s.selectedModel);
    if(!model)return null;
    const heading=content()?.querySelector('.mun-subhead h2')?.textContent?.trim();
    return model.commissions.find(c=>c.name===heading)||model.commissions[0]||null;
  }
  function addButtons(){
    document.querySelectorAll('[data-edit]').forEach(btn=>{
      if(btn.parentElement.querySelector('[data-eval]'))return;
      const e=document.createElement('button');e.className='icon-action';e.dataset.eval=btn.dataset.edit;e.textContent='Evaluar';btn.parentElement.appendChild(e);
    });
  }
  function openEvaluation(index){
    const s=getState();const model=s.models.find(m=>m.id===s.selectedModel);const c=commissionFromPage(s);if(!model||!c)return;
    const d=c.delegations[Number(index)];if(!d)return;
    d.evaluation=d.evaluation||{debate:0,position:0,procedure:0,participation:0,observations:''};
    const ev=d.evaluation;
    const total=()=>Number(ev.debate||0)+Number(ev.position||0)+Number(ev.procedure||0)+Number(ev.participation||0);
    content().innerHTML=`<div class="mun-simple mun-evaluation"><div class="mun-subhead"><button class="btn" id="evalBack">← ${esc(c.name)}</button><div><span class="eyebrow">HOJA DE EVALUACIÓN</span><h2><span class="mun-flag">${esc(d.flag||'🌎')}</span> ${esc(d.country)}</h2><p>${esc(d.name||'Sin participante')} · ${esc(model.name)}</p></div></div><div class="eval-card"><div class="eval-att"><strong>Asistencia</strong><label><input id="evalAttendance" type="checkbox" ${d.attendance?'checked':''}> Presente</label><span>${d.attendance?'Asistió':'Pendiente'}</span></div><div class="eval-grid"><label>Debate / Argumentación <b>0–30</b><input id="ev1" type="number" min="0" max="30" value="${ev.debate}"></label><label>Posición / Política <b>0–30</b><input id="ev2" type="number" min="0" max="30" value="${ev.position}"></label><label>Procedimiento / Diplomacia <b>0–20</b><input id="ev3" type="number" min="0" max="20" value="${ev.procedure}"></label><label>Participación <b>0–20</b><input id="ev4" type="number" min="0" max="20" value="${ev.participation}"></label></div><div class="eval-total"><span>Total</span><strong id="evTotal">${total()}/100</strong></div><label class="eval-notes">Observaciones<textarea id="evNotes" rows="4" placeholder="Escribe observaciones...">${esc(ev.observations)}</textarea></label><div class="eval-actions"><button class="btn" id="evalPass">Marcar PASÓ</button><button class="btn danger" id="evalNo">Marcar NO PASÓ</button><button class="btn primary" id="evalSave">Guardar evaluación</button></div></div></div>`;
    const vals=[['ev1','debate',30],['ev2','position',30],['ev3','procedure',20],['ev4','participation',20]];
    const update=()=>{vals.forEach(([id,key,max])=>{ev[key]=Math.max(0,Math.min(max,Number(document.getElementById(id).value||0)));});document.getElementById('evTotal').textContent=`${total()}/100`;};
    vals.forEach(([id])=>document.getElementById(id).addEventListener('input',update));
    document.getElementById('evalAttendance').onchange=e=>{d.attendance=e.target.checked;save(s);};
    document.getElementById('evalBack').onclick=()=>{content().querySelector('#evalBack').closest('.mun-simple');location.reload();};
    const persist=result=>{update();ev.observations=document.getElementById('evNotes').value.trim();d.result=result||d.result||'pendiente';save(s);alert('Evaluación guardada');};
    document.getElementById('evalSave').onclick=()=>persist();
    document.getElementById('evalPass').onclick=()=>persist('paso');
    document.getElementById('evalNo').onclick=()=>persist('no');
  }
  document.addEventListener('click',e=>{const b=e.target.closest('[data-eval]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();openEvaluation(b.dataset.eval);},true);
  new MutationObserver(addButtons).observe(document.body,{childList:true,subtree:true});
  addButtons();
  const style=document.createElement('style');style.textContent=`.eval-card{max-width:900px;background:var(--card,#fff);border:1px solid var(--border,#dfe5ec);border-radius:18px;padding:24px}.eval-att{display:flex;align-items:center;gap:18px;padding:14px 16px;border-radius:12px;background:var(--surface,#f6f8fb);margin-bottom:22px}.eval-att span{opacity:.7}.eval-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.eval-grid label,.eval-notes{display:flex;flex-direction:column;gap:8px;font-weight:600}.eval-grid b{font-size:12px;opacity:.6;font-weight:500}.eval-grid input,.eval-notes textarea{padding:12px;border:1px solid var(--border,#dfe5ec);border-radius:10px;background:transparent;color:inherit;font:inherit}.eval-total{display:flex;justify-content:space-between;align-items:center;margin:22px 0;padding:18px;border-radius:14px;border:1px solid var(--border,#dfe5ec)}.eval-total strong{font-size:28px}.eval-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:18px}.eval-notes{margin-top:18px}.eval-notes textarea{resize:vertical}.mun-evaluation .mun-flag{font-size:34px}@media(max-width:700px){.eval-grid{grid-template-columns:1fr}.eval-actions{flex-direction:column}.eval-actions .btn{width:100%}}`;document.head.appendChild(style);
})();
