/* Regional 17 — stability preload
   Loads before app.js. Keeps SPA shell stable during data refreshes and navigation. */
(() => {
  'use strict';
  if (window.__R17_STABILITY_PRELOAD_V3__) return;
  window.__R17_STABILITY_PRELOAD_V3__ = true;

  const mount = document.getElementById('app');
  if (!mount) return;

  // Prevent an initial white/unstyled flash while the application boots.
  document.documentElement.classList.add('r17-booting');
  const reveal = () => {
    document.documentElement.classList.remove('r17-booting');
    document.documentElement.classList.add('r17-ready');
  };
  window.addEventListener('load', () => setTimeout(reveal, 40), { once: true });
  setTimeout(reveal, 1200);

  // app.js calls layout() during navigation and some refresh flows. Replacing
  // #app destroys the sidebar/header DOM, which produces the visible jump.
  // Keep the existing shell and synchronize only the small pieces that change:
  // active navigation item, page title and quick action label.
  const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerHTML');
  if (!descriptor?.set || !descriptor?.get) return;
  const nativeGet = descriptor.get;
  const nativeSet = descriptor.set;

  Object.defineProperty(mount, 'innerHTML', {
    configurable: true,
    enumerable: false,
    get: () => nativeGet.call(mount),
    set(value) {
      const html = String(value ?? '');
      const current = nativeGet.call(mount);

      if (html.includes('class="shell"') && current.includes('class="shell"')) {
        const incoming = document.createElement('div');
        incoming.innerHTML = html;

        // Keep the shell itself mounted. Only synchronize navigation state.
        const currentNav = mount.querySelector('.sidebar nav');
        const incomingNav = incoming.querySelector('.sidebar nav');
        if (currentNav && incomingNav) {
          const active = incomingNav.querySelector('.nav-item.active')?.dataset.view || '';
          currentNav.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', Boolean(active && item.dataset.view === active));
          });
        }

        const currentTitle = mount.querySelector('.topbar h1');
        const incomingTitle = incoming.querySelector('.topbar h1');
        if (currentTitle && incomingTitle) currentTitle.textContent = incomingTitle.textContent;

        const currentQuick = mount.querySelector('#quickAdd');
        const incomingQuick = incoming.querySelector('#quickAdd');
        if (currentQuick && incomingQuick) {
          currentQuick.textContent = incomingQuick.textContent;
        } else if (currentQuick && !incomingQuick) {
          currentQuick.remove();
        }

        // Never replace the shell during a normal SPA navigation or refresh.
        return;
      }

      nativeSet.call(mount, value);
    }
  });
})();
