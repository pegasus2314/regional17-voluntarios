/* Regional 17 · MUN · Delegate registration panel */
(() => {
  'use strict';
  const KEY = 'r17_mun_state_v2';
  const COUNTRIES = [
    ['DO','República Dominicana','🇩🇴'],['US','Estados Unidos','🇺🇸'],['CN','China','🇨🇳'],['FR','Francia','🇫🇷'],['RU','Rusia','🇷🇺'],['GB','Reino Unido','🇬🇧'],['PS','Palestina','🇵🇸'],['MX','México','🇲🇽'],['BR','Brasil','🇧🇷'],['CO','Colombia','🇨🇴'],['ES','España','🇪🇸'],['DE','Alemania','🇩🇪'],['AR','Argentina','🇦🇷'],['CL','Chile','🇨🇱'],['PE','Perú','🇵🇪'],['UY','Uruguay','🇺🇾'],['EC','Ecuador','🇪🇨'],['BO','Bolivia','🇧🇴'],['CR','Costa Rica','🇨🇷'],['PA','Panamá','🇵🇦'],['GT','Guatemala','🇬🇹'],['HN','Honduras','🇭🇳'],['SV','El Salvador','🇸🇻'],['NI','Nicaragua','🇳🇮'],['CA','Canadá','🇨🇦'],['JP','Japón','🇯🇵'],['KR','Corea del Sur','🇰🇷'],['IN','India','🇮🇳'],['IT','Italia','🇮🇹'],['PT','Portugal','🇵🇹'],['NL','Países Bajos','🇳🇱'],['SE','Suecia','🇸🇪'],['NO','Noruega','🇳🇴'],['CH','Suiza','🇨🇭'],['ZA','Sudáfrica','🇿🇦'],['EG','Egipto','🇪🇬'],['NG','Nigeria','🇳🇬'],['KE','Kenia','🇰🇪'],['AU','Australia','🇦🇺']
  ];
  const DISTRICTS = ['17-01 · Yamasá','17-02 · Monte Plata','17-03 · Bayaguana','17-04 · Sabana Grande de Boyá','17-05 · Esperalvillo'];
  const read = () => JSON.parse(localStorage.getItem(KEY) || '{"models":[],"selectedModel":null,"selectedCommission":null}');
  const write = s => localStorage.setItem(KEY, JSON.stringify(s));
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function styles(){
    if(document.getElementById('r17-delegate-panel-css')) return;
    const s=document.createElement('style');
    s.id='r17-delegate-panel-css';
    s.textContent=`
      #r17DelegatePanel{position:fixed;inset:0;z-index:100002;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(2,9,20,.68);backdrop-filter:blur(12px);animation:r17dpFade .18s ease}
      #r17DelegatePanel .dp-card{width:min(820px,100%);max-height:94vh;overflow:auto;border:1px solid rgba(255,255,255,.12);border-radius:26px;background:linear-gradient(145deg,#10233e,#071426);color:#f6fbff;box-shadow:0 30px 100px rgba(0,0,0,.52);animation:r17dpUp .22s ease}
      #r17DelegatePanel .dp-head{display:flex;align-items:flex-start;gap:15px;padding:25px 28px 21px;border-bottom:1px solid rgba(255,255,255,.09)}
      #r17DelegatePanel .dp-avatar{width:50px;height:50px;display:grid;place-items:center;border-radius:16px;background:linear-gradient(135deg,#0b74ff,#20c4ff);font-size:25px;flex:none}
      #r17DelegatePanel .dp-kicker{font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#7dd3fc;font-weight:800}
      #r17DelegatePanel h2{margin:5px 0 5px;font-size:25px;letter-spacing:-.02em}.dp-sub{margin:0;color:#9fb3c9;font-size:13px;line-height:1.5}
      #r17DelegatePanel .dp-close{margin-left:auto;width:38px;height:38px;border:0;border-radius:11px;background:rgba(255,255,255,.08);color:#fff;font-size:21px;cursor:pointer}
      #r17DelegatePanel .dp-body{padding:22px 28px}.dp-section{padding:18px;margin-bottom:15px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035);border-radius:17px}
      #r17DelegatePanel .dp-section h3{margin:0 0 4px;font-size:14px}.dp-section>p{margin:0 0 14px;color:#8299b2;font-size:11px}
      #r17DelegatePanel .dp-grid{display:grid;grid-template-columns:1fr 1fr;gap:13px}.dp-field{display:flex;flex-direction:column;gap:6px}.dp-full{grid-column:1/-1}
      #r17DelegatePanel label{font-size:11px;font-weight:800;color:#dce9f6}.dp-help{font-size:10px;color:#7890a8;line-height:1.4}
      #r17DelegatePanel input,#r17DelegatePanel select{width:100%;box-sizing:border-box;border:1px solid #2b3e59;border-radius:11px;background:#081322;color:#fff;padding:11px 12px;outline:none;font:inherit}
      #r17DelegatePanel input:focus,#r17DelegatePanel select:focus{border-color:#27baff;box-shadow:0 0 0 3px rgba(39,186,255,.12)}
      #r17DelegatePanel .dp-country{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center}.dp-flag{width:52px;height:45px;display:grid;place-items:center;border-radius:12px;background:rgba(255,255,255,.06);font-size:27px}
      #r17DelegatePanel .dp-commission{display:flex;align-items:center;gap:12px;padding:12px 13px;border-radius:12px;background:rgba(39,186,255,.08);border:1px solid rgba(39,186,255,.16)}.dp-commission-icon{font-size:22px}.dp-commission strong{display:block;font-size:12px}.dp-commission span{display:block;color:#8299b2;font-size:10px;margin-top:2px}
      #r17DelegatePanel .dp-preview{display:flex;align-items:center;gap:13px;padding:14px;border-radius:14px;background:linear-gradient(135deg,rgba(39,186,255,.12),rgba(255,255,255,.025));border:1px solid rgba(39,186,255,.16)}
      #r17DelegatePanel .dp-preview-flag{font-size:34px}.dp-preview strong{display:block}.dp-preview span{display:block;color:#8ea5bd;font-size:10px;margin-top:3px}
      #r17DelegatePanel .dp-error{display:none;margin-top:9px;padding:9px 11px;border-radius:10px;background:rgba(255,75,85,.1);color:#ff9da4;font-size:11px}.dp-actions{display:flex;justify-content:flex-end;gap:9px;padding:0 28px 24px}.dp-btn{border:0;border-radius:11px;padding:11px 16px;font-weight:800;cursor:pointer}.dp-cancel{background:rgba(255,255,255,.08);color:#dce9f6}.dp-save{background:#27baff;color:#032238}.dp-save:disabled{opacity:.55;cursor:not-allowed}
      @keyframes r17dpFade{from{opacity:0}to{opacity:1}}@keyframes r17dpUp{from{opacity:0;transform:translateY(14px) scale(.985)}to{opacity:1;transform:none}}
      @media(max-width:620px){#r17DelegatePanel{padding:8px}.dp-head,.dp-body{padding-left:17px!important;padding-right:17px!important}.dp-actions{padding:0 17px 17px;flex-direction:column-reverse}.dp-btn{width:100%}.dp-grid{grid-template-columns:1fr!important}.dp-full{grid-column:auto}}
    `;
    document.head.appendChild(s);
  }

  function close(){document.getElementById('r17DelegatePanel')?.remove()}
  function refresh(modelId,commissionId){
    close();
    const nav=document.querySelector('[data-mun-view]');
    if(!nav)return;
    nav.click();
    setTimeout(()=>{
      const model=document.querySelector(`[data-model="${CSS.escape(modelId)}"]`);
      if(model){model.click();setTimeout(()=>document.querySelector(`[data-com="${CSS.escape(commissionId)}"]`)?.click(),70)}
    },70);
  }

  function openPanel(model,commission){
    styles();close();
    const countries=COUNTRIES.map(c=>`<option value="${c[0]}">${c[2]} ${c[1]}</option>`).join('');
    const districts=DISTRICTS.map(d=>`<option>${d}</option>`).join('');
    const x=document.createElement('div');x.id='r17DelegatePanel';
    x.innerHTML=`<div class="dp-card" role="dialog" aria-modal="true" aria-labelledby="dpTitle">
      <div class="dp-head"><div class="dp-avatar">👤</div><div><div class="dp-kicker">MUN · REGIONAL 17</div><h2 id="dpTitle">Añadir delegado</h2><p class="dp-sub">Registra al participante directamente en la comisión seleccionada.</p></div><button class="dp-close" type="button" aria-label="Cerrar">×</button></div>
      <div class="dp-body">
        <section class="dp-section"><h3>Comisión</h3><p>El delegado quedará vinculado automáticamente a esta comisión.</p><div class="dp-commission"><div class="dp-commission-icon">🏛️</div><div><strong>${esc(commission.name)}</strong><span>Modelo: ${esc(model.name || 'Modelo Regional 17')}</span></div></div></section>
        <section class="dp-section"><h3>Identidad del delegado</h3><p>Completa los datos que aparecerán en la acreditación y en la tabla de la comisión.</p><div class="dp-grid">
          <div class="dp-field dp-full"><label for="dpName">Nombre completo *</label><input id="dpName" autocomplete="name" placeholder="Ej. María Rodríguez"/><span class="dp-help">Escribe nombre y apellido tal como deben aparecer oficialmente.</span></div>
          <div class="dp-field"><label for="dpCountry">País *</label><div class="dp-country"><div class="dp-flag" id="dpFlag">🇩🇴</div><select id="dpCountry">${countries}</select></div><span class="dp-help">La bandera se actualiza automáticamente.</span></div>
          <div class="dp-field"><label for="dpDistrict">Distrito</label><select id="dpDistrict">${districts}</select><span class="dp-help">Selecciona el distrito educativo del participante.</span></div>
          <div class="dp-field"><label for="dpInstitution">Institución / colegio</label><input id="dpInstitution" placeholder="Nombre del centro educativo"/><span class="dp-help">Colegio o institución que representa.</span></div>
          <div class="dp-field"><label for="dpRole">Rol</label><select id="dpRole"><option>Delegado</option><option>Delegado principal</option><option>Delegado suplente</option><option>Observador</option></select></div>
        </div></section>
        <section class="dp-section"><h3>Contacto</h3><p>Datos opcionales para comunicación y organización.</p><div class="dp-grid">
          <div class="dp-field"><label for="dpEmail">Correo electrónico</label><input id="dpEmail" type="email" autocomplete="email" placeholder="delegado@correo.com"/></div>
          <div class="dp-field"><label for="dpPhone">Teléfono</label><input id="dpPhone" autocomplete="tel" placeholder="809-000-0000"/></div>
        </div></section>
        <div class="dp-preview"><div class="dp-preview-flag" id="dpPreviewFlag">🇩🇴</div><div><strong id="dpPreviewName">Nuevo delegado</strong><span id="dpPreviewMeta">República Dominicana · Delegado · ${esc(commission.name)}</span></div></div>
        <div class="dp-error" id="dpError"></div>
      </div>
      <div class="dp-actions"><button type="button" class="dp-btn dp-cancel">Cancelar</button><button type="button" class="dp-btn dp-save">Guardar delegado</button></div>
    </div>`;
    document.body.appendChild(x);

    const closeBtn=x.querySelector('.dp-close'),cancel=x.querySelector('.dp-cancel'),save=x.querySelector('.dp-save');
    const name=x.querySelector('#dpName'),country=x.querySelector('#dpCountry'),district=x.querySelector('#dpDistrict'),institution=x.querySelector('#dpInstitution'),role=x.querySelector('#dpRole');
    const flag=x.querySelector('#dpFlag'),previewFlag=x.querySelector('#dpPreviewFlag'),previewName=x.querySelector('#dpPreviewName'),previewMeta=x.querySelector('#dpPreviewMeta');
    const error=x.querySelector('#dpError');
    const update=()=>{const f=COUNTRIES.find(c=>c[0]===country.value)||COUNTRIES[0];flag.textContent=f[2];previewFlag.textContent=f[2];previewName.textContent=name.value.trim()||'Nuevo delegado';previewMeta.textContent=`${f[1]} · ${role.value} · ${commission.name}`};
    country.onchange=update;name.oninput=update;role.onchange=update;update();
    closeBtn.onclick=close;cancel.onclick=close;x.addEventListener('click',e=>{if(e.target===x)close()});
    save.onclick=()=>{
      error.style.display='none';
      const fullName=name.value.trim();
      if(!fullName){error.textContent='El nombre completo es obligatorio.';error.style.display='block';name.focus();return}
      const email=x.querySelector('#dpEmail').value.trim();
      if(email && !/^\S+@\S+\.\S+$/.test(email)){error.textContent='Revisa el correo electrónico.';error.style.display='block';x.querySelector('#dpEmail').focus();return}
      const f=COUNTRIES.find(c=>c[0]===country.value)||COUNTRIES[0];
      const s=read();const m=s.models.find(v=>v.id===model.id);const c=m?.commissions.find(v=>v.id===commission.id);
      if(!m||!c){error.textContent='No se encontró la comisión seleccionada. Actualiza la vista e inténtalo de nuevo.';error.style.display='block';return}
      const duplicate=c.delegations?.some(d=>String(d.name||'').trim().toLowerCase()===fullName.toLowerCase() && String(d.country||'')===f[1]);
      if(duplicate){error.textContent='Este delegado ya está registrado en esta comisión.';error.style.display='block';return}
      if(!Array.isArray(c.delegations))c.delegations=[];
      c.delegations.push({id:crypto.randomUUID(),country:f[1],name:fullName,email,phone:x.querySelector('#dpPhone').value.trim(),district:district.value,institution:institution.value.trim(),role:role.value,attendance:false,result:'pendiente',code:f[0],flag:f[2]});
      s.selectedModel=m.id;s.selectedCommission=c.id;write(s);save.disabled=true;save.textContent='Guardando…';refresh(m.id,c.id);
    };
    name.focus();
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest?.('#munAddDel');
    if(!btn)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    const s=read();const m=s.models.find(v=>v.id===s.selectedModel);if(!m)return;
    const c=m.commissions.find(v=>v.id===s.selectedCommission)||m.commissions[0];if(!c)return;
    openPanel(m,c);
  },true);
})();
