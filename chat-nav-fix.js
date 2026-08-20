(() => {
  'use strict';
  const install = () => {
    const nav = document.querySelector('.sidebar nav');
    if (!nav || nav.querySelector('[data-r17-chat-nav]')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-item';
    btn.dataset.r17ChatNav = '1';
    btn.innerHTML = '<span>💬</span>Chat grupal';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      nav.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      const title = document.querySelector('.topbar h1');
      if (title) title.textContent = 'Chat grupal';
      if (typeof window.openRegionalChat === 'function') window.openRegionalChat();
      else console.error('[Regional17] openRegionalChat no está disponible');
    });
    nav.appendChild(btn);
  };
  const observer = new MutationObserver(install);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  [0, 100, 500, 1500, 3000].forEach(ms => setTimeout(install, ms));
})();
