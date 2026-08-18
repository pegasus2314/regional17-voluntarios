/* Regional 17 · Sistema MUN
   Acceso único al nuevo flujo de Modelos → Comisiones → Delegaciones. */
(() => {
  'use strict';
  const SIDEBAR_ID = 'rv-mun-system-nav';
  const SYSTEM = {
    icon: '🏛️',
    title: 'MUN Regional 17',
    description: 'Modelos, comisiones, delegaciones y asistencia.'
  };

  function injectStyles() {
    if (document.getElementById('rv-mun-system-style')) return;
    const style = document.createElement('style');
    style.id = 'rv-mun-system-style';
    style.textContent = `
      .rv-systems-nav{margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,.10)}
      .rv-systems-label{padding:0 12px 7px;color:rgba(255,255,255,.52);font-size:10px;font-weight:800;letter-spacing:.09em;text-transform:uppercase}
      .rv-system-link{width:100%;display:flex;align-items:center;gap:10px;padding:9px 11px;margin:3px 0;border:0;background:transparent;color:inherit;text-align:left;border-radius:10px;cursor:pointer}
      .rv-system-link:hover{background:rgba(255,255,255,.08)}
      .rv-system-link .rv-system-icon{width:28px;height:28px;display:grid;place-items:center;flex:0 0 28px;border-radius:8px;background:rgba(65,132,255,.20);font-size:15px}
      .rv-system-link .rv-system-copy{min-width:0;display:flex;flex-direction:column;gap:2px}
      .rv-system-link strong{font-size:12px;line-height:1.2;color:#fff}
      .rv-system-link small{font-size:9px;line-height:1.25;color:rgba(255,255,255,.56)}
    `;
    document.head.appendChild(style);
  }

  function openMUN() {
    window.dispatchEvent(new CustomEvent('rv-open-mun'));
  }

  function ensureSidebar() {
    const nav = document.querySelector('.sidebar nav');
    if (!nav || document.getElementById(SIDEBAR_ID)) return;
    nav.insertAdjacentHTML('beforeend', `<div class="rv-systems-nav" id="${SIDEBAR_ID}">
      <div class="rv-systems-label">Sistema</div>
      <button class="rv-system-link" type="button" data-rv-mun>
        <span class="rv-system-icon">${SYSTEM.icon}</span>
        <span class="rv-system-copy"><strong>${SYSTEM.title}</strong><small>${SYSTEM.description}</small></span>
      </button>
    </div>`);
    nav.querySelector('[data-rv-mun]')?.addEventListener('click', openMUN);
  }

  function refresh(){ injectStyles(); ensureSidebar(); }
  const observer = new MutationObserver(refresh);
  observer.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',refresh);
  window.addEventListener('load',refresh);
  setTimeout(refresh,300);
})();
