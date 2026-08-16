/* Regional 17 Volunteers — stable calendar navigation bridge */
(() => {
  'use strict';

  const CALENDAR_KEY = 'r17-calendar-nav';
  let observer = null;

  function installButton() {
    const nav = document.querySelector('.sidebar nav');
    if (!nav) return;
    if (nav.querySelector(`[data-${CALENDAR_KEY}]`)) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nav-item';
    button.setAttribute(`data-${CALENDAR_KEY}`, '1');
    button.innerHTML = '<span>▦</span>Calendario';

    // Capture the click before app.js can treat "calendar" as an unknown view.
    button.addEventListener('click', async event => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      nav.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      const title = document.querySelector('.topbar h1');
      if (title) title.textContent = 'Calendario y cronograma';

      if (window.R17Calendar?.open) {
        await window.R17Calendar.open();
      }
    }, true);

    nav.appendChild(button);
  }

  function start() {
    installButton();
    const root = document.getElementById('app') || document.body;
    observer = new MutationObserver(() => installButton());
    observer.observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();