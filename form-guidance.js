/* Regional 17 · Ayuda contextual global para formularios */
(() => {
'use strict';
const STYLE='rv-form-guidance-style';
const hints={
'nombre':'Escribe el nombre completo, tal como debe aparecer en el sistema.',
'apellido':'Escribe los apellidos completos de la persona.',
'cedula':'Introduce la cédula sin inventar datos. Usa el formato oficial de identificación.',
'email':'Escribe un correo electrónico válido que la persona pueda utilizar.',
'correo':'Escribe un correo electrónico válido que la persona pueda utilizar.',
'password':'Introduce la contraseña correspondiente. No compartas este dato.',
'contrasena':'Introduce una contraseña segura y fácil de identificar para ti.',
'telefono':'Escribe un número de teléfono activo para contacto.',
'celular':'Escribe un número de celular activo para contacto.',
'direccion':'Escribe la dirección o ubicación física completa.',
'distrito':'Selecciona el distrito educativo al que corresponde el registro.',
'distrito_id':'Selecciona el distrito educativo correspondiente.',
'centro':'Selecciona o escribe el centro educativo correspondiente.',
'centro_id':'Selecciona el centro educativo donde corresponde el registro.',
'municipio':'Indica el municipio al que pertenece el registro.',
'provincia':'Indica la provincia correspondiente.',
'categoria':'Selecciona la categoría que describe correctamente al registro.',
'estatus':'Selecciona el estado actual del registro.',
'estado':'Selecciona el estado actual del registro.',
'disponibilidad':'Indica cuándo o en qué condiciones está disponible la persona.',
'fecha':'Selecciona la fecha en que ocurre o se registra la actividad.',
'hora':'Selecciona la hora prevista para la actividad o evento.',
'fecha_inicio':'Selecciona la fecha de inicio.',
'fecha_fin':'Selecciona la fecha de finalización.',
'nombre_evento':'Escribe el nombre oficial del evento.',
'evento':'Selecciona o escribe el evento relacionado.',
'descripcion':'Explica brevemente de qué trata esta actividad, evento o registro.',
'descripción':'Explica brevemente de qué trata esta actividad, evento o registro.',
'notas':'Añade información adicional importante que no esté incluida en otros campos.',
'observaciones':'Escribe observaciones relevantes, claras y concretas.',
'comentarios':'Añade comentarios o información adicional relacionada con el registro.',
'horas':'Indica la cantidad de horas realizadas o previstas.',
'cupo':'Indica la cantidad máxima de participantes permitidos.',
'participantes':'Indica o selecciona las personas que participarán.',
'participante':'Selecciona la persona participante correspondiente.',
'pais':'Selecciona o escribe el país que representa la delegación.',
'país':'Selecciona o escribe el país que representa la delegación.',
'delegado':'Escribe o selecciona el nombre del delegado que representa al país.',
'delegacion':'Selecciona o registra la delegación correspondiente.',
'delegación':'Selecciona o registra la delegación correspondiente.',
'comision':'Selecciona la comisión en la que participa la delegación.',
'comisión':'Selecciona la comisión en la que participa la delegación.',
'rol':'Selecciona el rol que desempeña la persona.',
'cargo':'Indica el cargo o función que desempeña la persona.',
'criterio':'Especifica el criterio que será evaluado.',
'criterios':'Define los criterios que serán utilizados para evaluar.',
'puntuacion':'Indica la puntuación obtenida o el valor máximo permitido.',
'puntuación':'Indica la puntuación obtenida o el valor máximo permitido.',
'puntaje':'Indica el puntaje correspondiente a este criterio.',
'porcentaje':'Introduce el porcentaje correspondiente, entre 0 y 100.',
'evaluador':'Selecciona la persona responsable de realizar la evaluación.',
'evaluacion':'Selecciona o indica la evaluación correspondiente.',
'evaluación':'Selecciona o indica la evaluación correspondiente.',
'promedio':'Indica o revisa el promedio calculado para el registro.',
'ranking':'Indica la posición o clasificación correspondiente.',
'motivo':'Explica brevemente el motivo de la solicitud o cambio.',
'url':'Pega una dirección web completa y válida.',
'enlace':'Pega el enlace completo del recurso.',
'imagen':'Selecciona una imagen que identifique o acompañe el registro.',
'archivo':'Selecciona el archivo que deseas adjuntar.',
'logo':'Selecciona la imagen oficial que se utilizará como logo.',
'titulo':'Escribe un título corto, claro y descriptivo.',
'subtitulo':'Escribe un subtítulo breve que complemente el título.',
'mensaje':'Escribe el mensaje que deseas comunicar.',
'contenido':'Escribe el contenido completo que deseas guardar o publicar.'
};
function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9_ -]/g,'').replace(/\s+/g,'_')}
function inject(){if(document.getElementById(STYLE))return;const s=document.createElement('style');s.id=STYLE;s.textContent=`.rv-field-help{display:block;margin:5px 0 0;font-size:10.5px;line-height:1.4;color:#718096}.rv-field-help::before{content:'ⓘ';margin-right:5px;color:#3b78c8}.rv-field-guided:focus-within{border-radius:8px}.rv-field-guided:focus-within .rv-field-help{color:#2f6db8}.rv-field-guided:focus-within .rv-field-help::before{color:#2463c7}html.rv-dark-mode .rv-field-help{color:#9eacc1}html.rv-dark-mode .rv-field-guided:focus-within .rv-field-help{color:#79aff5}html.rv-dark-mode .rv-field-help::before{color:#6fa8ff}`;document.head.appendChild(s)}
function keyFor(el){const raw=[el.getAttribute('name'),el.id,el.getAttribute('aria-label'),el.getAttribute('placeholder')].filter(Boolean).join(' ');const label=el.closest('field')?.getAttribute('label')||el.closest('.form-group,.form-field,.field')?.querySelector('label')?.textContent||'';const all=norm(raw+' '+label);for(const k of Object.keys(hints))if(all.includes(norm(k)))return k;return null}
function fallback(el){const type=(el.type||'').toLowerCase();if(type==='email')return 'Introduce un correo electrónico válido.';if(type==='date')return 'Selecciona la fecha correspondiente.';if(type==='time')return 'Selecciona la hora correspondiente.';if(type==='number')return 'Introduce un valor numérico válido.';if(type==='url')return 'Introduce una dirección web válida.';if(type==='file')return 'Selecciona el archivo que deseas adjuntar.';if(el.tagName==='SELECT')return 'Selecciona la opción que corresponda a este registro.';if(el.tagName==='TEXTAREA')return 'Escribe la información solicitada de forma clara y completa.';return 'Completa este campo con la información que corresponde al registro.'}
function process(root=document){inject();root.querySelectorAll('input,select,textarea').forEach(el=>{if(el.type==='hidden'||el.disabled||el.dataset.rvGuidance==='off'||el.classList.contains('rv-field-help'))return;if(el.closest('#rv-evaluation-dashboard')&&el.dataset.rvGuidance==='off')return;const parent=el.closest('field,.form-group,.form-field,.field,.form-row')||el.parentElement;if(!parent||parent.querySelector(':scope > .rv-field-help'))return;const key=keyFor(el);const help=document.createElement('small');help.className='rv-field-help';help.textContent=hints[key]||fallback(el);parent.classList.add('rv-field-guided');el.insertAdjacentElement('afterend',help);});}
function init(){process();const observer=new MutationObserver(m=>m.forEach(x=>x.addedNodes.forEach(n=>{if(n.nodeType===1)process(n)})));observer.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();