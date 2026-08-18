/* Regional 17 — password visibility control */
(() => {
  'use strict';

  const STYLE_ID = 'rv-password-toggle-style';
  const BUTTON_ID = 'rv-password-toggle';

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .rv-password-wrap { position: relative !important; width: 100% !important; }
      .rv-password-wrap > input { width: 100% !important; padding-right: 48px !important; box-sizing: border-box !important; }
      .rv-password-toggle {
        position: absolute !important;
        right: 10px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        width: 34px !important;
        height: 34px !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
        border-radius: 9px !important;
        background: transparent !important;
        color: #526070 !important;
        cursor: pointer !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        z-index: 20 !important;
        font: inherit !important;
        line-height: 1 !important;
      }
      .rv-password-toggle:hover { background: rgba(100,116,139,.12) !important; color: #172033 !important; }
      .rv-password-toggle:focus-visible { outline: 2px solid #2563eb !important; outline-offset: 2px !important; }
      .rv-password-toggle svg { width: 20px !important; height: 20px !important; pointer-events: none !important; }
      [data-theme="dark"] .rv-password-toggle,
      .dark .rv-password-toggle,
      body.dark .rv-password-toggle { color: #cbd5e1 !important; }
      [data-theme="dark"] .rv-password-toggle:hover,
      .dark .rv-password-toggle:hover,
      body.dark .rv-password-toggle:hover { background: rgba(148,163,184,.16) !important; color: #fff !important; }
      .rv-password-wrap > input[type="password"],
      .rv-password-wrap > input[type="text"] { color: inherit !important; -webkit-text-fill-color: currentColor !important; opacity: 1 !important; }
      .rv-password-wrap > input:-webkit-autofill,
      .rv-password-wrap > input:-webkit-autofill:hover,
      .rv-password-wrap > input:-webkit-autofill:focus {
        -webkit-text-fill-color: currentColor !important;
        transition: background-color 9999s ease-out 0s !important;
      }
    `;
    document.head.appendChild(style);
  }

  const eye = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></svg>`;
  const eyeOff = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 3 18 18"/><path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.8"/><path d="M6.1 6.1C3.4 8 2 12 2 12s3.5 7 10 7a10.7 10.7 0 0 0 4.2-.9"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>`;

  function setup() {
    const input = document.querySelector('#login input[name="password"]');
    if (!input || document.getElementById(BUTTON_ID)) return;

    installStyles();

    let wrapper = input.parentElement;
    if (!wrapper || wrapper.tagName.toLowerCase() === 'field') {
      wrapper = document.createElement('div');
      wrapper.className = 'rv-password-wrap';
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);
    } else {
      wrapper.classList.add('rv-password-wrap');
    }

    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.type = 'button';
    button.className = 'rv-password-toggle';
    button.setAttribute('aria-label', 'Mostrar contraseña');
    button.setAttribute('title', 'Mostrar contraseña');
    button.innerHTML = eye();

    button.addEventListener('click', () => {
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      button.innerHTML = showing ? eye() : eyeOff();
      button.setAttribute('aria-label', showing ? 'Mostrar contraseña' : 'Ocultar contraseña');
      button.setAttribute('title', showing ? 'Mostrar contraseña' : 'Ocultar contraseña');
      input.focus();
    });

    wrapper.appendChild(button);
  }

  const observer = new MutationObserver(setup);
  function start() {
    installStyles();
    setup();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
