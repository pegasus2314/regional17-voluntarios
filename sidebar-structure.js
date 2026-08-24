/* Regional 17 — sidebar structural redesign */
(() => {
  'use strict';
  const groups = [
    { label:'GENERAL', items:[['dashboard','⌂','Inicio','Vista general']] },
    { label:'GESTIÓN', items:[['volunteers','♙','Voluntarios','Directorio y seguimiento'],['accreditation','▣','Acreditación','Credenciales y estado'],['centers','⌂','Centros educativos','Centros y sedes']] },
    { label:'OPERACIONES', items:[['activities','✓','Actividades','Planificación y participación'],['events','◷','Eventos','Agenda regional'],['map','⌖','Mapa operativo','Ubicaciones']] },
    { label:'ANÁLISIS', items:[['stats','▥','Estadísticas','Indicadores y desempeño']] }
  ];

  const iconMap = Object.fromEntries(groups.flatMap(g => g.items.map(x => [x[0], x[1]])));
  const labelMap = Object.fromEntries(groups.flatMap(g => g.items.map(x => [x[0], x[2]])));
  const descMap = Object.fromEntries(groups.flatMap(g => g.items.map(x => [x[0], x[3]])));

  function makeItem(id, original) {
    const b = original || document.createElement('button');
    b.dataset.view = id;
    b.className = `nav-item ${b.classList.contains('active') ? 'active' : ''}`;
    b.innerHTML = `<span class="nav-icon">${iconMap[id] || '•'}</span><span class="nav-copy"><strong>${labelMap[id] || id}</strong><small>${descMap[id] || ''}</small></span>${b.classList.contains('active') ? '<span class="nav-active-dot"></span>' : ''}`;
    return b;
  }

  function rebuild() {
    const sidebar = document.querySelector('.sidebar');
    const oldNav = sidebar?.querySelector('nav');
    if (!sidebar || !oldNav || oldNav.dataset.r17Structured === '1') return;

    const oldButtons = [...oldNav.querySelectorAll('[data-view]')];
    const byId = Object.fromEntries(oldButtons.map(b => [b.dataset.view, b]));
    const accreditation = byId.accreditation || document.querySelector('[data-view="accreditation"]');
    const admin = byId.admin || document.querySelector('[data-view="admin"]');

    oldNav.innerHTML = '';
    oldNav.className = 'nav-modern';

    for (const group of groups) {
      const visible = group.items.filter(([id]) => id !== 'accreditation' || true);
      const section = document.createElement('div');
      section.className = 'nav-group';
      section.innerHTML = `<div class="nav-label">${group.label}</div>`;
      visible.forEach(([id]) => section.appendChild(makeItem(id, byId[id] || (id === 'accreditation' ? accreditation : null))));
      oldNav.appendChild(section);
    }

    if (admin) {
      const section = document.createElement('div');
      section.className = 'nav-group nav-admin-group';
      section.innerHTML = '<div class="nav-label">ADMINISTRACIÓN</div>';
      section.appendChild(makeItem('admin', admin));
      oldNav.appendChild(section);
    }

    oldNav.dataset.r17Structured = '1';
    oldNav.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        oldNav.querySelectorAll('[data-view]').forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
      }, { passive:true });
    });
  }

  const observer = new MutationObserver(() => {
    const nav = document.querySelector('.sidebar nav');
    if (nav && nav.dataset.r17Structured !== '1') rebuild();
  });
  observer.observe(document.documentElement, { childList:true, subtree:true });
  document.addEventListener('DOMContentLoaded', rebuild);
  setTimeout(rebuild, 100);
  setTimeout(rebuild, 700);
})();
