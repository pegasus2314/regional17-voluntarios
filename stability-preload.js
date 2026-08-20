/* Regional 17 — stability preload
   Loads before app.js. Keeps SPA shell stable during data refreshes and navigation. */
(() => {
  'use strict';
  if (window.__R17_STABILITY_PRELOAD_V4__) return;
  window.__R17_STABILITY_PRELOAD_V4__ = true;

  const mount = document.getElementById('app');
  if (!mount) return;

  // Keep the viewport geometry stable before the application mounts.
  const bootStyle = document.createElement('style');
  bootStyle.id = 'r17-stability-style';
  bootStyle.textContent = `
    html { scrollbar-gutter: stable; }
    html.r17-booting body { visibility:hidden; }
    html.r17-ready body { visibility:visible; }
    .shell { min-height:100vh; overflow:hidden; }
    .sidebar { flex:0 0 245px; width:245px; min-width:245px; max-width:245px; overflow:hidden; contain:layout paint; }
    .sidebar nav { flex:0 0 auto; min-height:0; }
    .main { min-width:0; min-height:100vh; overflow-x:hidden; }
    .main > #content { min-height:calc(100vh - 78px); }
  `;
  (document.head || document.documentElement).appendChild(bootStyle);
  document.documentElement.classList.add('r17-booting');

  let revealed = false;
  const reveal = () => {
    if (revealed) return;
    revealed = true;
    document.documentElement.classList.remove('r17-booting');
    document.documentElement.classList.add('r17-ready');
    observer?.disconnect();
  };

  // Reveal only after the application has actually mounted a login or shell.
  // This avoids both FOUC and the flash caused by revealing on window.load.
  const observer = new MutationObserver(() => {
    if (!mount.firstElementChild) return;
    requestAnimationFrame(() => requestAnimationFrame(reveal));
  });
  observer.observe(mount, {childList:true});
  if (mount.firstElementChild) requestAnimationFrame(() => requestAnimationFrame(reveal));

  // app.js calls layout() during navigation and refresh flows. Replacing #app
  // destroys the sidebar/header DOM. Keep the existing shell mounted and sync
  // only the small pieces that genuinely change.
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

        const currentNav = mount.querySelector('.sidebar nav');
        const incomingNav = incoming.querySelector('.sidebar nav');
        if (currentNav && incomingNav) {
          const active = incomingNav.querySelector('.nav-item.active')?.dataset.view || '';
          currentNav.querySelectorAll('.nav-item').forEach(item => {
            const shouldBeActive = Boolean(active && item.dataset.view === active);
            item.classList.toggle('active', shouldBeActive);
            item.setAttribute('aria-current', shouldBeActive ? 'page' : 'false');
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

        // Intentionally do not replace the shell. render() will update #content.
        return;
      }

      nativeSet.call(mount, value);
      if (mount.firstElementChild) requestAnimationFrame(() => requestAnimationFrame(reveal));
    }
  });
})();
