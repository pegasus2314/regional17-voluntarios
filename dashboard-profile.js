/* Perfil del círculo principal del Dashboard */
(() => {
  'use strict';
  const BUCKET = 'profile-avatars';
  let client = null;
  let userId = null;
  let observer = null;
  let timer = null;

  async function init() {
    if (!window.supabase?.createClient || !window.RV_CONFIG?.SUPABASE_URL || !window.RV_CONFIG?.SUPABASE_ANON_KEY) return false;
    if (!client) client = window.supabase.createClient(window.RV_CONFIG.SUPABASE_URL, window.RV_CONFIG.SUPABASE_ANON_KEY);
    const { data, error } = await client.auth.getSession();
    if (error) return false;
    userId = data?.session?.user?.id || null;
    return !!userId;
  }

  function addControl() {
    const orb = document.querySelector('.hero-orb');
    if (!orb) return;
    orb.classList.add('dashboard-profile-orb');
    orb.dataset.profileControl = '1';

    let input = orb.querySelector('.dashboard-avatar-input');
    if (!input) {
      input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/png,image/jpeg,image/webp';
      input.className = 'dashboard-avatar-input';
      input.setAttribute('aria-label', 'Cambiar imagen de perfil');
      input.addEventListener('change', e => upload(e.target.files?.[0]));
      orb.appendChild(input);
    }

    let camera = orb.querySelector('.dashboard-avatar-camera');
    if (!camera) {
      camera = document.createElement('span');
      camera.className = 'dashboard-avatar-camera';
      camera.textContent = '📷';
      camera.title = 'Cambiar imagen de perfil';
      camera.setAttribute('aria-hidden', 'true');
      orb.appendChild(camera);
    }

    loadImage(orb);
  }

  async function loadImage(orb) {
    if (!await init()) return;
    const { data } = client.storage.from(BUCKET).getPublicUrl(`${userId}/avatar.jpg`);
    if (!data?.publicUrl) return;
    const url = `${data.publicUrl}?v=${Date.now()}`;
    const img = new Image();
    img.onload = () => {
      if (!document.contains(orb)) return;
      orb.style.backgroundImage = `url("${url}")`;
      orb.classList.add('has-profile-image');
      orb.querySelectorAll(':scope > .dashboard-avatar-input, :scope > .dashboard-avatar-camera').forEach(el => el.remove());
      const input = document.createElement('input');
      input.type = 'file'; input.accept = 'image/png,image/jpeg,image/webp';
      input.className = 'dashboard-avatar-input';
      input.setAttribute('aria-label', 'Cambiar imagen de perfil');
      input.addEventListener('change', e => upload(e.target.files?.[0]));
      const camera = document.createElement('span');
      camera.className = 'dashboard-avatar-camera';
      camera.textContent = '📷';
      camera.title = 'Cambiar imagen de perfil';
      camera.setAttribute('aria-hidden', 'true');
      orb.append(input, camera);
    };
    img.onerror = () => {};
    img.src = url;
  }

  async function upload(file) {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return alert('Selecciona una imagen JPG, PNG o WEBP.');
    if (file.size > 4 * 1024 * 1024) return alert('La imagen debe pesar menos de 4 MB.');
    if (!await init()) return alert('No se encontró la sesión del usuario.');

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const max = 700;
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) return alert('No se pudo procesar la imagen.');
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async blob => {
          if (!blob) return alert('No se pudo procesar la imagen.');
          const { error } = await client.storage.from(BUCKET).upload(`${userId}/avatar.jpg`, blob, {
            contentType: 'image/jpeg', upsert: true, cacheControl: '3600'
          });
          if (error) return alert(`No se pudo guardar la foto: ${error.message || 'error de Storage'}`);
          const orb = document.querySelector('.hero-orb');
          if (orb) {
            const publicUrl = client.storage.from(BUCKET).getPublicUrl(`${userId}/avatar.jpg`).data.publicUrl;
            orb.style.backgroundImage = `url("${publicUrl}?v=${Date.now()}")`;
            orb.classList.add('has-profile-image');
            addControl();
          }
        }, 'image/jpeg', .84);
      };
      image.onerror = () => alert('No se pudo leer la imagen.');
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function start() {
    addControl();
    if (observer) return;
    observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(addControl, 30);
    });
    observer.observe(document.getElementById('app') || document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
