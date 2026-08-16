/* Regional 17 — UI stability, persistent navigation, map removal and visual polish */
(() => {
  'use strict';
  const DESCRIPTIONS = {
    'Dashboard':'Resumen de la gestión regional',
    'Voluntarios':'Registro y seguimiento del equipo',
    'Actividades':'Planifica y controla actividades',
    'Centros educativos':'Centros de la Regional 17',
    'Eventos':'Eventos y compromisos programados',
    'Estadísticas':'Indicadores y desempeño',
    'Biblioteca':'Recursos académicos y documentos',
    'Calendario':'Eventos y planificación regional',
    'Mi líder':'Información y coordinación'
  };
  const MAP_RE = /^mapa$/i;
  const dynamic = new Map();
  let fixing = false;

  const removeMap = () => {
    document.querySelectorAll('[data-view="map"], [data-r17-map], .nav-item').forEach(el => {
      if (el.matches('[data-view="map"], [data-r17-map]') || MAP_RE.test(el.textContent.trim())) el.remove();
    });
  };

  const decorateNav = () => {
    const nav = document.querySelector('.sidebar nav');
    if (!nav) return;
    [...nav.querySelectorAll('.nav-item')].forEach(btn => {
      const labelNode = [...btn.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
      const label = (labelNode?.textContent || btn.textContent || '').trim();
      if (!label || MAP_RE.test(label)) return;
      const clean = label.replace(/\s+/g,' ').trim();
      if (!dynamic.has(btn.dataset.view || clean)) dynamic.set(btn.dataset.view || clean, btn.outerHTML);
      btn.classList.add('r17-nav-enhanced');
      btn.title = DESCRIPTIONS[clean] || clean;
      if (!btn.querySelector('.r17-nav-copy')) {
        const icon = btn.querySelector('span');
        const copy = document.createElement('span');
        copy.className = 'r17-nav-copy';
        copy.innerHTML = `<strong>${clean}</strong><small>${DESCRIPTIONS[clean] || 'Acceso al módulo'}</small>`;
        if (labelNode) labelNode.remove();
        btn.appendChild(copy);
      }
    });
  };

  const restoreModules = () => {
    const nav = document.querySelector('.sidebar nav');
    if (!nav) return;
    // El calendario y la biblioteca son módulos externos: los hacemos persistentes
    // sin permitir que el render principal los duplique.
    const ensure = (key, icon, label, description, handler) => {
      if (nav.querySelector(`[data-r17-module="${key}"]`)) return;
      const b = document.createElement('button');
      b.type='button'; b.className='nav-item r17-nav-enhanced'; b.dataset.r17Module=key;
      b.innerHTML=`<span>${icon}</span><span class="r17-nav-copy"><strong>${label}</strong><small>${description}</small></span>`;
      b.title=description; b.addEventListener('click',handler);
      nav.appendChild(b);
    };
    if (window.R17Calendar?.open) ensure('calendar','📅','Calendario','Eventos y planificación regional',e=>{e.preventDefault();window.R17Calendar.open()});
    if (window.R17Library?.open) ensure('library','📚','Biblioteca','Recursos académicos y documentos',e=>{e.preventDefault();window.R17Library.open()});
  };

  const polishActions = () => {
    document.querySelectorAll('.btn, .icon-action, .side-action').forEach(b=>{
      if (!b.getAttribute('aria-label') && !b.title) {
        const text=b.textContent.trim(); if(text) b.setAttribute('aria-label',text);
      }
    });
    document.querySelectorAll('#quickAdd').forEach(b=>{
      const t=b.textContent.trim();
      const map={Centro:'Añadir un centro educativo',Actividad:'Registrar una actividad',Evento:'Programar un evento',Voluntario:'Registrar un voluntario'};
      const key=Object.keys(map).find(k=>t.includes(k));
      if(key) b.title=map[key];
    });
  };

  const fix = () => {
    if (fixing) return;
    fixing=true;
    try { removeMap(); decorateNav(); restoreModules(); polishActions(); } finally { fixing=false; }
  };

  const boot = () => {
    fix();
    new MutationObserver(() => fix()).observe(document.body,{childList:true,subtree:true});
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
