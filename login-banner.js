/* Banner del login: espera a que app.js cree el login y luego aplica la foto regional. */
(() => {
  'use strict';
  const AVATAR_URL = 'https://ibsmrkwkmcjyekwllxic.supabase.co/storage/v1/object/public/profile-avatars/regional/avatar.jpg';
  let timer = null;
  let observer = null;

  function applyLoginBanner() {
    const brand = document.querySelector('.login-brand');
    if (!brand) return false;

    brand.classList.add('regional-login-banner');
    let image = brand.querySelector('.regional-login-background');

    if (!image) {
      image = document.createElement('img');
      image.className = 'regional-login-background';
      image.alt = 'Regional 17';
      image.decoding = 'async';
      image.loading = 'eager';
      image.src = `${AVATAR_URL}?v=3`;
      brand.insertBefore(image, brand.firstChild);
    } else if (!image.src) {
      image.src = `${AVATAR_URL}?v=3`;
    }

    return true;
  }

  function watchLogin() {
    if (applyLoginBanner()) return;
    clearTimeout(timer);
    timer = setTimeout(watchLogin, 150);
  }

  function start() {
    watchLogin();
    const root = document.getElementById('app') || document.body;
    if (observer) observer.disconnect();
    observer = new MutationObserver(() => {
      if (!document.querySelector('.login-brand')) return;
      applyLoginBanner();
    });
    observer.observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
