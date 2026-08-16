/* Perfil del logo R17 de la barra lateral */
(() => {
  'use strict';
  const BUCKET = 'profile-avatars';
  const AVATAR_PATH = 'regional/avatar.jpg';
  let client = null, userId = null, role = null, observer = null, timer = null;

  async function init() {
    if (!window.supabase?.createClient || !window.RV_CONFIG?.SUPABASE_URL || !window.RV_CONFIG?.SUPABASE_ANON_KEY) return false;
    if (!client) client = window.supabase.createClient(window.RV_CONFIG.SUPABASE_URL, window.RV_CONFIG.SUPABASE_ANON_KEY);
    const { data, error } = await client.auth.getSession();
    if (error) return false;
    userId = data?.session?.user?.id || null;
    if (!userId) return false;
    const { data: profile } = await client.from('profiles').select('role').eq('id', userId).maybeSingle();
    role = profile?.role || null;
    return true;
  }

  function styleLogo(logo) {
    logo.style.cssText += ';position:relative!important;width:76px!important;height:76px!important;min-width:76px!important;min-height:76px!important;border-radius:50%!important;overflow:hidden!important;display:grid!important;place-items:center!important;background:var(--gold)!important;color:#3c2b05!important;font-weight:900!important;font-size:20px!important;box-shadow:0 5px 18px rgba(0,0,0,.24)!important;';
    logo.title = role === 'admin' ? 'Cambiar imagen de Regional 17' : 'Imagen de Regional 17';
    logo.style.cursor = role === 'admin' ? 'pointer' : 'default';
  }

  async function ensureProfileLogo() {
    const logo = document.querySelector('.brand-mark');
    if (!logo) return;
    await init();
    styleLogo(logo);

    if (role === 'admin') {
      let input = logo.querySelector('.r17-profile-input');
      if (!input) {
        input = document.createElement('input');
        input.className = 'r17-profile-input';
        input.type = 'file';
        input.accept = 'image/png,image/jpeg,image/webp';
        input.setAttribute('aria-label', 'Seleccionar imagen de Regional 17');
        input.style.cssText = 'position:absolute!important;inset:0!important;width:100%!important;height:100%!important;opacity:0!important;cursor:pointer!important;z-index:70!important;margin:0!important;padding:0!important;';
        input.addEventListener('click', e => e.stopPropagation());
        input.addEventListener('change', e => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (file) upload(file);
        });
        logo.appendChild(input);
      }

      let camera = logo.querySelector('.r17-profile-camera');
      if (!camera) {
        camera = document.createElement('span');
        camera.className = 'r17-profile-camera';
        camera.textContent = '📷';
        camera.title = 'Cambiar imagen';
        camera.style.cssText = 'position:absolute!important;right:3px!important;bottom:3px!important;width:34px!important;height:34px!important;border-radius:50%!important;background:#fff!important;border:3px solid #071b35!important;display:grid!important;place-items:center!important;font-size:18px!important;line-height:1!important;z-index:60!important;pointer-events:none!important;box-shadow:0 3px 10px rgba(0,0,0,.35)!important;';
        logo.appendChild(camera);
      }
    } else {
      logo.querySelector('.r17-profile-input')?.remove();
      logo.querySelector('.r17-profile-camera')?.remove();
    }

    if (logo.dataset.avatarLoaded !== '1') {
      logo.dataset.avatarLoaded = '1';
      loadAvatar(logo);
    }
  }

  async function loadAvatar(logo) {
    if (!client) return;
    const publicUrl = client.storage.from(BUCKET).getPublicUrl(AVATAR_PATH).data?.publicUrl;
    if (!publicUrl) return;
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => applyImage(logo, publicUrl);
    img.onerror = () => {};
    img.src = publicUrl;
  }

  function applyImage(logo, publicUrl) {
    if (!document.contains(logo)) return;
    let image = logo.querySelector('.r17-profile-image');
    if (!image) {
      image = document.createElement('img');
      image.className = 'r17-profile-image';
      image.alt = 'Imagen de Regional 17';
      image.setAttribute('aria-hidden', 'true');
      image.style.cssText = 'position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important;border-radius:50%!important;z-index:2!important;display:block!important;margin:0!important;padding:0!important;';
      logo.appendChild(image);
    }
    if (image.src !== publicUrl) image.src = publicUrl;
    logo.style.color = 'transparent';
  }

  async function upload(file) {
    if (role !== 'admin') return;
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return alert('Selecciona una imagen JPG, PNG o WEBP.');
    if (file.size > 4 * 1024 * 1024) return alert('La imagen debe pesar menos de 4 MB.');
    if (!await init() || role !== 'admin') return alert('Solo los administradores pueden cambiar la imagen de Regional 17.');

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const max = 700, scale = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) return alert('No se pudo procesar la imagen.');
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async blob => {
          if (!blob) return alert('No se pudo procesar la imagen.');
          const { error } = await client.storage.from(BUCKET).upload(AVATAR_PATH, blob, { contentType:'image/jpeg', upsert:true, cacheControl:'86400' });
          if (error) {
            console.error('R17 avatar upload:', error);
            return alert(`No se pudo guardar la foto: ${error.message || 'error de Storage'}`);
          }
          const logo = document.querySelector('.brand-mark');
          const publicUrl = client.storage.from(BUCKET).getPublicUrl(AVATAR_PATH).data?.publicUrl;
          if (logo && publicUrl) applyImage(logo, `${publicUrl}?v=${Date.now()}`);
        }, 'image/jpeg', .86);
      };
      image.onerror = () => alert('No se pudo leer la imagen.');
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function start() {
    ensureProfileLogo();
    if (observer) return;
    observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => ensureProfileLogo(), 120);
    });
    observer.observe(document.getElementById('app') || document.body, { childList:true, subtree:true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once:true });
  else start();
})();
