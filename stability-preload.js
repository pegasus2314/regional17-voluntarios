/* Regional 17 — stability preload
   Loads before app.js. Keeps SPA shell stable during data refreshes. */
(() => {
  'use strict';
  if (window.__R17_STABILITY_PRELOAD_V2__) return;
  window.__R17_STABILITY_PRELOAD_V2__ = true;

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

  // app.js rebuilds #app with layout() after data reloads. Replacing the
  // complete shell causes the visible blink and destroys transient UI state.
  // When the incoming shell represents the same view, keep the existing shell;
  // app.js will subsequently render the refreshed #content.
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
        const currentView = mount.querySelector('.topbar h1')?.textContent?.trim() || '';
        const incomingView = incoming.querySelector('.topbar h1')?.textContent?.trim() || '';
        if (currentView && currentView === incomingView) return;
      }
      nativeSet.call(mount, value);
    }
  });
})();
