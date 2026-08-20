/* Regional 17 — stability preload
   Loads before app.js. Keeps the SPA shell physically stable while app.js
   performs its existing layout/render calls. */
(() => {
  'use strict';
  if (window.__R17_STABILITY_PRELOAD_V5__) return;
  window.__R17_STABILITY_PRELOAD_V5__ = true;

  const mount = document.getElementById('app');
  if (!mount) return;

  const bootStyle = document.createElement('style');
  bootStyle.id = 'r17-stability-style';
  bootStyle.textContent = `
    html { scrollbar-gutter: stable both-edges; }
    html.r17-booting body { visibility:hidden; }
    html.r17-ready body { visibility:visible; }
    .shell { min-height:100vh; height:100vh; overflow:hidden; }
    .sidebar { flex:0 0 245px; width:245px; min-width:245px; max-width:245px; height:100vh; overflow:hidden; contain:layout paint style; }
    .sidebar nav { flex:0 0 auto; min-height:0; width:100%; }
    .sidebar .nav-item,
    .sidebar .nav-item:hover,
    .sidebar .nav-item:focus,
    .sidebar .nav-item:focus-visible,
    .sidebar .nav-item:active,
    .sidebar .nav-item.active {
      width:100%; height:39px; min-height:39px; max-height:39px;
      box-sizing:border-box; margin:0; padding:0 12px;
      flex:0 0 39px; min-width:0;
      position:relative; top:0; left:0;
      transform:none !important; translate:none !important; scale:none !important;
      line-height:39px; font-weight:600 !important;
      transition:background-color .12s ease,color .12s ease !important;
      will-change:auto !important;
    }
    .sidebar .nav-item span { width:18px; min-width:18px; flex:0 0 18px; }
    .main { min-width:0; min-height:100vh; height:100vh; overflow-x:hidden; overflow-y:auto; scrollbar-gutter:stable; }
    .main > #content { min-height:calc(100vh - 78px); }
    .topbar { min-height:78px; }
    .top-actions { min-width:180px; }
    #quickAdd { min-width:132px; }
  `;
  (document.head || document.documentElement).appendChild(bootStyle);
  document.documentElement.classList.add('r17-booting');

  let revealed = false;
  let observer = null;
  const reveal = () => {
    if (revealed || !mount.firstElementChild) return;
    revealed = true;
    document.documentElement.classList.remove('r17-booting');
    document.documentElement.classList.add('r17-ready');
    observer?.disconnect();
  };

  observer = new MutationObserver(() => {
    if (!mount.firstElementChild) return;
    requestAnimationFrame(() => requestAnimationFrame(reveal));
  });
  observer.observe(mount, {childList:true});
  if (mount.firstElementChild) requestAnimationFrame(() => requestAnimationFrame(reveal));

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

      // app.js still calls layout() on navigation. Keep the existing shell
      // nodes alive so navigation cannot replace the sidebar/topbar DOM.
      if (html.includes('class="shell"') && current.includes('class="shell"')) {
        const incoming = document.createElement('div');
        incoming.innerHTML = html;

        const currentNav = mount.querySelector('.sidebar nav');
        const incomingNav = incoming.querySelector('.sidebar nav');
        if (currentNav && incomingNav) {
          const active = incomingNav.querySelector('.nav-item.active')?.dataset.view || '';
          currentNav.querySelectorAll('.nav-item').forEach(item => {
            const on = Boolean(active && item.dataset.view === active);
            item.classList.toggle('active', on);
            item.setAttribute('aria-current', on ? 'page' : 'false');
          });
        }

        const currentTitle = mount.querySelector('.topbar h1');
        const incomingTitle = incoming.querySelector('.topbar h1');
        if (currentTitle && incomingTitle) currentTitle.textContent = incomingTitle.textContent;

        // Keep a stable action slot. Removing/recreating this button can alter
        // the topbar's intrinsic width during navigation.
        const currentActions = mount.querySelector('.top-actions');
        const incomingActions = incoming.querySelector('.top-actions');
        const currentQuick = mount.querySelector('#quickAdd');
        const incomingQuick = incoming.querySelector('#quickAdd');
        if (currentActions && incomingActions) {
          if (currentQuick && incomingQuick) {
            currentQuick.textContent = incomingQuick.textContent;
            currentQuick.style.visibility = 'visible';
            currentQuick.setAttribute('aria-hidden', 'false');
          } else if (currentQuick && !incomingQuick) {
            currentQuick.style.visibility = 'hidden';
            currentQuick.setAttribute('aria-hidden', 'true');
          }
        }

        return;
      }

      nativeSet.call(mount, value);
      if (mount.firstElementChild) requestAnimationFrame(() => requestAnimationFrame(reveal));
    }
  });
})();
