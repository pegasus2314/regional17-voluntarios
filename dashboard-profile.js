/* Perfil del logo R17 de la barra lateral */
(() => {
  'use strict';
  const BUCKET = 'profile-avatars';
  let client = null, userId = null, observer = null, timer = null;

  async function init() {
    if (!window.supabase?.createClient || !window.RV_CONFIG?.SUPABASE_URL || !window.RV_CONFIG?.SUPABASE_ANON_KEY) return false;
    if (!client) client = window.supabase.createClient(window.RV_CONFIG.SUPABASE_URL, window.RV_CONFIG.SUPABASE_ANON_KEY);
    const { data, error } = await client.auth.getSession();
    if (error) return false;
    userId = data?.session?.user?.id || null;
    return !!userId;
  }

  function ensureProfileLogo() {
    const logo = document.querySelector('.brand-mark');
    if (!logo) return;

    logo.style.cssText += ';position:relative!important;width:76px!important;height:76px!important;min-width:76px!important;min-height:76px!important;border-radius:50%!important;overflow:hidden!important;display:grid!important;place-items:center!important;background:var(--gold)!important;color:#3c2b05!important;font-weight:900!important;font-size:20px!important;cursor:pointer!important;box-shadow:0 5px 18px rgba(0,0,0,.24)!important;';
    logo.title = 'Cambiar imagen de perfil';

    let input = logo.querySelector('.r17-profile-input');
    if (!input) {
      input = document.createElement('input');
      input.className = 'r17-profile-input';
      input.type = 'file';
      input.accept = 'image/png,image/jpeg,image/webp';
      input.style.cssText = 'position:absolute!important;inset:0!important;width:100%!important;height:100%!important;opacity:0!important;cursor:pointer!important;z-index:20!important;';
      input.addEventListener('change', e => {
        const file = e.target.files?.[0]; e.target.value = ''; if (file) upload(file);
      });
      logo.appendChild(input);
    }

    let camera = logo.querySelector('.r17-profile-camera');
    if (!camera) {
      camera = document.createElement('span');
      camera.className = 'r17-profile-camera';
      camera.textContent = '📷';
      camera.style.cssText = 'position:absolute!important;right:3px!important;bottom:3px!important;width:30px!important;height:30px!important;border-radius:50%!important;background:#fff!important;border:2px solid #071b35!important;display:grid!important;place-items:center!important;font-size:15px!important;line-height:1!important;z-index:10!important;pointer-events:none!important;box-shadow:0 3px 10px rgba(0,0,0,.35)!important;';
      logo.appendChild(camera);
    }

    if (logo.dataset.avatarLoaded !== '1') {
      logo.dataset.avatarLoaded = '1';
      loadAvatar(logo);
    }
  }

  async function loadAvatar(logo) {
    if (!await init()) return;
    const publicUrl = client.storage.from(BUCKET).getPublicUrl(`${userId}/avatar.jpg`).data?.publicUrl;
    if (!publicUrl) return;
    const img = new Image();
    img.onload = () => {
      if (!document.contains(logo)) return;
      logo.style.backgroundImage = `url("${publicUrl}?v=${Date.now()}")`;
      logo.style.backgroundSize = 'cover';
      logo.style.backgroundPosition = 'center';
      logo.style.backgroundRepeat = 'no-repeat';
      logo.style.color = 'transparent';
    };
    img.src = publicUrl;
  }

  async function upload(file) {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return alert('Selecciona una imagen JPG, PNG o WEBP.');
    if (file.size > 4 * 1024 * 1024) return alert('La imagen debe pesar menos de 4 MB.');
    if (!await init()) return alert('No se encontró la sesión del usuario.');

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
          const { error } = await client.storage.from(BUCKET).upload(`${userId}/avatar.jpg`, blob, { contentType:'image/jpeg', upsert:true, cacheControl:'3600' });
          if (error) return alert(`No se pudo guardar la foto: ${error.message || 'error de Storage'}`);
          const logo = document.querySelector('.brand-mark');
          if (logo) {
            const publicUrl = client.storage.from(BUCKET).getPublicUrl(`${userId}/avatar.jpg`).data.publicUrl;
            logo.style.backgroundImage = `url("${publicUrl}?v=${Date.now()}")`;
            logo.style.backgroundSize = 'cover';
            logo.style.backgroundPosition = 'center';
            logo.style.color = 'transparent';
            ensureProfileLogo();
          }
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
    observer = new MutationObserver(() => { clearTimeout(timer); timer = setTimeout(ensureProfileLogo, 50); });
    observer.observe(document.getElementById('app') || document.body, { childList:true, subtree:true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once:true });
  else start();
})();
