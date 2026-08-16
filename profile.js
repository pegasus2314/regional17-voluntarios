/* Perfil interactivo del usuario — avatar persistente en Supabase Storage */
(() => {
  'use strict';
  const BUCKET = 'profile-avatars';
  let sb = null;
  let uid = null;
  let bound = false;

  const esc = v => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const initials = name => (name || 'U').trim().split(/\s+/).slice(0,2).map(x => x[0]).join('').toUpperCase();

  async function initClient() {
    if (sb) return sb;
    const cfg = window.RV_CONFIG || {};
    if (!window.supabase?.createClient || !cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) return null;
    sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    const { data } = await sb.auth.getSession();
    uid = data?.session?.user?.id || null;
    return sb;
  }

  function userInfo() {
    const el = document.querySelector('.user-mini');
    return { name: el?.querySelector('strong')?.textContent || 'Usuario', role: el?.querySelector('small')?.textContent || 'Voluntario' };
  }

  async function getAvatarUrl() {
    const client = await initClient();
    if (!client || !uid) return '';
    const { data } = client.storage.from(BUCKET).getPublicUrl(`${uid}/avatar.jpg`);
    return data?.publicUrl || '';
  }

  async function applyAvatar() {
    const src = await getAvatarUrl();
    document.querySelectorAll('.user-mini .avatar').forEach(a => {
      if (src) {
        a.innerHTML = `<img src="${src}?v=${Date.now()}" alt="Foto de perfil"><span class="avatar-camera">📷</span>`;
        a.classList.add('has-photo');
      } else {
        a.innerHTML = `${initials(userInfo().name)}<span class="avatar-camera">📷</span>`;
        a.classList.remove('has-photo');
      }
    });
  }

  async function quickChangePhoto(file) {
    await savePhoto(file);
  }

  function addCircleUpload(el) {
    if (el.querySelector('.avatar-upload-input')) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/webp';
    input.className = 'avatar-upload-input';
    input.setAttribute('aria-label', 'Cambiar foto de perfil');
    input.addEventListener('change', e => quickChangePhoto(e.target.files?.[0]));
    el.appendChild(input);
  }

  async function profile() {
    const client = await initClient();
    if (!client || !uid) return alert('No se encontró la sesión del usuario.');
    const { name:user, role } = userInfo();
    const photo = await getAvatarUrl();
    const content = document.getElementById('content');
    if (!content) return;

    content.innerHTML = `<div class="profile-page">
      <div class="profile-cover">
        <div class="profile-avatar-wrap">
          <div class="profile-avatar ${photo ? 'has-photo' : ''}" id="profileAvatar">
            ${photo ? `<img src="${photo}?v=${Date.now()}" alt="Foto de perfil">` : initials(user)}
          </div>
          <label class="profile-photo-btn" title="Cambiar foto"><input id="profilePhoto" type="file" accept="image/png,image/jpeg,image/webp">📷 Cambiar foto</label>
        </div>
        <div class="profile-identity"><span>MI PERFIL</span><h2>${esc(user)}</h2><p>${esc(role)}</p></div>
      </div>
      <div class="profile-grid">
        <section class="profile-card"><div class="profile-card-head"><div><h3>Información de la cuenta</h3><p>Datos de tu sesión actual</p></div></div>
          <div class="profile-info"><div><small>Nombre</small><b>${esc(user)}</b></div><div><small>Rol</small><b>${esc(role)}</b></div></div>
        </section>
        <section class="profile-card"><div class="profile-card-head"><div><h3>Foto de perfil</h3><p>La imagen se guarda en tu cuenta.</p></div></div>
          <div class="profile-photo-actions"><label class="btn primary"><input id="profilePhoto2" type="file" accept="image/png,image/jpeg,image/webp">Seleccionar imagen</label>
          <button class="btn" id="removeProfilePhoto" ${photo ? '' : 'disabled'}>Eliminar foto</button></div>
          <small class="profile-note">JPG, PNG o WEBP · Máximo 4 MB.</small>
        </section>
      </div>
    </div>`;

    content.querySelectorAll('#profilePhoto,#profilePhoto2').forEach(input => input.addEventListener('change', e => savePhoto(e.target.files?.[0])));
    content.querySelector('#removeProfilePhoto')?.addEventListener('click', removePhoto);
  }

  async function savePhoto(file) {
    const client = await initClient();
    if (!file || !client || !uid) return alert('No se encontró la sesión del usuario.');
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return alert('Selecciona una imagen JPG, PNG o WEBP.');
    if (file.size > 4 * 1024 * 1024) return alert('La imagen debe pesar menos de 4 MB.');

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 500, scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async blob => {
          if (!blob) return alert('No se pudo procesar la imagen.');
          const { error } = await client.storage.from(BUCKET).upload(`${uid}/avatar.jpg`, blob, { contentType:'image/jpeg', upsert:true, cacheControl:'3600' });
          if (error) { console.error('Profile avatar upload:', error); return alert(`No se pudo guardar la foto: ${error.message || 'error de Storage'}`); }
          await applyAvatar();
          if (document.getElementById('profileAvatar')) await profile();
        }, 'image/jpeg', .82);
      };
      img.onerror = () => alert('No se pudo leer la imagen.');
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  async function removePhoto() {
    const client = await initClient();
    if (!client || !uid) return alert('No se encontró la sesión del usuario.');
    const { error } = await client.storage.from(BUCKET).remove([`${uid}/avatar.jpg`]);
    if (error) return alert(`No se pudo eliminar la foto: ${error.message || 'error de Storage'}`);
    await applyAvatar();
    await profile();
  }

  async function bind() {
    const el = document.querySelector('.user-mini');
    if (!el || bound) return;
    bound = true;
    el.style.cursor = 'pointer';
    el.title = 'Abrir mi perfil · toca la cámara para cambiar la foto';
    el.addEventListener('click', e => { if (!e.target.closest('.avatar-upload-input')) profile(); });
    const avatar = el.querySelector('.avatar');
    if (avatar) addCircleUpload(avatar);
    await initClient();
    await applyAvatar();
  }

  function start() { bind(); if (!bound) setTimeout(start, 700); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once:true }); else start();
})();
