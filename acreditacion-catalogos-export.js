/* Acreditación: catálogos reales + exportación completa (incluye cédula). */
(()=>{'use strict';
const C=window.RV_CONFIG||{};
const sb=window.supabase?.createClient(C.SUPABASE_URL,C.SUPABASE_ANON_KEY);
let distritos=[], centros=[];
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const text=v=>String(v??'').trim();
async function catalogs(){
 if(!sb)return;
 const [d,c]=await Promise.all([
  sb.from('distritos').select('id,nombre,regional').order('id'),
  sb.from('centros_educativos').select('id,distrito_id,nombre,nivel,is_active').eq('is_active',true).order('nombre')
 ]);
 if(!d.error)distritos=d.data||[];
 if(!c.error)centros=c.data||[];
}
function districtName(id){const d=distritos.find(x=>x.id===id);return d?`${d.id} · ${d.nombre}`:id||'Sin distrito';}
function fillDistrict(select, selected, locked){
 if(!select)return;
 const current=selected||select.value||'';
 select.innerHTML='<option value="">Seleccionar distrito</option>'+distritos.map(d=>`<option value="${esc(d.id)}" ${d.id===current?'selected':''}>${esc(d.id)} · ${esc(d.nombre)}</option>`).join('');
 if(locked){select.value=current;select.disabled=true;}
}
function fillCenters(select,districtId,selected){
 if(!select)return;
 const list=centros.filter(c=>!districtId||c.distrito_id===districtId);
 const current=selected||select.dataset.selected||'';
 select.innerHTML='<option value="">Seleccionar centro educativo</option>'+list.map(c=>`<option value="${esc(c.nombre)}" ${c.nombre===current?'selected':''}>${esc(c.nombre)}${c.nivel?' · '+esc(c.nivel):''}</option>`).join('');
 select.dataset.selected=current;
}
function enhanceModal(){
 const modal=document.querySelector('.acr2-modal');
 if(!modal||modal.dataset.catalogsReady)return;
 const district=modal.querySelector('#f-distrito_id');
 const center=modal.querySelector('#f-centro_educativo');
 if(!district||!center)return;
 modal.dataset.catalogsReady='1';
 const locked=district.disabled;
 const selectedDistrict=district.value;
 const selectedCenter=center.value;
 const wrap=center.closest('label');
 const select=document.createElement('select');
 select.id='f-centro_educativo';select.className='acr2-in';select.dataset.selected=selectedCenter;
 wrap.replaceChild(select,center);
 fillDistrict(district,selectedDistrict,locked);
 fillCenters(select,district.value,selectedCenter);
 district.addEventListener('change',()=>{fillCenters(select,district.value,'');});
}
function visibleIds(){return [...document.querySelectorAll('#acr2-list tbody [data-view]')].map(b=>b.dataset.view).filter(Boolean);}
async function exportRows(){
 const ids=visibleIds();
 if(!ids.length){alert('No hay registros para exportar.');return []}
 const {data,error}=await sb.from('acreditacion_delegados').select('*').in('id',ids);
 if(error){alert('No se pudieron obtener los datos: '+error.message);return []}
 return data||[];
}
function areaName(a){return ({minume:'MINUME',centro:'Etapa Centro',distrital:'Etapa Distrital'})[a]||a||'';}
function excel(){
 exportRows().then(rows=>{
  if(!rows.length)return;
  const data=rows.map(x=>({
   'ID acreditación':x.codigo,'Nombre':x.nombre,'Apellido':x.apellido,'Teléfono':x.telefono,
   'Cédula':x.cedula||'','Acta de nacimiento':x.acta_nacimiento||'',
   'Área':areaName(x.area),'Etapa':x.etapa,'Distrito educativo':districtName(x.distrito_id),
   'Centro educativo':x.centro_educativo,'Familiar/Tutor':x.tutor_nombre,'Teléfono familiar':x.tutor_telefono,
   '¿Presenta alergia?':x.presenta_alergia?'Sí':'No','Especificación de alergia':x.alergia_detalle||'',
   'Estado':x.estado,'Fecha de registro':x.created_at?new Date(x.created_at).toLocaleString('es-DO'):''
  }));
  const wb=XLSX.utils.book_new(),ws=XLSX.utils.json_to_sheet(data);
  ws['!cols']=[{wch:20},{wch:18},{wch:20},{wch:16},{wch:18},{wch:20},{wch:18},{wch:14},{wch:26},{wch:34},{wch:25},{wch:20},{wch:18},{wch:32},{wch:15},{wch:22}];
  XLSX.utils.book_append_sheet(wb,ws,'Acreditación');XLSX.writeFile(wb,`Acreditacion_${new Date().toISOString().slice(0,10)}.xlsx`);
 });
}
function pdf(){
 exportRows().then(rows=>{
  if(!rows.length)return;
  const js=window.jspdf?.jsPDF;if(!js){alert('No se pudo cargar el generador PDF.');return;}
  const doc=new js({orientation:'landscape',unit:'mm',format:'a4'});
  const title='REGIONAL 17 · ACREDITACIÓN';
  doc.setFontSize(16);doc.text(title,14,14);doc.setFontSize(9);doc.text(`Generado: ${new Date().toLocaleString('es-DO')} · Total: ${rows.length}`,14,20);
  const body=rows.map(x=>[x.codigo,`${x.nombre} ${x.apellido}`,x.cedula||'—',x.telefono||'—',x.centro_educativo||'—',districtName(x.distrito_id),x.etapa||'—',x.estado||'—']);
  doc.autoTable({startY:25,head:[['ID','Delegado','Cédula','Teléfono','Centro educativo','Distrito','Etapa','Estado']],body,styles:{fontSize:7,cellPadding:2},headStyles:{fontSize:7},margin:{left:10,right:10}});
  doc.save(`Acreditacion_${new Date().toISOString().slice(0,10)}.pdf`);
 });
}
function wire(){
 const observer=new MutationObserver(()=>enhanceModal());observer.observe(document.body,{childList:true,subtree:true});
 document.addEventListener('click',e=>{
  const t=e.target.closest?.('#acr2-x,#acr2-p');if(!t)return;
  e.preventDefault();e.stopImmediatePropagation();if(t.id==='acr2-x')excel();else pdf();
 },true);
 enhanceModal();
}
(async()=>{await catalogs();wire();})();
})();
