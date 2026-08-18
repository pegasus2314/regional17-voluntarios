/* Regional 17 · MUN */
(() => {
  'use strict';
  const KEY='r17_mun_state_v2';
  const state=JSON.parse(localStorage.getItem(KEY)||'{"models":[],"selectedModel":null,"selectedCommission":null}');
  const commissions=['Asamblea General','Consejo de Seguridad','ECOSOC','UNESCO','UNICEF','OMS','OIT','ONU Mujeres','ACNUR','PNUD','FAO','OIM','Consejo de Derechos Humanos','Corte Internacional de Justicia','Comisión de Desarme','Comisión de Consolidación de la Paz'];
  const districts=['17-01 · Yamasá','17-02 · Monte Plata','17-03 · Bayaguana','17-04 · Sabana Grande de Boyá','17-05 · Esperalvillo'];
  const countries=[['DO','República Dominicana','🇩🇴'],['US','Estados Unidos','🇺🇸'],['CN','China','🇨🇳'],['FR','Francia','🇫🇷'],['RU','Rusia','🇷🇺'],['GB','Reino Unido','🇬🇧'],['PS','Palestina','🇵🇸'],['MX','México','🇲🇽'],['BR','Brasil','🇧🇷'],['CO','Colombia','🇨🇴'],['ES','España','🇪🇸'],['DE','Alemania','🇩🇪']];
  const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const content=()=>document.getElementById('content');
  const toast=m=>{const x=document.createElement('div');x.className='toast success';x.textContent=m;document.body.appendChild(x);setTimeout(()=>x.remove(),2500)};
  function inject(){
    const nav=document.querySelector('.sidebar nav');
    if(!nav||nav.querySelector('[data-mun-view]')) return;
    const b=document.createElement('button');b.className='nav-item';b.dataset.munView='1';b.innerHTML='<span>🏛️</span>MUN Regional 17';
    b.onclick=()=>open();nav.appendChild(b);
  }
  function open(){
    document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));
    const b=document.querySelector('[data-mun-view]');if(b)b.classList.add('active');
    const c=content();if(!c)return;
    c.innerHTML=`<div class="mun-simple"><div class="mun-head"><div><span class="eyebrow">MODELOS DE NACIONES UNIDAS</span><h2>Modelos</h2><p>Selecciona un modelo para administrar sus comisiones y delegaciones.</p></div><button class="btn primary" id="munNew">＋ Nuevo modelo</button></div><div id="munBody"></div></div>`;
    document.getElementById('munNew').onclick=newModel; renderModels();
  }
  function newModel(){
    const name=prompt('Nombre del modelo');if(!name?.trim())return;
    const m={id:crypto.randomUUID(),name:name.trim(),date:new Date().toISOString().slice(0,10),commissions:[]};state.models.push(m);state.selectedModel=m.id;save();open();
  }
  function renderModels(){
    const body=document.getElementById('munBody');if(!body)return;
    if(!state.models.length){body.innerHTML='<div class="mun-empty">No hay modelos creados todavía.<br><small>Crea el primero con “Nuevo modelo”.</small></div>';return;}
    body.innerHTML=`<div class="mun-grid">${state.models.map(m=>`<button class="mun-card" data-model="${m.id}"><span>🏛️</span><strong>${esc(m.name)}</strong><small>${esc(m.date)} · ${m.commissions.length} comisiones</small></button>`).join('')}</div>`;
    body.querySelectorAll('[data-model]').forEach(b=>b.onclick=()=>{state.selectedModel=b.dataset.model;save();renderModel(b.dataset.model)});
  }
  function renderModel(id){
    const m=state.models.find(x=>x.id===id);if(!m)return open();
    const body=document.getElementById('munBody');
    body.innerHTML=`<div class="mun-subhead"><button class="btn" id="munBack">← Modelos</button><div><h2>${esc(m.name)}</h2><p>Comisiones y hojas independientes</p></div><button class="btn primary" id="munAddCom">＋ Comisión</button></div><div class="mun-grid" id="munComs"></div>`;
    document.getElementById('munBack').onclick=open;document.getElementById('munAddCom').onclick=()=>addCommission(m);renderCommissions(m);
  }
  function addCommission(m){
    const pick=prompt('Escribe una comisión ONU o una comisión personalizada',commissions[0]);if(!pick?.trim())return;
    m.commissions.push({id:crypto.randomUUID(),name:pick.trim(),delegations:[]});save();renderModel(m.id);toast('Comisión creada');
  }
  function renderCommissions(m){
    const el=document.getElementById('munComs');if(!el)return;
    el.innerHTML=m.commissions.map(c=>`<button class="mun-card" data-com="${c.id}"><span>▣</span><strong>${esc(c.name)}</strong><small>${c.delegations.length} delegaciones</small></button>`).join('')||'<div class="mun-empty">Este modelo todavía no tiene comisiones.</div>';
    el.querySelectorAll('[data-com]').forEach(b=>b.onclick=()=>renderCommission(m,b.dataset.com));
  }
  function renderCommission(m,id){
    const c=m.commissions.find(x=>x.id===id);if(!c)return;
    const body=document.getElementById('munBody');
    body.innerHTML=`<div class="mun-subhead"><button class="btn" id="munBack">← ${esc(m.name)}</button><div><h2>${esc(c.name)}</h2><p>Delegaciones · asistencia · evaluación</p></div><button class="btn primary" id="munAddDel">＋ Delegación</button></div><div class="mun-table"><table><thead><tr><th>Delegación</th><th>Delegado</th><th>Distrito</th><th>Asistencia</th><th>Resultado</th><th>Evaluación</th></tr></thead><tbody>${c.delegations.map((d,i)=>`<tr><td><span class="mun-flag">${d.flag}</span><strong>${esc(d.country)}</strong></td><td>${esc(d.name||'—')}<small>${esc(d.email||'')} ${esc(d.phone||'')}</small></td><td>${esc(d.district||'—')}</td><td><select data-att="${i}"><option ${d.attendance?'selected':''}>Presente</option><option ${!d.attendance?'selected':''}>Ausente</option></select></td><td><select data-pass="${i}"><option value="pendiente" ${d.result==='pendiente'?'selected':''}>Pendiente</option><option value="paso" ${d.result==='paso'?'selected':''}>PASÓ</option><option value="no" ${d.result==='no'?'selected':''}>NO PASÓ</option></select></td><td><button class="btn primary btn-sm" data-eval="${i}">📝 Evaluar</button></td></tr>`).join('')||'<tr><td colspan="6" class="mun-empty">Agrega la primera delegación.</td></tr>'}</tbody></table></div>`;
    document.getElementById('munBack').onclick=()=>renderModel(m.id);document.getElementById('munAddDel').onclick=()=>addDelegation(m,c);
    body.querySelectorAll('[data-att]').forEach(x=>x.onchange=()=>{c.delegations[x.dataset.att].attendance=x.value==='Presente';save()});body.querySelectorAll('[data-pass]').forEach(x=>x.onchange=()=>{c.delegations[x.dataset.pass].result=x.value;save()});body.querySelectorAll('[data-eval]').forEach(x=>x.onclick=()=>renderEvaluation(m,c,Number(x.dataset.eval)));
  }
  function addDelegation(m,c){editDelegation(m,c,-1)}
  function editDelegation(m,c,i){
    const d=i>=0?c.delegations[i]:{country:'',name:'',email:'',phone:'',district:districts[0],attendance:false,result:'pendiente',code:''};
    const pick=prompt('País (ej. DO, CN, US, FR)',d.code||'DO');if(pick===null)return;const code=pick.trim().toUpperCase();const found=countries.find(x=>x[0]===code)||countries.find(x=>x[1].toLowerCase()===code.toLowerCase());
    const name=prompt('Nombre del participante',d.name||'');if(name===null)return;const email=prompt('Correo',d.email||'');if(email===null)return;const phone=prompt('Teléfono',d.phone||'');if(phone===null)return;const district=prompt('Distrito',d.district||districts[0]);if(district===null)return;
    const item={...d,code:found?.[0]||code,country:found?.[1]||code,flag:found?.[2]||'🌎',name:name.trim(),email:email.trim(),phone:phone.trim(),district:district.trim()||districts[0]};if(i<0)c.delegations.push(item);else c.delegations[i]=item;save();renderCommission(m,c.id);toast('Ficha guardada');
  }
  function renderEvaluation(m,c,i){
    const d=c.delegations[i];if(!d)return;
    if(!d.evaluation)d.evaluation={argumentacion:0,posicion:0,diplomacia:0,participacion:0,intervenciones:0,dominio:0,procedimiento:0,trabajo:0,observaciones:''};
    const e=d.evaluation;
    const body=document.getElementById('munBody');
    body.innerHTML=`<div class="eval-sheet"><div class="mun-subhead"><button class="btn" id="evalBack">← ${esc(c.name)}</button><div><span class="eyebrow">HOJA DE EVALUACIÓN</span><h2>${esc(d.name||'Delegado')}</h2><p>${d.flag} <strong>${esc(d.country)}</strong> · ${esc(c.name)}</p></div><div class="eval-total"><span>TOTAL</span><strong id="evalTotal">${total(e)}/100</strong></div></div><section class="eval-card"><h3>Evaluación General</h3><div class="eval-grid">${field('Argumentación','argumentacion',30,e.argumentacion)}${field('Política exterior / Posición','posicion',30,e.posicion)}${field('Diplomacia','diplomacia',20,e.diplomacia)}${field('Participación','participacion',20,e.participacion)}</div></section><section class="eval-card"><h3>Otros criterios</h3><div class="eval-grid">${field('Calidad de intervenciones','intervenciones',10,e.intervenciones)}${field('Dominio del tema','dominio',10,e.dominio)}${field('Procedimiento','procedimiento',10,e.procedimiento)}${field('Trabajo en equipo','trabajo',10,e.trabajo)}</div></section><section class="eval-card"><h3>Asistencia y resultado</h3><div class="eval-status"><label>Asistencia<select id="evalAttendance"><option value="true" ${d.attendance?'selected':''}>Presente</option><option value="false" ${!d.attendance?'selected':''}>Ausente</option></select></label><label>Resultado<select id="evalResult"><option value="pendiente" ${d.result==='pendiente'?'selected':''}>Pendiente</option><option value="paso" ${d.result==='paso'?'selected':''}>PASÓ</option><option value="no" ${d.result==='no'?'selected':''}>NO PASÓ</option></select></label></div></section><section class="eval-card"><h3>Observaciones</h3><textarea id="evalObs" rows="5" placeholder="Escribe aquí las observaciones del evaluador...">${esc(e.observaciones)}</textarea></section><div class="eval-actions"><button class="btn" id="evalCancel">Cancelar</button><button class="btn primary" id="evalSave">💾 Guardar evaluación</button></div></div>`;
    document.getElementById('evalBack').onclick=()=>renderCommission(m,c.id);document.getElementById('evalCancel').onclick=()=>renderCommission(m,c.id);
    body.querySelectorAll('[data-score]').forEach(x=>x.oninput=()=>{e[x.dataset.score]=Math.max(0,Math.min(Number(x.dataset.max),Number(x.value)||0));document.getElementById('evalTotal').textContent=total(e)+'/100'});
    document.getElementById('evalAttendance').onchange=x=>d.attendance=x.target.value==='true';document.getElementById('evalResult').onchange=x=>d.result=x.target.value;document.getElementById('evalObs').oninput=x=>e.observaciones=x.target.value;
    document.getElementById('evalSave').onclick=()=>{save();toast('Evaluación guardada');renderCommission(m,c.id)};
  }
  function field(label,key,max,value){return `<label class="score-field"><span>${label}<b>0–${max}</b></span><input type="number" min="0" max="${max}" value="${Number(value)||0}" data-score="${key}" data-max="${max}"></label>`}
  function total(e){return Math.min(100,(+e.argumentacion||0)+(+e.posicion||0)+(+e.diplomacia||0)+(+e.participacion||0))}
  const css=`<style id="mun-simple-css">.mun-simple{padding:4px}.mun-head,.mun-subhead{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:24px}.mun-head h2,.mun-subhead h2{margin:5px 0}.mun-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}.mun-card{text-align:left;padding:20px;border:1px solid var(--border,#dfe5ec);border-radius:16px;background:var(--card,#fff);cursor:pointer;display:flex;flex-direction:column;gap:8px}.mun-card span{font-size:28px}.mun-card strong{font-size:16px}.mun-card small,.mun-table small{display:block;opacity:.65}.mun-empty{padding:40px;text-align:center;border:1px dashed var(--border,#ccd5df);border-radius:16px}.mun-table{overflow:auto;background:var(--card,#fff);border-radius:16px;border:1px solid var(--border,#dfe5ec)}.mun-table table{width:100%;border-collapse:collapse}.mun-table th,.mun-table td{padding:13px;border-bottom:1px solid var(--border,#e5e9ef);text-align:left}.mun-flag{font-size:30px;vertical-align:middle;margin-right:8px}.mun-subhead>div{flex:1}.eval-sheet{max-width:1000px;margin:auto}.eval-total{padding:12px 20px;border-radius:16px;background:var(--card,#fff);border:1px solid var(--border,#dfe5ec);text-align:center}.eval-total span{display:block;font-size:11px;opacity:.65}.eval-total strong{font-size:28px}.eval-card{background:var(--card,#fff);border:1px solid var(--border,#dfe5ec);border-radius:18px;padding:20px;margin:16px 0}.eval-card h3{margin:0 0 16px}.eval-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.score-field span{display:flex;justify-content:space-between;margin-bottom:6px;font-weight:600}.score-field b{opacity:.55;font-size:12px}.score-field input,.eval-status select,.eval-card textarea{width:100%;box-sizing:border-box;padding:11px;border:1px solid var(--border,#dfe5ec);border-radius:10px;background:transparent;color:inherit}.eval-status{display:grid;grid-template-columns:1fr 1fr;gap:14px}.eval-status label{font-weight:600}.eval-status select{display:block;margin-top:7px}.eval-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:18px}.btn-sm{padding:7px 10px!important;font-size:12px!important}@media(max-width:700px){.mun-head,.mun-subhead{align-items:flex-start;flex-direction:column}.mun-head .btn,.mun-subhead .btn{width:100%}.eval-grid,.eval-status{grid-template-columns:1fr}.eval-total{width:100%;box-sizing:border-box}}
</style>`;
  function boot(){if(!document.getElementById('mun-simple-css'))document.head.insertAdjacentHTML('beforeend',css);inject();}
  new MutationObserver(boot).observe(document.body,{childList:true,subtree:true});boot();
})();