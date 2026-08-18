(() => {
  'use strict';
  if (window.__R17_RUNTIME_FIX_V4__) return;
  window.__R17_RUNTIME_FIX_V4__ = true;

  const css = document.createElement('style');
  css.id = 'r17-runtime-stability-v4';
  css.textContent = `
    *, *::before, *::after { animation: none !important; }
    html, body { scroll-behavior: auto !important; }
    button, a, [role="button"], .nav-item, img, .card, .panel, .stat-card,
    .dashboard-card, .mun-card { animation: none !important; transform: none !important; }
    button:active, .nav-item:active, [role="button"]:active { transform: scale(.99) !important; }
  `;
  document.head.appendChild(css);

  let preservedChat = null;
  let chatWasOpen = false;
  let appInitialized = false;

  function captureChat() {
    const chat = document.querySelector('.rv-chat');
    if (chat) { preservedChat = chat; chatWasOpen = true; }
  }

  function restoreChat() {
    if (!chatWasOpen || !preservedChat) return;
    const content = document.getElementById('content');
    if (!content || content.querySelector('.rv-chat')) return;
    content.replaceChildren(preservedChat);
    const title = document.querySelector('.topbar h1');
    if (title) title.textContent = 'Chat grupal';
    document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
    document.querySelector('[data-rv-chat]')?.classList.add('active');
  }

  const desc = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  if (desc?.set && desc?.get) {
    Object.defineProperty(Element.prototype, 'innerHTML', {
      configurable: desc.configurable,
      enumerable: desc.enumerable,
      get: desc.get,
      set(value) {
        if (this.id === 'app') {
          const isLayout = typeof value === 'string' && value.includes('class="shell"');
          if (appInitialized && isLayout && chatWasOpen) {
            captureChat();
            desc.set.call(this, value);
            queueMicrotask(restoreChat);
            return;
          }
        }
        desc.set.call(this, value);
        if (this.id === 'app') {
          appInitialized = true;
          queueMicrotask(restoreChat);
        }
      }
    });
  }

  new MutationObserver(() => {
    if (chatWasOpen && preservedChat && !document.querySelector('.rv-chat')) queueMicrotask(restoreChat);
  }).observe(document.documentElement, { childList:true, subtree:true });

  window.addEventListener('r17-chat-open', () => {
    chatWasOpen = true;
    preservedChat = document.querySelector('.rv-chat') || preservedChat;
  });
  window.addEventListener('r17-chat-close', () => {
    chatWasOpen = false;
    preservedChat = null;
  });
})();
