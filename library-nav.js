/* Regional 17 Volunteers — stable Library navigation */
(() => {
  'use strict';

  function install() {
    const nav = document.querySelector('.sidebar nav');
    if (!nav || !window.R17Library?.open) return;
    if (nav.querySelector('[data-r17-tool="library"]')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nav-item';
    button.dataset.r17Tool = 'library';
    button.innerHTML = '<span>📚</span>Biblioteca';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      document.querySelectorAll('[data-view], [data-r17-tool]').forEach(el => el.classList.remove('active'));
      button.classList.add('active');
      document.querySelector('.topbar h1')?.replaceChildren(document.createTextNode('Biblioteca'));
      document.querySelector('.sidebar')?.classList.remove('open');
      window.R17Library.open();
    });
    nav.appendChild(button);
  }

  function boot() {
    install();
    const timer = setInterval(() => {
      install();
      if (document.querySelector('[data-r17-tool="library"]')) clearInterval(timer);
    }, 500);
    setTimeout(() => clearInterval(timer), 10000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
