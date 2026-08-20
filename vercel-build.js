const fs = require('fs');

const appPath = 'app.js';
let app = fs.readFileSync(appPath, 'utf8');

if (!app.includes('const __R17_NAV_STABLE_V2__ = true;')) {
  const oldNav = "document.getElementById('logout').onclick=async()=>{await sb.auth.signOut()};document.getElementById('menu').onclick=()=>document.querySelector('.sidebar').classList.toggle('open');document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;state.selected=[];layout();render()});document.getElementById('quickAdd')?.addEventListener('click',()=>view==='centers'?centerModal():view==='activities'?activityModal():view==='events'?eventModal():volunteerModal());";
  const newNav = "document.getElementById('logout').onclick=async()=>{await sb.auth.signOut()};document.getElementById('menu').onclick=()=>document.querySelector('.sidebar').classList.toggle('open');document.querySelectorAll('.sidebar [data-view]').forEach(b=>b.onclick=()=>navigateTo(b.dataset.view));document.getElementById('quickAdd')?.addEventListener('click',()=>view==='centers'?centerModal():view==='activities'?activityModal():view==='events'?eventModal():volunteerModal());";
  if (!app.includes(oldNav)) throw new Error('Could not find primary sidebar navigation handler in app.js');
  app = app.replace(oldNav, newNav);

  const helpers = `const __R17_NAV_STABLE_V2__ = true;\nfunction updateShell(){\n const title=document.querySelector('.topbar h1');\n if(title) title.textContent=viewTitle();\n const q=document.getElementById('quickAdd');\n if(q){const allowed=canManage();q.style.visibility=allowed?'visible':'hidden';q.setAttribute('aria-hidden',allowed?'false':'true');q.textContent='＋ '+(view==='centers'?'Centro':view==='activities'?'Actividad':view==='events'?'Evento':'Voluntario')}\n document.querySelectorAll('.sidebar [data-view]').forEach(b=>{const on=b.dataset.view===view;b.classList.toggle('active',on);b.setAttribute('aria-current',on?'page':'false')});\n}\nfunction navigateTo(nextView){\n if(!nextView) return;\n view=nextView;\n state.selected=[];\n updateShell();\n render();\n}\n\n`;
  if (!app.includes('function updateShell(){')) {
    app = app.replace('function layout(){', helpers + 'function layout(){');
  }

  app = app.replace("document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;layout();render()});", "document.querySelectorAll('.main [data-view]').forEach(b=>b.onclick=()=>navigateTo(b.dataset.view));");
  app = app.replace("window.__rvCenter=id=>{view='centers';layout();render();setTimeout(()=>{", "window.__rvCenter=id=>{navigateTo('centers');setTimeout(()=>{");
  app = app.replace("if(view==='volunteers'&&canManage())document.getElementById('selection')?.addEventListener('click',()=>{view='selection';layout();render()});", "if(view==='volunteers'&&canManage())document.getElementById('selection')?.addEventListener('click',()=>navigateTo('selection'));");
  app = app.replace("async function reload(){await loadAll();layout();render()}", "async function reload(){await loadAll();if(!document.querySelector('.shell'))layout();updateShell();render()}");

  const oldAuth = "session=s;if(s){try{await loadProfile();await loadAll();layout();render()}catch(e){console.error(e)}}else login()";
  const newAuth = "if(!s){session=null;login();return}if(session?.user?.id===s.user.id && document.querySelector('.shell')) return;session=s;try{await loadProfile();await loadAll();if(!document.querySelector('.shell'))layout();updateShell();render()}catch(e){console.error(e)}";
  if (app.includes(oldAuth)) app = app.replace(oldAuth, newAuth);

  fs.writeFileSync(appPath, app);
}

const preloadPath = 'stability-preload.js';
let preload = fs.readFileSync(preloadPath, 'utf8');
if (!preload.includes('readyScreen')) {
  const oldReveal = `const reveal = () => {\n    if (revealed || !mount.firstElementChild) return;\n    revealed = true;\n    document.documentElement.classList.remove('r17-booting');\n    document.documentElement.classList.add('r17-ready');\n    observer?.disconnect();\n  };`;
  const newReveal = `const reveal = () => {\n    if (revealed || !mount.firstElementChild) return;\n    const readyScreen = mount.querySelector('.login, .setup, .error-box') || (mount.querySelector('.shell') && mount.querySelector('#content') && !mount.querySelector('#content .loading'));\n    if (!readyScreen) return;\n    revealed = true;\n    document.documentElement.classList.remove('r17-booting');\n    document.documentElement.classList.add('r17-ready');\n    observer?.disconnect();\n  };`;
  if (!preload.includes(oldReveal)) throw new Error('Could not find stability preload reveal function');
  preload = preload.replace(oldReveal, newReveal);
  fs.writeFileSync(preloadPath, preload);
}

console.log('R17 stability build patch applied successfully.');
