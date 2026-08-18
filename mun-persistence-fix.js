/* Regional 17 · MUN · Persistencia de comisiones y delegados */
(() => {
  'use strict';
  const KEY='r17_mun_state_v2';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{"models":[],"selectedModel":null,"selectedCommission":null}')}catch{return {models:[],selectedModel:null,selectedCommission:null}}};
  const write=s=>localStorage.setItem(KEY,JSON.stringify(s));

  // The new visual MUN form used .r17-save, while the old persistence bridge only
  // watched .vbtn.save. Capture the click before the visual form's own refresh()
  // so the persisted state is followed by a full reload of mun-replace.js.
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('#r17MunFormModal .r17-save');
    if(!button)return;
    const form=document.getElementById('r17MunFormModal');
    if(!form)return;
    const state=read();
    const model=state.models.find(m=>m.id===state.selectedModel);
    if(!model)return;

    const title=form.querySelector('h2')?.textContent?.trim()||'';
    if(title==='Registrar comisión'){
      const name=form.querySelector('#cfName')?.value.trim()||'';
      if(!name){event.preventDefault();event.stopImmediatePropagation();form.querySelector('#cfName')?.focus();return;}
      if(!Array.isArray(model.commissions))model.commissions=[];
      if(model.commissions.some(c=>String(c.name||'').trim().toLowerCase()===name.toLowerCase())){
        event.preventDefault();event.stopImmediatePropagation();alert('Ya existe una comisión con ese nombre en este modelo.');return;
      }
      const commission={
        id:crypto.randomUUID(),name,delegations:[],
        type:form.querySelector('#cfType')?.value||'ONU',
        capacity:Number(form.querySelector('#cfCapacity')?.value)||20,
        topic:form.querySelector('#cfTopic')?.value.trim()||'',
        description:form.querySelector('#cfDesc')?.value.trim()||''
      };
      model.commissions.push(commission);
      state.selectedModel=model.id;
      state.selectedCommission=commission.id;
      write(state);
      event.preventDefault();event.stopImmediatePropagation();
      window.location.reload();
      return;
    }

    if(title==='Registrar delegado'){
      const name=form.querySelector('#dfName')?.value.trim()||'';
      if(!name){event.preventDefault();event.stopImmediatePropagation();form.querySelector('#dfName')?.focus();return;}
      const commission=model.commissions?.find(c=>c.id===state.selectedCommission);
      if(!commission){event.preventDefault();event.stopImmediatePropagation();alert('Selecciona una comisión antes de registrar el delegado.');return;}
      if(!Array.isArray(commission.delegations))commission.delegations=[];
      const countries={DO:['República Dominicana','🇩🇴'],US:['Estados Unidos','🇺🇸'],CN:['China','🇨🇳'],FR:['Francia','🇫🇷'],RU:['Rusia','🇷🇺'],GB:['Reino Unido','🇬🇧'],PS:['Palestina','🇵🇸'],MX:['México','🇲🇽'],BR:['Brasil','🇧🇷'],CO:['Colombia','🇨🇴'],ES:['España','🇪🇸'],DE:['Alemania','🇩🇪'],AR:['Argentina','🇦🇷'],CL:['Chile','🇨🇱'],PE:['Perú','🇵🇪'],UY:['Uruguay','🇺🇾'],EC:['Ecuador','🇪🇨'],BO:['Bolivia','🇧🇴'],CR:['Costa Rica','🇨🇷'],PA:['Panamá','🇵🇦'],GT:['Guatemala','🇬🇹'],HN:['Honduras','🇭🇳'],SV:['El Salvador','🇸🇻'],NI:['Nicaragua','🇳🇮'],CA:['Canadá','🇨🇦'],JP:['Japón','🇯🇵'],KR:['Corea del Sur','🇰🇷'],IN:['India','🇮🇳'],IT:['Italia','🇮🇹'],PT:['Portugal','🇵🇹'],NL:['Países Bajos','🇳🇱'],SE:['Suecia','🇸🇪'],NO:['Noruega','🇳🇴'],CH:['Suiza','🇨🇭'],ZA:['Sudáfrica','🇿🇦'],EG:['Egipto','🇪🇬'],NG:['Nigeria','🇳🇬'],KE:['Kenia','🇰🇪'],AU:['Australia','🇦🇺']};
      const code=form.querySelector('#dfCountry')?.value||'DO';
      const country=countries[code]||['País no especificado','🌎'];
      const email=form.querySelector('#dfEmail')?.value.trim()||'';
      if(email&&!/^\S+@\S+\.\S+$/.test(email)){event.preventDefault();event.stopImmediatePropagation();form.querySelector('#dfEmail')?.focus();alert('Revisa el correo electrónico.');return;}
      commission.delegations.push({id:crypto.randomUUID(),country:country[0],flag:country[1],code,name,email,phone:form.querySelector('#dfPhone')?.value.trim()||'',district:form.querySelector('#dfDistrict')?.value||'',attendance:false,result:'pendiente'});
      state.selectedModel=model.id;
      state.selectedCommission=commission.id;
      write(state);
      event.preventDefault();event.stopImmediatePropagation();
      window.location.reload();
    }
  },true);

  // Backward compatibility for the older visual form implementation.
  function replaceSaveButton(form){
    const save=form.querySelector('.vbtn.save');
    if(!save||save.dataset.persistenceFixed==='1')return;
    save.dataset.persistenceFixed='1';
    const replacement=save.cloneNode(true);save.replaceWith(replacement);
    replacement.addEventListener('click',()=>{
      const state=read(),model=state.models.find(m=>m.id===state.selectedModel);
      if(!model)return;
      const title=form.querySelector('h2')?.textContent?.trim()||'';
      if(title==='Registrar comisión'){
        const name=form.querySelector('#vcn')?.value.trim();if(!name){form.querySelector('#vcn')?.focus();return;}
        if(!Array.isArray(model.commissions))model.commissions=[];
        const c={id:crypto.randomUUID(),name,delegations:[],type:form.querySelector('#vct')?.value||'Comisión ONU',capacity:Number(form.querySelector('#vcc')?.value)||20,topic:form.querySelector('#vctopic')?.value.trim()||'',description:form.querySelector('#vcdesc')?.value.trim()||''};
        model.commissions.push(c);state.selectedModel=model.id;state.selectedCommission=c.id;write(state);window.location.reload();return;
      }
    });
  }
  const observer=new MutationObserver(()=>{const form=document.getElementById('r17VisualMunForm');if(form)replaceSaveButton(form);});
  observer.observe(document.body,{childList:true,subtree:true});
})();