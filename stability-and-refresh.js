(() => {
  'use strict';
  if (window.__R17_STABILITY_FIX_V2__) return;
  window.__R17_STABILITY_FIX_V2__ = true;

  // SPA: never force a full page reload after a save.
  // Generic reloads were destroying the chat and resetting MUN views.
  window.__r17AllowReload = () => false;

  const style = document.createElement('style');
  style.id = 'r17-stability-motion-v2';
  style.textContent = `
    html, body, #app { max-width: 100%; overflow-x: hidden; }

    /* No continuous blinking, wobbling or shaking. */
    .r17-action-pulse { animation: none !important; transform: none !important; box-shadow: none !important; }
    *, *::before, *::after { animation-duration: 0s; }

    /* Stable controls: visual feedback only on the actual click. */
    button, .nav-item, [role="button"] {
      transition: background-color .16s ease, border-color .16s ease,
                  box-shadow .16s ease, opacity .16s ease, color .16s ease;
      transform: none !important;
    }
    button:hover, .nav-item:hover, [role="button"]:hover { transform: none !important; }
    button:active, .nav-item:active, [role="button"]:active { transform: scale(.985) !important; }

    /* Only a tiny fade when a view is explicitly entered. */
    .r17-page-enter { animation: r17FadeIn .18s ease both !important; }
    @keyframes r17FadeIn { from { opacity: .96; } to { opacity: 1; } }

    /* Cards must not move while scrolling or hovering. */
    .card, .panel, .stat-card, .dashboard-card, .mun-card {
      transition: box-shadow .16s ease, border-color .16s ease, background-color .16s ease !important;
      transform: none !important;
    }
  `;
  document.head.appendChild(style);

  // Remove pulse classes left by older scripts.
  function stabilize() {
    document.querySelectorAll('.r17-action-pulse').forEach(el => {
      el.classList.remove('r17-action-pulse');
      el.style.animation = 'none';
      el.style.transform = 'none';
    });
  }
  stabilize();
  new MutationObserver(stabilize).observe(document.body, { childList: true, subtree: true });

  // IMPORTANT: do not watch success toasts and reload/click navigation.
  // Each feature must update its own DOM/state immediately after saving.
  window.r17NotifyDataUpdated = function(detail = {}) {
    window.dispatchEvent(new CustomEvent('r17:data-updated', { detail }));
  };
})();
