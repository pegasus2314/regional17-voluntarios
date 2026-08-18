/* Regional 17 · MUN · New model modal */
(() => {
  'use strict';
  const KEY='r17_mun_state_v2';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const style=`<style id="mun-new-model-modal-css">
  .r17-mnm-backdrop{position:fixed;inset:0;z-index:9999;background:rgba(4,18,35,.58);backdrop-filter:blur(7px);display:flex;align-items:center;justify-content:center;padding:20px;animation:r17MnmFade .18s ease}
  .r17-mnm-modal{width:min(620px,100%);max-height:min(760px,calc(100vh - 40px));overflow:auto;background:#fff;color:#10233d;border:1px solid rgba(255,255,255,.5);border-radius:24px;box-shadow:0 28px 80px rgba(0,0,0,.25);animation:r17MnmUp .22s ease}
  .r17-mnm-top{padding:25px 28px 20px;background:linear-gradient(135deg,#071b35,#123e70);color:#fff;position:relative}
  .r17-mnm-top:after{content:'';position:absolute;width:150px;height:150px;border-radius:50%;right:-50px;top:-80px;background:rgba(243,179,67,.16)}
  .r17-mnm-icon{width:48px;height:48px;border-radius:15px;display:grid;place-items:center;background:rgba(255,255,255,.13);font-size:24px;margin-bottom:14px}
  .r17-mnm-top h2{margin:0 0 6px;font-size:24px;letter-spacing:-.4px}.r17-mnm-top p{margin:0;opacity:.78;font-size:13px}
  .r17-mnm-body{padding:24px 28px}.r17-mnm-section{font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#63748a;margin:0 0 12px}
  .r17-mnm-field{margin-bottom:18px}.r17-mnm-field label{display:flex;justify-content:space-between;gap:12px;font-weight:700;font-size:13px;margin-bottom:7px}.r17-mnm-help{font-size:11px;color:#718096;margin-top:6px;line-height:1.45}
  .r17-mnm-input,.r17-mnm-select{width:100%;box-sizing:border-box;padding:13px 14px;border:1px solid #d8e0ea;border-radius:12px;background:#f8fafc;color:#10233d;font:inherit;outline:none;transition:.16s}
  .r17-mnm-input:focus,.r17-mnm-select:focus{border-color:#2b6cb0;box-shadow:0 0 0 4px rgba(43,108,176,.12);background:#fff}
  .r17-mnm-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.r17-mnm-footer{display:flex;justify-content:flex-end;gap:10px;padding:18px 28px;border-top:1px solid #e7ecf2;background:#fbfcfe}
  .r17-mnm-btn{border:0;border-radius:11px;padding:11px 17px;font:700 13px inherit;cursor:pointer}.r17-mnm-cancel{background:#eef2f6;color:#334155}.r17-mnm-save{background:#0d315d;color:#fff;box-shadow:0 7px 18px rgba(13,49,93,.2)}.r17-mnm-save:hover{transform:translateY(-1px)}
  .r17-mnm-error{display:none;margin:0 0 14px;padding:10px 12px;border-radius:10px;background:#fff1f2;color:#b42318;font-size:12px;font-weight:600}
  @keyframes r17MnmFade{from{opacity:0}to{opacity:1}}@keyframes r17MnmUp{from{opacity:0;transform:translateY(12px) scale(.985)}to{opacity:1;transform:none}}
  @media(max-width:600px){.r17-mnm-backdrop{padding:10px}.r17-mnm-modal{border-radius:19px}.r17-mnm-top,.r17-mnm-body{padding-left:20px;padding-right:20px}.r17-mnm-footer{padding:15px 20px}.r17-mnm-grid{grid-template-columns:1fr}.r17-mnm-footer .r17-mnm-btn{flex:1}}
  </style>`;
  function addStyle(){if(!document.getElementById('mun-new-model-modal-css'))document.head.insertAdjacentHTML('beforeend',style)}
  function close(){document.getElementById('r17Mnm')?.remove();document.body.style.overflow=''}
  function open(){
    addStyle();close();
    const today=new Date().toISOString().slice(0,10);
    const box=document.createElement('div');box.id='r17Mnm';box.className='r17-mnm-backdrop';box.innerHTML=`<div class="r17-mnm-modal" role="dialog" aria-modal="true" aria-labelledby="r17MnmTitle">
      <div class="r17-mnm-top"><div class="r17-mnm-icon">🏛️</div><h2 id="r17MnmTitle">Crear nuevo modelo</h2><p>Configura la información inicial del Modelo de Naciones Unidas.</p></div>
      <form id="r17MnmForm"><div class="r17-mnm-body"><p class="r17-mnm-section">Información del modelo</p><div id="r17MnmError" class="r17-mnm-error"></div>
      <div class="r17-mnm-field"><label for="r17MnmName">Nombre del modelo <span>Obligatorio</span></label><input id="r17MnmName" class="r17-mnm-input" autocomplete="off" placeholder="Ej. MINU Regional 17 · XVIII Edición" required><div class="r17-mnm-help">Utiliza el nombre oficial con el que se identificará este modelo.</div></div>
      <div class="r17-mnm-grid"><div class="r17-mnm-field"><label for="r17MnmDate">Fecha de inicio</label><input id="r17MnmDate" class="r17-mnm-input" type="date" value="${today}"><div class="r17-mnm-help">Puedes modificarla después si es necesario.</div></div><div class="r17-mnm-field"><label for="r17MnmStatus">Estado</label><select id="r17MnmStatus" class="r17-mnm-select"><option value="planificacion">Planificación</option><option value="activo">Activo</option><option value="finalizado">Finalizado</option></select><div class="r17-mnm-help">Define la etapa actual del modelo.</div></div></div></div>
      <div class="r17-mnm-footer"><button type="button" class="r17-mnm-btn r17-mnm-cancel" id="r17MnmCancel">Cancelar</button><button type="submit" class="r17-mnm-btn r17-mnm-save">＋ Crear modelo</button></div></form></div>`;
    document.body.appendChild(box);document.body.style.overflow='hidden';
    const form=box.querySelector('#r17MnmForm'),name=box.querySelector('#r17MnmName');setTimeout(()=>name.focus(),50);
    box.querySelector('#r17MnmCancel').onclick=close;box.addEventListener('click',e=>{if(e.target===box)close()});
    form.onsubmit=e=>{e.preventDefault();const n=name.value.trim();if(!n){const er=box.querySelector('#r17MnmError');er.textContent='Escribe el nombre del modelo para continuar.';er.style.display='block';name.focus();return}
      let state;try{state=JSON.parse(localStorage.getItem(KEY)||'{"models":[],"selectedModel":null,"selectedCommission":null}')}catch{state={models:[],selectedModel:null,selectedCommission:null}}
      const m={id:crypto.randomUUID(),name:n,date:box.querySelector('#r17MnmDate').value||today,commissions:[],status:box.querySelector('#r17MnmStatus').value};state.models=Array.isArray(state.models)?state.models:[];state.models.push(m);state.selectedModel=m.id;localStorage.setItem(KEY,JSON.stringify(state));close();
      const munOpen=document.querySelector('[data-mun-view]');if(munOpen)munOpen.click();
      setTimeout(()=>{const t=document.createElement('div');t.className='toast success';t.textContent='Modelo creado correctamente';document.body.appendChild(t);setTimeout(()=>t.remove(),2500)},80);
    };
  }
  document.addEventListener('click',e=>{const btn=e.target.closest?.('#munNew');if(!btn)return;e.preventDefault();e.stopImmediatePropagation();open()},true);
})();
