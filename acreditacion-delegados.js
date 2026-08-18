// ============================================================
// PANEL INDEPENDIENTE DE ACREDITACIÓN DE DELEGADOS
// ============================================================
(function(){
  'use strict';
  const KEY='regional17_acreditacion_delegados';
  const DISTRICTS=['17-01 · Yamasá','17-02 · Monte Plata','17-03 · Bayaguana','17-04 · Sabana Grande de Boyá','17-05 · Esperalvillo'];
  const getData=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
  const saveData=v=>localStorage.setItem(KEY,JSON.stringify(v));
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function addNavButton(){
    const nav=document.querySelector('.sidebar nav');
    if(!nav || nav.querySelector('[data-acreditacion]')) return;
    const b=document.createElement('button');
    b.className='nav-item';
    b.dataset.acreditacion='1';
    b.innerHTML='<span>🪪</span>Acreditación';
    b.onclick=openPanel;
    nav.appendChild(b);
  }

  function openPanel(){
    document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));
    const b=document.querySelector('[data-acreditacion]'); if(b)b.classList.add('active');
    const root=document.getElementById('content')||document.getElementById('rv-view')||document.getElementById('app');
    if(!root)return;
    root.innerHTML=`<section class="card" style="padding:24px;max-width:1200px;margin:auto">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap">
        <div><div style="font-size:12px;opacity:.6;font-weight:700">MUN REGIONAL 17</div><h2 style="margin:4px 0">🪪 Acreditación de Delegados</h2><p style="margin:6px 0;opacity:.7">Registro independiente de participantes.</p></div>
        <button class="btn primary" id="ac-new">＋ Nuevo delegado</button>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin:18px 0">
        <input id="ac-search" class="input" placeholder="Buscar nombre, cédula, país, comisión o centro..." style="flex:1;min-width:240px">
        <select id="ac-district" class="input"><option value="">Todos los distritos</option>${DISTRICTS.map(d=>`<option value="${esc(d)}">${esc(d)}</option>`).join('')}</select>
        <select id="ac-status" class="input"><option value="">Todos los estados</option><option>Acreditado</option><option>Pendiente</option><option>Observado</option></select>
      </div>
      <div id="ac-list"></div><div id="ac-form"></div>
    </section>`;
    renderList();
    document.getElementById('ac-new').onclick=()=>showForm({});
    document.getElementById('ac-search').oninput=renderList;
    document.getElementById('ac-district').onchange=renderList;
    document.getElementById('ac-status').onchange=renderList;

    function renderList(){
      const q=(document.getElementById('ac-search').value||'').toLowerCase();
      const d=document.getElementById('ac-district').value, s=document.getElementById('ac-status').value;
      const rows=getData().filter(x=>(!q||[x.nombre,x.cedula,x.pais,x.comision,x.centro,x.modelo].join(' ').toLowerCase().includes(q))&&(!d||x.distrito===d)&&(!s||x.estado===s));
      document.getElementById('ac-list').innerHTML=rows.length?`<div style="display:grid;gap:10px">${rows.map(x=>`<div class="card" style="padding:14px;display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap"><div><strong>${esc(x.nombre)}</strong><div style="opacity:.7">${esc(x.pais||'Sin país')} · ${esc(x.comision||'Sin comisión')} · ${esc(x.distrito||'Sin distrito')}</div><small style="opacity:.6">${esc(x.centro||'Sin centro')} · ${esc(x.modelo||'Sin modelo')}</small></div><div><span>${x.estado==='Acreditado'?'🟢':x.estado==='Observado'?'🔴':'🟡'} ${esc(x.estado||'Pendiente')}</span> <button class="btn" data-edit="${esc(x.id)}">Ver ficha</button></div></div>`).join('')}</div>`:`<div style="padding:30px;text-align:center;opacity:.65">No hay delegados registrados.</div>`;
      document.querySelectorAll('[data-edit]').forEach(btn=>btn.onclick=()=>showForm(getData().find(x=>x.id===btn.dataset.edit)||{}));
    }

    function showForm(x){
      const f=document.getElementById('ac-form');
      f.innerHTML=`<div class="card" style="margin-top:20px;padding:20px"><h3 style="margin-top:0">${x.id?'Editar delegado':'Nuevo delegado'}</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">
      ${field('Nombre completo','nombre',x.nombre,'text','required')}${field('Edad','edad',x.edad,'number')}${field('Centro educativo','centro',x.centro)}${field('Número de teléfono','telefono',x.telefono,'tel')}${field('Correo electrónico','correo',x.correo,'email')}${field('Cédula','cedula',x.cedula)}${field('Teléfono de familiar','familiar',x.familiar,'tel')}${field('País / Delegación','pais',x.pais)}${field('Comisión','comision',x.comision)}<label>Distrito<select id="f-distrito" class="input"><option value="">Seleccionar</option>${DISTRICTS.map(d=>`<option value="${esc(d)}" ${x.distrito===d?'selected':''}>${esc(d)}</option>`).join('')}</select></label>${field('Modelo','modelo',x.modelo)}<label>Estado<select id="f-estado" class="input"><option ${x.estado==='Pendiente'||!x.estado?'selected':''}>Pendiente</option><option ${x.estado==='Acreditado'?'selected':''}>Acreditado</option><option ${x.estado==='Observado'?'selected':''}>Observado</option></select></label></div>
      <div style="display:flex;gap:10px;margin-top:18px"><button class="btn primary" id="f-save">💾 Guardar acreditación</button><button class="btn" id="f-cancel">Cancelar</button></div></div>`;
      document.getElementById('f-save').onclick=()=>{
        const g=id=>document.getElementById(id)?.value.trim()||'';
        const obj={id:x.id||crypto.randomUUID(),nombre:g('f-nombre'),edad:g('f-edad'),centro:g('f-centro'),telefono:g('f-telefono'),correo:g('f-correo'),cedula:g('f-cedula'),familiar:g('f-familiar'),pais:g('f-pais'),comision:g('f-comision'),distrito:g('f-distrito'),modelo:g('f-modelo'),estado:g('f-estado')||'Pendiente'};
        if(!obj.nombre){alert('Escribe el nombre completo.');return}
        const all=getData(),i=all.findIndex(v=>v.id===obj.id); if(i>=0)all[i]=obj;else all.push(obj); saveData(all); f.innerHTML=''; renderList();
      };
      document.getElementById('f-cancel').onclick=()=>f.innerHTML='';
    }
    function field(label,key,value,type='text',req=''){return `<label>${label}<input id="f-${key}" class="input" type="${type}" value="${esc(value||'')}" ${req}></label>`}
  }

  window.openAcreditacionDelegados=openPanel;
  window.renderAcreditacionDelegados=openPanel;
  function boot(){addNavButton();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  setTimeout(addNavButton,1000); setTimeout(addNavButton,2500);
})();