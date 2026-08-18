/* Entrada visible al sistema MUN Regional 17 */
(() => {
  'use strict';
  const install = () => {
    const nav = document.querySelector('.sidebar nav');
    if (!nav || nav.querySelector('[data-mun-entry]')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-item';
    btn.dataset.munEntry = '1';
    btn.innerHTML = '<span>🏛️</span>MUN Regional 17';
    btn.title = 'Modelos, comisiones, delegaciones y evaluación';
    btn.onclick = () => window.dispatchEvent(new CustomEvent('rv-open-evaluation'));
    nav.appendChild(btn);
  };
  const observer = new MutationObserver(install);
  const start = () => {
    install();
    const app = document.getElementById('app');
    if (app) observer.observe(app, {childList:true, subtree:true});
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
