/* Banner del login: usa la foto regional compartida como imagen real para evitar problemas de background CSS. */
(() => {
  'use strict';
  const AVATAR_URL = 'https://ibsmrkwkmcjyekwllxic.supabase.co/storage/v1/object/public/profile-avatars/regional/avatar.jpg';

  function applyLoginBanner() {
    const brand = document.querySelector('.login-brand');
    if (!brand) return;

    brand.classList.add('regional-login-banner');
    let image = brand.querySelector('.regional-login-background');
    if (!image) {
      image = document.createElement('img');
      image.className = 'regional-login-background';
      image.alt = 'Regional 17';
      image.src = `${AVATAR_URL}?v=2`;
      brand.prepend(image);
    }
  }

  const start = () => {
    applyLoginBanner();
    const root = document.getElementById('app') || document.body;
    new MutationObserver(applyLoginBanner).observe(root, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
