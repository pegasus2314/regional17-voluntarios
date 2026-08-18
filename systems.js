/* Regional 17 · Sistemas PLERD
   Módulo institucional integrado a la plataforma Regional 17. */
(() => {
  'use strict';

  const SYSTEM = {
    icon: '▣',
    title: 'Sistema MUN Regional 17',
    description: 'Gestiona modelos, comisiones, delegaciones, asistencia y hojas de trabajo desde la plataforma Regional 17.'
  };

  const STYLE_ID = 'rv-external-systems-style';
  const SIDEBAR_ID = 'rv-external-systems';

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .rv-systems-nav{margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,.10)}
      .rv-systems-label{padding:0 12px 7px;color:rgba(255,255,255,.52);font-size:10px;font-weight:800;letter-spacing:.09em;text-transform:uppercase}
      .rv-system-link{width:100%;display:flex;align-items:center;gap:10px;padding:9px 11px;margin:3px 0;border:0;background:transparent;color:inherit;text-align:left;border-radius:10px;cursor:pointer;text-decoration:none;transition:background .18s ease,transform .18s ease}
      .rv-system-link:hover{background:rgba(255,255,255,.08);transform:translateX(2px)}
      .rv-system-link .rv-system-icon{width:28px;height:28px;display:grid;place-items:center;flex:0 0 28px;border-radius:8px;background:rgba(65,132,255,.20);color:#8eb7ff;font-weight:800}
      .rv-system-link .rv-system-copy{min-width:0;display:flex;flex-direction:column;gap:2px}
      .rv-system-link strong{font-size:12px;line-height:1.2;color:#fff}
      .rv-system-link small{font-size:9px;line-height:1.25;color:rgba(255,255,255,.56)}
      .rv-systems-panel{margin:18px 0;padding:18px;border:1px solid #e4eaf3;border-radius:16px;background:linear-gradient(135deg,#fff,#f7faff);box-shadow:0 8px 24px rgba(7,27,53,.06)}
      .rv-systems-panel-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:14px}
      .rv-systems-panel-head h3{margin:0;font-size:16px;color:#102a54}
      .rv-systems-panel-head p{margin:4px 0 0;color:#718096;font-size:12px}
      .rv-systems-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:12px}
      .rv-system-card{display:flex;align-items:center;gap:13px;padding:14px;border:1px solid #e4eaf3;border-radius:13px;background:#fff;text-decoration:none;cursor:pointer;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
      .rv-system-card:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(7,27,53,.10);border-color:#c9d8ef}
      .rv-system-card .rv-card-icon{width:42px;height:42px;display:grid;place-items:center;flex:0 0 42px;border-radius:12px;background:#eaf2ff;color:#1858c7;font-size:18px;font-weight:900}
      .rv-system-card .rv-card-copy{min-width:0;flex:1}
      .rv-system-card strong{display:block;color:#172b4d;font-size:13px}
      .rv-system-card p{margin:4px 0 0;color:#718096;font-size:11px;line-height:1.35}
      .rv-system-card .rv-arrow{color:#8391a7;font-size:18px}
      @media(max-width:720px){.rv-systems-panel{padding:14px}.rv-systems-panel-head{display:block}}
    `;
    document.head.appendChild(style);
  }

  function openEvaluation() {
    window.dispatchEvent(new CustomEvent('rv-open-evaluation'));
  }

  function navHtml() {
    return `<div class="rv-systems-nav" id="${SIDEBAR_ID}">
      <div class="rv-systems-label">Sistemas PLERD</div>
      <button class="rv-system-link" type="button" data-rv-evaluation>
        <span class="rv-system-icon">${SYSTEM.icon}</span>
        <span class="rv-system-copy"><strong>${SYSTEM.title}</strong><small>${SYSTEM.description}</small></span>
      </button>
    </div>`;
  }

  function ensureSidebar() {
    const nav = document.querySelector('.sidebar nav');
    if (!nav || document.getElementById(SIDEBAR_ID)) return;
    nav.insertAdjacentHTML('beforeend', navHtml());
    const button = document.querySelector(`#${SIDEBAR_ID} [data-rv-evaluation]`);
    if (button) button.addEventListener('click', openEvaluation);
  }

  function ensureDashboardPanel() {
    const content = document.getElementById('content');
    if (!content || document.getElementById('rv-dashboard-systems')) return;
    const title = content.querySelector('.hero h2');
    if (!title) return;
    const panel = document.createElement('section');
    panel.id = 'rv-dashboard-systems';
    panel.className = 'rv-systems-panel';
    panel.innerHTML = `<div class="rv-systems-panel-head"><div><h3>▣ Sistema MUN Regional 17</h3><p>Herramientas para gestionar modelos, comisiones, delegaciones y asistencia.</p></div></div>
      <div class="rv-systems-grid"><button class="rv-system-card" type="button" data-rv-evaluation>
        <span class="rv-card-icon">${SYSTEM.icon}</span><span class="rv-card-copy"><strong>${SYSTEM.title}</strong><p>${SYSTEM.description}</p></span><span class="rv-arrow">→</span>
      </button></div>`;
    const grid = content.querySelector('.dash-grid');
    if (grid) grid.insertAdjacentElement('beforebegin', panel);
    else content.appendChild(panel);
    panel.querySelector('[data-rv-evaluation]').addEventListener('click', openEvaluation);
  }

  function refresh() {
    injectStyles();
    ensureSidebar();
    ensureDashboardPanel();
  }

  const observer = new MutationObserver(refresh);
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('load', refresh);
  document.addEventListener('DOMContentLoaded', refresh);
  setTimeout(refresh, 300);
  setTimeout(refresh, 1200);
})();
