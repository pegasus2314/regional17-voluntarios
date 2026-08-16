/* Perfil interactivo del usuario — capa aislada */
(() => {
  'use strict';
  const KEY='rv_profile_avatar_v1';
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  let observer;
  function avatarKey(){const el=document.querySelector('.user-mini strong');return 'rv_profile_avatar_v1_'+(el?.textContent||'usuario').trim().toLowerCase().replace(/[^a-z0-9]+/g,'_')}
  function getAvatar(){try{return localStorage.getItem(avatarKey())||''}catch{return ''}}
  function initials(name){return (name||'U').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()}
  function applyAvatar(){const src=getAvatar();document.querySelectorAll('.user-mini .avatar').forEach(a=>{if(src){a.innerHTML=`<img src="${src}" alt="Foto de perfil">`;a.classList.add('has-photo')}else{const name=document.querySelector('.user-mini strong')?.textContent||'U';a.textContent=initials(name);a.classList.remove('has-photo')}})}
  function profile(){
    const user=document.querySelector('.user-mini strong')?.textContent||'Usuario';
    const role=document.querySelector('.user-mini small')?.textContent||'Voluntario';
    const photo=getAvatar();
    const content=document.getElementById('content'); if(!content)return;
    content.innerHTML=`<div class="profile-page"><div class="profile-cover"><div class="profile-avatar-wrap"><div class="profile-avatar ${photo?'has-photo':''}" id="profileAvatar">${photo?`<img src="${photo}" alt="Foto de perfil">`:initials(user)}</div><label class="profile-photo-btn" title="Cambiar foto"><input id="profilePhoto" type="file" accept="image/png,image/jpeg,image/webp">📷 Cambiar foto</label></div><div class="profile-identity"><span>MI PERFIL</span><h2>${esc(user)}</h2><p>${esc(role)}</p></div></div><div class="profile-grid"><section class="profile-card"><div class="profile-card-head"><div><h3>Información de la cuenta</h3><p>Datos de tu sesión actual</p></div></div><div class="profile-info"><div><small>Nombre</small><b>${esc(user)}</b></div><div><small>Rol</small><b>${esc(role)}</b></div></div></section><section class="profile-card"><div class="profile-card-head"><div><h3>Foto de perfil</h3><p>La imagen se guarda en este dispositivo mientras preparamos Storage.</p></div></div><div class="profile-photo-actions"><label class="btn primary"><input id="profilePhoto2" type="file" accept="image/png,image/jpeg,image/webp">Seleccionar imagen</label><button class="btn" id="removeProfilePhoto" ${photo?'':'disabled'}>Eliminar foto</button></div><small class="profile-note">Formatos: JPG, PNG o WEBP. Se optimiza automáticamente.</small></section></div></div>`;
    const inputs=[content.querySelector('#profilePhoto'),content.querySelector('#profilePhoto2')].filter(Boolean);
    inputs.forEach(input=>input.onchange=e=>savePhoto(e.target.files?.[0]));
    content.querySelector('#removeProfilePhoto')?.addEventListener('click',()=>{try{localStorage.removeItem(avatarKey())}catch{} applyAvatar(); profile();});
  }
  function savePhoto(file){if(!file)return;if(file.size>4*1024*1024){alert('La imagen debe pesar menos de 4 MB.');return}const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{const max=500,scale=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*scale));c.height=Math.max(1,Math.round(img.height*scale));c.getContext('2d').drawImage(img,0,0,c.width,c.height);const data=c.toDataURL('image/jpeg',.82);try{localStorage.setItem(avatarKey(),data)}catch{alert('No hay espacio disponible para guardar la foto.')}applyAvatar();profile()};img.src=r.result};r.readAsDataURL(file)}
  function bind(){const el=document.querySelector('.user-mini');if(!el||el.dataset.profileBound)return;if(!el.dataset.profileBound){el.dataset.profileBound='1';el.style.cursor='pointer';el.title='Abrir mi perfil';el.addEventListener('click',profile)}applyAvatar()}
  function start(){bind();observer=new MutationObserver(()=>bind());observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
