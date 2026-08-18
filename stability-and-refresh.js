(() => {
  'use strict';
  if (window.__R17_STABILITY_FIX__) return;
  window.__R17_STABILITY_FIX__ = true;

  // Keep the SPA stable: don't allow accidental full reloads from generic UI code.
  const originalReload = window.location.reload.bind(window.location);
  let allowReload = false;
  window.__r17AllowReload = () => { allowReload = true; setTimeout(() => { allowReload = false; }, 2500); };

  // Visual feedback: subtle, intentional motion instead of unstable blinking.
  const style = document.createElement('style');
  style.id = 'r17-stability-motion';
  style.textContent = `
    .r17-action-pulse { animation: r17Pulse 1.8s ease-in-out 2; }
    @keyframes r17Pulse { 0%,100% { transform: translateY(0); box-shadow: none; } 50% { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(8,45,78,.16); } }
    button, .nav-item, .card, [role="button"] { transition: transform .18s ease, box-shadow .18s ease, filter .18s ease, opacity .18s ease; }
    button:hover, .nav-item:hover, [role="button"]:hover { transform: translateY(-1px); }
    button:active, .nav-item:active, [role="button"]:active { transform: translateY(1px) scale(.985); }
    .r17-page-enter { animation: r17Enter .32s ease both; }
    @keyframes r17Enter { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
  `;
  document.head.appendChild(style);

  function refreshAfterSuccessfulAction() {
    // Re-rendering is preferred to reloading. If the app exposes its render/navigation API,
    // let it handle the update; otherwise reload once, explicitly and only after success.
    try {
      if (typeof window.renderApp === 'function') {
        window.renderApp();
        return;
      }
      const active = document.querySelector('.nav-item.active');
      if (active && typeof active.click === 'function') {
        active.click();
        return;
      }
    } catch (e) { console.warn('[R17] refresh render failed', e); }
    try { window.__r17AllowReload(); originalReload(); } catch (e) { console.warn('[R17] reload failed', e); }
  }

  // A successful toast is the safest generic signal because failed validation/errors
  // should never cause a refresh.
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes || []) {
        if (!(node instanceof HTMLElement)) continue;
        const text = (node.textContent || '').trim().toLowerCase();
        const cls = String(node.className || '').toLowerCase();
        const success = cls.includes('success') && /guard|cread|agreg|añad|actualiz|elimin|éxito|exito/.test(text);
        if (success) {
          node.classList.add('r17-action-pulse');
          clearTimeout(window.__r17RefreshTimer);
          window.__r17RefreshTimer = setTimeout(refreshAfterSuccessfulAction, 450);
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Animate important creation/save buttons once when they appear, without constant blinking.
  const buttonObserver = new MutationObserver(() => {
    document.querySelectorAll('button:not([data-r17-animated])').forEach((b) => {
      const t = (b.textContent || '').trim().toLowerCase();
      if (/crear|guardar|añadir|agregar|nuevo|publicar|enviar/.test(t)) {
        b.setAttribute('data-r17-animated', '1');
        b.classList.add('r17-action-pulse');
      }
    });
  });
  buttonObserver.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => buttonObserver.takeRecords(), 100);
})();
