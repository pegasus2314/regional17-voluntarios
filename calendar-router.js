/* Regional 17 Volunteers — stable calendar navigation bridge */
(() => {
  'use strict';

  const KEY = 'r17-calendar-nav';
  const mount = document.getElementById('app');
  let calendarActive = false;
  let originalInnerHTML = null;

  function installButton() {
    const nav = document.querySelector('.sidebar nav');
    if (!nav || nav.querySelector(`[data-${KEY}]`)) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nav-item';
    button.setAttribute(`data-${KEY}`, '1');
    button.innerHTML = '<span>▦</span>Calendario';

    // Capture the click before app.js can process it as an unknown view.
    button.addEventListener('click', async event => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      calendarActive = true;

      nav.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      const title = document.querySelector('.topbar h1');
      if (title) title.textContent = 'Calendario y cronograma';

      if (window.R17Calendar?.open) await window.R17Calendar.open();
    }, true);

    nav.appendChild(button);
  }

  function clearCalendarState() {
    calendarActive = false;
  }

  function protectMount() {
    if (!mount || originalInnerHTML) return;
    const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    if (!descriptor?.get || !descriptor?.set) return;
    originalInnerHTML = descriptor;

    Object.defineProperty(mount, 'innerHTML', {
      configurable: true,
      enumerable: descriptor.enumerable,
      get() { return descriptor.get.call(this); },
      set(value) {
        // While Calendario is open, ignore unrelated full-app renders. This keeps
        // the calendar mounted instead of letting another navigation helper wipe it.
        if (calendarActive) return;
        descriptor.set.call(this, value);
        queueMicrotask(installButton);
      }
    });
  }

  function start() {
    protectMount();
    installButton();

    // app.js rebuilds the sidebar through #app.innerHTML. We deliberately do not
    // observe the DOM or poll: the mount setter above re-installs the button once
    // per legitimate navigation render.
    document.addEventListener('click', event => {
      const target = event.target?.closest?.('[data-view]');
      if (target) clearCalendarState();
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
