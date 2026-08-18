/* Regional 17 · MUN registration panels */
(() => {
  'use strict';
  const KEY = 'r17_mun_state_v2';
  const COUNTRIES = [
    ['DO','República Dominicana','🇩🇴'],['US','Estados Unidos','🇺🇸'],['CN','China','🇨🇳'],['FR','Francia','🇫🇷'],['RU','Rusia','🇷🇺'],['GB','Reino Unido','🇬🇧'],['PS','Palestina','🇵🇸'],['MX','México','🇲🇽'],['BR','Brasil','🇧🇷'],['CO','Colombia','🇨🇴'],['ES','España','🇪🇸'],['DE','Alemania','🇩🇪'],['AR','Argentina','🇦🇷'],['CL','Chile','🇨🇱'],['PE','Perú','🇵🇪'],['UY','Uruguay','🇺🇾'],['EC','Ecuador','🇪🇨'],['BO','Bolivia','🇧🇴'],['CR','Costa Rica','🇨🇷'],['PA','Panamá','🇵🇦'],['GT','Guatemala','🇬🇹'],['HN','Honduras','🇭🇳'],['SV','El Salvador','🇸🇻'],['NI','Nicaragua','🇳🇮'],['CA','Canadá','🇨🇦'],['JP','Japón','🇯🇵'],['KR','Corea del Sur','🇰🇷'],['IN','India','🇮🇳'],['DE','Alemania','🇩🇪'],['IT','Italia','🇮🇹'],['PT','Portugal','🇵🇹'],['NL','Países Bajos','🇳🇱'],['SE','Suecia','🇸🇪'],['NO','Noruega','🇳🇴'],['CH','Suiza','🇨🇭'],['ZA','Sudáfrica','🇿🇦'],['EG','Egipto','🇪🇬'],['NG','Nigeria','🇳🇬'],['KE','Kenia','🇰🇪'],['AU','Australia','🇦🇺']
  ];
  const DISTRICTS = ['17-01 · Yamasá','17-02 · Monte Plata','17-03 · Bayaguana','17-04 · Sabana Grande de Boyá','17-05 · Esperalvillo'];
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read = () => JSON.parse(localStorage.getItem(KEY) || '{"models":[],"selectedModel":null,"selectedCommission":null}');
  const write = s => localStorage.setItem(KEY, JSON.stringify(s));
  const modal = () => document.getElementById('r17MunFormModal');
  const close = () => modal()?.remove();
  const refresh = (modelId, commissionId) => {
    close();
    const nav = document.querySelector('[data-mun-view]');
    if (!nav) return;
    nav.click();
    setTimeout(() => {
      const model = document.querySelector(`[data-model="${CSS.escape(modelId)}"]`);
      if (model) {
        model.click();
        if (commissionId) setTimeout(() => document.querySelector(`[data-com="${CSS.escape(commissionId)}"]`)?.click(), 50);
      }
    }, 50);
  };
  function injectStyles(){
    if(document.getElementById('r17-mun-forms-css')) return;
    const s=document.createElement('style');s.id='r17-mun-forms-css';s.textContent=`
      #r17MunFormModal{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:22px;background:rgba(3,12,24,.62);backdrop-filter:blur(10px);animation:r17Fade .18s ease}
      #r17MunFormModal .r17-form{width:min(900px,100%);max-height:min(92vh,900px);overflow:auto;border:1px solid rgba(255,255,255,.12);border-radius:26px;background:linear-gradient(145deg,#10233e,#071426);color:#f7fbff;box-shadow:0 30px 90px rgba(0,0,0,.45);animation:r17Up .22s ease}
      #r17MunFormModal .r17-form-head{padding:28px 30px 22px;border-bottom:1px solid rgba(255,255,255,.09);display:flex;align-items:flex-start;justify-content:space-between;gap:20px}
      #r17MunFormModal .r17-kicker{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#7dd3fc;font-weight:800}
      #r17MunFormModal h2{margin:6px 0 6px;font-size:28px;letter-spacing:-.02em}
      #r17MunFormModal .r17-sub{margin:0;color:#aebfd3;font-size:14px;line-height:1.5}
      #r17MunFormModal .r17-close{border:0;background:rgba(255,255,255,.08);color:#fff;width:38px;height:38px;border-radius:12px;cursor:pointer;font-size:20px}
      #r17MunFormModal .r17-body{padding:26px 30px}
      #r17MunFormModal .r17-section{margin-bottom:22px;padding:20px;border-radius:18px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.07)}
      #r17MunFormModal .r17-section h3{margin:0 0 4px;font-size:15px}.r17-section p{margin:0 0 16px;color:#91a7be;font-size:12px}
      #r17MunFormModal .r17-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}
      #r17MunFormModal .r17-field{display:flex;flex-direction:column;gap:7px}.r17-field.full{grid-column:1/-1}
      #r17MunFormModal label{font-size:12px;font-weight:750;color:#dbe8f5}
      #r17MunFormModal input,#r17MunFormModal select,#r17MunFormModal textarea{width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:rgba(4,13,25,.58);color:#fff;padding:12px 13px;outline:none;font:inherit}
      #r17MunFormModal input:focus,#r17MunFormModal select:focus,#r17MunFormModal textarea:focus{border-color:#38bdf8;box-shadow:0 0 0 3px rgba(56,189,248,.12)}
      #r17MunFormModal textarea{min-height:92px;resize:vertical}.r17-help{font-size:11px;color:#7890a8;line-height:1.4}
      #r17MunFormModal .r17-type{display:grid;grid-template-columns:1fr 1fr;gap:10px}.r17-type label{padding:13px;border:1px solid rgba(255,255,255,.1);border-radius:12px;cursor:pointer;background:rgba(255,255,255,.025)}
      #r17MunFormModal .r17-type input{width:auto;margin-right:7px;accent-color:#38bdf8}
      #r17MunFormModal .r17-actions{display:flex;justify-content:flex-end;gap:10px;padding:0 30px 28px}.r17-form-btn{border:0;border-radius:12px;padding:12px 18px;font-weight:800;cursor:pointer}.r17-cancel{background:rgba(255,255,255,.08);color:#dbe8f5}.r17-save{background:#38bdf8;color:#032238}
      #r17MunFormModal .r17-preview{display:flex;align-items:center;gap:15px;padding:15px;border-radius:15px;background:linear-gradient(135deg,rgba(56,189,248,.12),rgba(255,255,255,.03));border:1px solid rgba(56,189,248,.15)}
      #r17MunFormModal .r17-preview-icon{font-size:34px}.r17-preview strong{display:block}.r17-preview span{font-size:12px;color:#9eb2c8}
      @keyframes r17Fade{from{opacity:0}to{opacity:1}}@keyframes r17Up{from{opacity:0;transform:translateY(12px) scale(.985)}to{opacity:1;transform:none}}
      @media(max-width:650px){#r17MunFormModal{padding:10px}#r17MunFormModal .r17-form-head,#r17MunFormModal .r17-body{padding-left:18px;padding-right:18px}#r17MunFormModal .r17-actions{padding-left:18px;padding-right:18px}.r17-grid,.r17-type{grid-template-columns:1fr!important}.r17-field.full{grid-column:auto}.r17-actions{flex-direction:column-reverse}.r17-form-btn{width:100%}}
    `;document.head.appendChild(s);
  }
  function shell(title,subtitle,content,saveText,handler){
    close();injectStyles();
    const x=document.createElement('div');x.id='r17MunFormModal';x.innerHTML=`<div class="r17-form" role="dialog" aria-modal="true"><div class="r17-form-head"><div><div class="r17-kicker">MUN · REGIONAL 17</div><h2>${title}</h2><p class="r17-sub">${subtitle}</p></div><button class="r17-close" type="button" aria-label="Cerrar">×</button></div><div class="r17-body">${content}</div><div class="r17-actions"><button type="button" class="r17-form-btn r17-cancel">Cancelar</button><button type="button" class="r17-form-btn r17-save">${saveText}</button></div></div>`;document.body.appendChild(x);
    x.querySelector('.r17-close').onclick=close;x.querySelector('.r17-cancel').onclick=close;x.querySelector('.r17-save').onclick=()=>handler(x);x.addEventListener('click',e=>{if(e.target===x)close()});
    x.querySelector('input,select,textarea')?.focus();
  }
  function commissionForm(model){
    const defaults=['Asamblea General','Consejo de Seguridad','ECOSOC','UNESCO','UNICEF','OMS','OIT','ONU Mujeres','ACNUR','PNUD','FAO','OIM'];
    const opts=defaults.map(v=>`<option>${v}</option>`).join('');
    shell('Registrar comisión','Crea la hoja de trabajo de una comisión sin usar ventanas emergentes.',`<section class="r17-section"><h3>Identidad de la comisión</h3><p>Define cómo aparecerá en el modelo.</p><div class="r17-grid"><div class="r17-field full"><label for="cfName">Nombre de la comisión *</label><input id="cfName" list="cfNames" placeholder="Ej. Consejo de Seguridad"/><datalist id="cfNames">${opts}</datalist><span class="r17-help">Escribe el nombre oficial o uno personalizado.</span></div><div class="r17-field"><label for="cfType">Tipo</label><select id="cfType"><option value="ONU">Comisión ONU</option><option value="Personalizada">Comisión personalizada</option></select></div><div class="r17-field"><label for="cfCapacity">Capacidad de delegados</label><input id="cfCapacity" type="number" min="1" value="20"/><span class="r17-help">Cantidad máxima prevista de delegaciones.</span></div></div></section><section class="r17-section"><h3>Información académica</h3><p>Esta información ayuda a organizar la experiencia.</p><div class="r17-grid"><div class="r17-field full"><label for="cfTopic">Tema / tópico</label><input id="cfTopic" placeholder="Ej. Seguridad internacional y conflictos regionales"/><span class="r17-help">Indica el asunto que debatirán los delegados.</span></div><div class="r17-field full"><label for="cfDesc">Descripción</label><textarea id="cfDesc" placeholder="Describe brevemente la comisión, su enfoque y dinámica..."></textarea></div></div></section><div class="r17-preview"><div class="r17-preview-icon">🏛️</div><div><strong id="cfPreview">Nueva comisión</strong><span>Vista previa de la hoja de comisión</span></div></div>`,`Crear comisión`,x=>{const name=x.querySelector('#cfName').value.trim();if(!name){x.querySelector('#cfName').focus();return}const s=read(),m=s.models.find(v=>v.id===model.id);if(!m)return close();const c={id:crypto.randomUUID(),name,type:x.querySelector('#cfType').value,description:x.querySelector('#cfDesc').value.trim(),topic:x.querySelector('#cfTopic').value.trim(),capacity:Number(x.querySelector('#cfCapacity').value)||20,delegations:[]};m.commissions.push(c);s.selectedModel=m.id;s.selectedCommission=c.id;write(s);refresh(m.id,c.id)});
    const x=modal();const input=x.querySelector('#cfName');input.oninput=()=>x.querySelector('#cfPreview').textContent=input.value||'Nueva comisión';
  }
  function delegationForm(model,commission){
    const countryOpts=COUNTRIES.map(c=>`<option value="${c[0]}">${c[2]} ${c[1]}</option>`).join('');
    shell('Registrar delegado','Completa la ficha de la delegación y evita formularios de texto separados.',`<section class="r17-section"><h3>Delegación</h3><p>Selecciona el país y registra los datos del participante.</p><div class="r17-grid"><div class="r17-field"><label for="dfCountry">País *</label><select id="dfCountry">${countryOpts}</select><span class="r17-help">La bandera se asigna automáticamente.</span></div><div class="r17-field"><label for="dfDistrict">Distrito</label><select id="dfDistrict">${DISTRICTS.map(d=>`<option>${d}</option>`).join('')}</select></div><div class="r17-field"><label for="dfName">Nombre del delegado *</label><input id="dfName" placeholder="Nombre y apellido"/><span class="r17-help">Usa el nombre que aparecerá en la acreditación.</span></div><div class="r17-field"><label for="dfEmail">Correo electrónico</label><input id="dfEmail" type="email" placeholder="delegado@correo.com"/></div><div class="r17-field"><label for="dfPhone">Teléfono</label><input id="dfPhone" placeholder="809-000-0000"/></div></div></section><div class="r17-preview"><div class="r17-preview-icon" id="dfFlag">🇩🇴</div><div><strong id="dfPreview">Nuevo delegado</strong><span id="dfPreviewSub">República Dominicana · ${esc(commission.name)}</span></div></div>`,`Guardar delegado`,x=>{const name=x.querySelector('#dfName').value.trim();if(!name){x.querySelector('#dfName').focus();return}const code=x.querySelector('#dfCountry').value;const found=COUNTRIES.find(c=>c[0]===code)||COUNTRIES[0];const s=read(),m=s.models.find(v=>v.id===model.id),c=m?.commissions.find(v=>v.id===commission.id);if(!c)return close();c.delegations.push({country:found[1],name,email:x.querySelector('#dfEmail').value.trim(),phone:x.querySelector('#dfPhone').value.trim(),district:x.querySelector('#dfDistrict').value,attendance:false,result:'pendiente',code:found[0],flag:found[2]});s.selectedModel=m.id;s.selectedCommission=c.id;write(s);refresh(m.id,c.id)});
    const x=modal();const country=x.querySelector('#dfCountry'),name=x.querySelector('#dfName');const update=()=>{const f=COUNTRIES.find(c=>c[0]===country.value)||COUNTRIES[0];x.querySelector('#dfFlag').textContent=f[2];x.querySelector('#dfPreviewSub').textContent=`${f[1]} · ${commission.name}`;x.querySelector('#dfPreview').textContent=name.value||'Nuevo delegado'};country.onchange=update;name.oninput=update;update();
  }
  function intercept(e){
    const t=e.target.closest?.('#munAddCom,#munAddDel');if(!t)return;
    e.preventDefault();e.stopImmediatePropagation();
    const s=read(),m=s.models.find(v=>v.id===s.selectedModel);if(!m)return;
    if(t.id==='munAddCom') commissionForm(m);
    else {const c=m.commissions.find(v=>v.id===s.selectedCommission)||m.commissions[0];if(c)delegationForm(m,c)}
  }
  document.addEventListener('click',intercept,true);
  injectStyles();
})();
