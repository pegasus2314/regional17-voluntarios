(() => {
  'use strict';
  if (window.__R17_STABILITY_FIX_V3__) return;
  window.__R17_STABILITY_FIX_V3__ = true;

  // Never perform a full browser reload after saves. The application is an SPA.
  window.__r17AllowReload = () => false;

  const style = document.createElement('style');
  style.id = 'r17-stability-motion-v3';
  style.textContent = `
    html, body, #app { max-width: 100%; overflow-x: hidden; }

    /* Disable legacy pulse effects without globally killing every animation. */
    .r17-action-pulse {
      animation: none !important;
      transform: none !important;
      box-shadow: none !important;
    }

    /* Stable controls: only lightweight visual feedback. */
    button, .nav-item, [role="button"] {
      transition: background-color .14s ease, border-color .14s ease,
                  box-shadow .14s ease, opacity .14s ease, color .14s ease;
      transform: none;
    }
    button:hover, .nav-item:hover, [role="button"]:hover { transform: none; }
    button:active, .nav-item:active, [role="button"]:active { transform: scale(.985); }

    /* Explicit page transitions only. Data refreshes must not animate the whole page. */
    .r17-page-enter { animation: r17FadeIn .16s ease both; }
    @keyframes r17FadeIn { from { opacity: .97; } to { opacity: 1; } }

    .card, .panel, .stat-card, .dashboard-card, .mun-card {
      transition: box-shadow .14s ease, border-color .14s ease, background-color .14s ease;
      transform: none;
    }
  `;
  document.head.appendChild(style);

  // Older versions used a MutationObserver on the entire document and scanned
  // every mutation. That created avoidable main-thread work during table renders.
  // Only inspect pulse classes on a small throttled schedule, and only when a
  // mutation actually contains a node that could carry the legacy class.
  let scheduled = false;
  function stabilizePulseNodes() {
    scheduled = false;
    document.querySelectorAll('.r17-action-pulse').forEach(el => {
      el.classList.remove('r17-action-pulse');
      el.style.animation = 'none';
      el.style.transform = 'none';
    });
  }

  const observer = new MutationObserver(mutations => {
    let relevant = false;
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes || []) {
        if (node.nodeType === 1 &&
            (node.matches?.('.r17-action-pulse') || node.querySelector?.('.r17-action-pulse'))) {
          relevant = true;
          break;
        }
      }
      if (relevant) break;
    }
    if (!relevant || scheduled) return;
    scheduled = true;
    requestAnimationFrame(stabilizePulseNodes);
  });

  if (document.body) observer.observe(document.body, { childList: true, subtree: true });

  window.r17NotifyDataUpdated = function(detail = {}) {
    window.dispatchEvent(new CustomEvent('r17:data-updated', { detail }));
  };
})();
