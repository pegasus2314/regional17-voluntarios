// ============================================================
// PANEL INDEPENDIENTE DE ACREDITACIÓN DE DELEGADOS
// ============================================================
(function(){
  'use strict';
  const KEY='regional17_acreditacion_delegados';
  const DISTRICTS=['17-01 Yamasá','17-02 Monte Plata','17-03 Bayaguana','17-04 Sabana Grande de Boyá','17-05 Esperalvillo'];
  function getData(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}}
  function saveData(v){localStorage.setItem(KEY,JSON.stringify(v))}
  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function openPanel(){
    const root=document.getElementById('rv-view')||document.getElementById('app');
    if(!root)return;
    const data=getData();
    root.innerHTML=`<section class="card" style="padding:24px;max-width:1200px;margin:auto">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap">
        <div><h2 style="margin:0">🪪 Acreditación de Delegados</h2><p style="margin:6px 0 0;opacity:.7">Panel independiente de registro y acreditación.</p></div>
        <button class="btn primary" id="ac-new">＋ Nuevo delegado</button>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin:18px 0">
        <input id="ac-search" class="input" placeholder="Buscar nombre, cédula, país o comisión..." style="flex:1;min-width:240px">
        <select id="ac-district" class="input"><option value="">Todos los distritos</option>${DISTRICTS.map(d=>`<option>${esc(d)}</option>`).join('')}</select>
        <select id="ac-status" class="input"><option value="">Todos los estados</option><option>Acreditado</option><option>Pendiente</option><option>Observado</option></select>
      </div>
      <div id="ac-list"></div>
      <div id="ac-form"></div>
    </section>`;
    renderList(data);
    document.getElementById('ac-new').onclick=()=>showForm({});
    document.getElementById('ac-search').oninput=renderList;
    document.getElementById('ac-district').onchange=renderList;
    document.getElementById('ac-status').onchange=renderList;
    function renderList(){
      const q=(document.getElementById('ac-search').value||'').toLowerCase();
      const d=document.getElementById('ac-district').value, s=document.getElementById('ac-status').value;
      const rows=getData().filter(x=>(!q||[x.nombre,x.cedula,x.pais,x.comision,x.centro].join(' ').toLowerCase().includes(q))&&(!d||x.distrito===d)&&(!s||x.estado===s));
      document.getElementById('ac-list').innerHTML=rows.length?`<div style="display:grid;gap:10px">${rows.map(x=>`<div class="card" style="padding:14px;display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap"><div><strong>${esc(x.nombre)}</strong><div style="opacity:.7">${esc(x.pais||'Sin país')} · ${esc(x.comision||'Sin comisión')} · ${esc(x.distrito||'Sin distrito')}</div></div><div><span>${x.estado==='Acreditado'?'🟢':x.estado==='Observado'?'🔴':'🟡'} ${esc(x.estado||'Pendiente')}</span> <button class="btn" data-edit="${esc(x.id)}">Ver ficha</button></div></div>`).join('')}</div>`:`<div style="padding:30px;text-align:center;opacity:.65">No hay delegados registrados.</div>`;
      document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>showForm(getData().find(x=>x.id===b.dataset.edit)||{}));
    }
    function showForm(x){
      const f=document.getElementById('ac-form');
      f.innerHTML=`<div class="card" style="margin-top:20px;padding:20px"><h3>${x.id?'Editar delegado':'Nuevo delegado'}</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">
      ${field('Nombre completo','nombre',x.nombre,'text','required')}${field('Edad','edad',x.edad,'number')}${field('Centro educativo','centro',x.centro)}${field('Número de teléfono','telefono',x.telefono,'tel')}${field('Correo electrónico','correo',x.correo,'email')}${field('Cédula','cedula',x.cedula)}${field('Teléfono de familiar','familiar',x.familiar,'tel')}${field('País / Delegación','pais',x.pais)}${field('Comisión','comision',x.comision)}<label>Distrito<select id="f-distrito" class="input"><option value="">Seleccionar</option>${DISTRICTS.map(d=>`<option ${x.distrito===d?'selected':''}>${esc(d)}</option>`).join('')}</select></label><label>Modelo<input id="f-modelo" class="input" value="${esc(x.modelo||'')}"></label><label>Estado<select id="f-estado" class="input"><option ${x.estado==='Pendiente'||!x.estado?'selected':''}>Pendiente</option><option ${x.estado==='Acreditado'?'selected':''}>Acreditado</option><option ${x.estado==='Observado'?'selected':''}>Observado</option></select></label></div>
      <div style="display:flex;gap:10px;margin-top:18px"><button class="btn primary" id="f-save">💾 Guardar acreditación</button><button class="btn" id="f-cancel">Cancelar</button></div></div>`;
      document.getElementById('f-save').onclick=()=>{const g=id=>document.getElementById(id)?.value.trim()||'';const obj={id:x.id||crypto.randomUUID(),nombre:g('f-nombre'),edad:g('f-edad'),centro:g('f-centro'),telefono:g('f-telefono'),correo:g('f-correo'),cedula:g('f-cedula'),familiar:g('f-familiar'),pais:g('f-pais'),comision:g('f-comision'),distrito:g('f-distrito'),modelo:g('f-modelo'),estado:g('f-estado')||'Pendiente'};if(!obj.nombre){alert('Escribe el nombre completo.');return}const all=getData();const i=all.findIndex(v=>v.id===obj.id);i>=0?all[i]=obj:all.push(obj);saveData(all);f.innerHTML='';renderList()};
      document.getElementById('f-cancel').onclick=()=>f.innerHTML='';
    }
    function field(label,key,value,type='text',req=''){return `<label>${label}<input id="f-${key}" class="input" type="${type}" value="${esc(value||'')}" ${req}></label>`}
  }
  window.openAcreditacionDelegados=openPanel;
  window.renderAcreditacionDelegados=openPanel;
})();