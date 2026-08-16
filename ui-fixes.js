/* Regional 17 — Redesign system: login + dashboard + navigation + responsive UI */
(() => {
  'use strict';

  const DESCRIPTIONS = {
    Dashboard:'Resumen general de la gestión regional',
    Voluntarios:'Registro y seguimiento del equipo',
    Actividades:'Planificación y control operativo',
    'Centros educativos':'Centros y cobertura territorial',
    Eventos:'Agenda y compromisos programados',
    Estadísticas:'Indicadores y desempeño',
    Biblioteca:'Recursos académicos y documentos',
    Calendario:'Agenda y planificación regional',
    'Mi líder':'Información y coordinación'
  };

  const MAP_RE = /^mapa$/i;
  let scheduled = false;
  let observer = null;

  const css = `
  /* =========================================================
     REGIONAL 17 · VISUAL SYSTEM 2.0
     ========================================================= */
  :root{
    --r17-ink:#10233f;
    --r17-ink-2:#19385d;
    --r17-navy:#061a32;
    --r17-navy-2:#0b2b50;
    --r17-blue:#2167a5;
    --r17-gold:#f3b343;
    --r17-bg:#f4f7fb;
    --r17-card:#ffffff;
    --r17-line:#e4eaf2;
    --r17-muted:#738198;
    --r17-success:#16865a;
    --r17-danger:#c33d4c;
    --r17-warning:#a8750d;
    --r17-shadow:0 10px 35px rgba(9,31,55,.065);
    --r17-radius:16px;
  }

  *{scrollbar-width:thin;scrollbar-color:#c9d4e1 transparent}
  html,body{background:var(--r17-bg)!important;color:var(--r17-ink)!important}
  body{font-size:14px;letter-spacing:-.01em}
  button,input,select,textarea{font-family:inherit}
  button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid rgba(33,103,165,.16)!important;outline-offset:1px}

  /* ---------- LOGIN: completely new visual ---------- */
  .login{
    min-height:100vh!important;
    display:grid!important;
    grid-template-columns:minmax(0,1.12fr) minmax(430px,.88fr)!important;
    background:#f6f8fc!important;
    position:relative!important;
    overflow:hidden!important;
  }
  .login::before{
    content:'';position:absolute;inset:0;pointer-events:none;
    background:radial-gradient(circle at 75% 15%,rgba(243,179,67,.12),transparent 27%),radial-gradient(circle at 15% 85%,rgba(33,103,165,.09),transparent 32%);
  }
  .login-brand{
    position:relative!important;
    min-height:100vh!important;
    padding:clamp(45px,8vw,100px)!important;
    display:flex!important;flex-direction:column!important;justify-content:center!important;
    color:#fff!important;
    background:
      radial-gradient(circle at 82% 18%,rgba(243,179,67,.18),transparent 22%),
      radial-gradient(circle at 15% 78%,rgba(38,112,178,.22),transparent 30%),
      linear-gradient(145deg,#041427 0%,#08284b 58%,#0e3a67 100%)!important;
    isolation:isolate!important;
  }
  .login-brand::before,.login-brand::after{
    content:'';position:absolute;border:1px solid rgba(255,255,255,.08);border-radius:50%;pointer-events:none;z-index:-1;
  }
  .login-brand::before{width:480px;height:480px;right:-190px;top:-120px}
  .login-brand::after{width:280px;height:280px;left:-150px;bottom:-120px}
  .login-brand .brand-mark{
    width:58px!important;height:58px!important;border-radius:17px!important;
    background:linear-gradient(145deg,#ffd16c,#f0a52c)!important;color:#392704!important;
    font-size:17px!important;box-shadow:0 15px 30px rgba(0,0,0,.2)!important;
    margin-bottom:30px!important;
  }
  .login-brand .hero-kicker{color:#b9cce0!important;letter-spacing:2px!important;font-size:10px!important}
  .login-brand h1{
    margin:12px 0 15px!important;font-size:clamp(38px,5vw,68px)!important;line-height:.98!important;
    letter-spacing:-2.8px!important;font-weight:800!important;color:#fff!important;
  }
  .login-brand>p{max-width:560px!important;font-size:15px!important;line-height:1.75!important;color:#b9cce0!important;margin:0!important}
  .login-points{
    display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;
    max-width:600px!important;margin-top:34px!important;
  }
  .login-points span{
    padding:12px 14px!important;border:1px solid rgba(255,255,255,.09)!important;
    background:rgba(255,255,255,.045)!important;border-radius:11px!important;
    color:#dbe8f5!important;font-size:10px!important;font-weight:600!important;
    backdrop-filter:blur(8px)!important;
  }
  .login-points span::first-letter{color:#f3b343}
  .login-form{
    position:relative!important;z-index:2!important;align-self:center!important;
    width:min(480px,calc(100% - 56px))!important;margin:auto!important;
    padding:42px!important;background:rgba(255,255,255,.94)!important;
    border:1px solid rgba(215,224,235,.9)!important;border-radius:24px!important;
    box-shadow:0 25px 80px rgba(9,31,55,.12)!important;
    backdrop-filter:blur(18px)!important;
  }
  .login-form .eyebrow{color:#7a899e!important;letter-spacing:1.8px!important}
  .login-form h2{font-size:30px!important;letter-spacing:-1px!important;margin:8px 0 6px!important;color:var(--r17-ink)!important}
  .login-form>p{font-size:12px!important;color:var(--r17-muted)!important;margin:0 0 28px!important}
  .login-form form{display:grid!important;gap:15px!important}
  .login-form field{display:block!important}
  .login-form field label{display:block!important;font-size:10px!important;font-weight:750!important;color:#526174!important;margin-bottom:7px!important}
  .login-form field input{
    width:100%!important;height:48px!important;padding:0 14px!important;
    border:1px solid #d9e2ec!important;border-radius:11px!important;background:#fbfcfe!important;
    color:var(--r17-ink)!important;font-size:12px!important;transition:.18s ease!important;
  }
  .login-form field input:hover{border-color:#bfcddd!important;background:#fff!important}
  .login-form field input:focus{border-color:#5c8ab6!important;background:#fff!important;box-shadow:0 0 0 4px rgba(33,103,165,.08)!important;outline:0!important}
  .login-form .btn.full{width:100%!important;height:48px!important;border-radius:11px!important;font-size:12px!important;margin-top:3px!important}
  .login-form>small{display:block!important;margin-top:20px!important;color:#8a97a9!important;font-size:9px!important;line-height:1.55!important;text-align:center!important}

  /* ---------- APPLICATION SHELL ---------- */
  .shell{background:var(--r17-bg)!important}
  .sidebar{
    width:264px!important;min-width:264px!important;padding:20px 13px!important;
    background:linear-gradient(180deg,#05172c 0%,#082747 55%,#0b3159 100%)!important;
    box-shadow:10px 0 40px rgba(3,18,35,.12)!important;
    border-right:1px solid rgba(255,255,255,.045)!important;
  }
  .brand{padding:6px 10px 24px!important;gap:11px!important}
  .brand-mark{width:43px!important;height:43px!important;border-radius:14px!important;box-shadow:0 9px 22px rgba(243,179,67,.18)!important}
  .brand strong{font-size:14px!important;letter-spacing:-.2px!important}
  .brand span{font-size:9px!important;color:#91a8c1!important;letter-spacing:.15px!important}
  .sidebar nav{display:grid!important;gap:5px!important}
  .nav-item.r17-nav-enhanced{
    min-height:57px!important;padding:8px 10px!important;border:1px solid transparent!important;
    border-radius:12px!important;gap:10px!important;transition:.18s ease!important;
  }
  .nav-item.r17-nav-enhanced>span:first-child{
    width:32px!important;height:32px!important;min-width:32px!important;display:grid!important;place-items:center!important;
    border-radius:9px!important;background:rgba(255,255,255,.055)!important;font-size:14px!important;
  }
  .r17-nav-copy{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:3px!important;min-width:0!important}
  .r17-nav-copy strong{font-size:10.5px!important;line-height:1.15!important;font-weight:750!important;color:#dbe6f1!important}
  .r17-nav-copy small{font-size:8px!important;line-height:1.2!important;font-weight:500!important;color:#8198b0!important;max-width:160px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
  .nav-item.r17-nav-enhanced:hover{transform:translateX(2px)!important;background:rgba(255,255,255,.065)!important;border-color:rgba(255,255,255,.07)!important}
  .nav-item.r17-nav-enhanced:hover>span:first-child{background:rgba(243,179,67,.13)!important}
  .nav-item.r17-nav-enhanced.active{background:linear-gradient(90deg,rgba(243,179,67,.18),rgba(243,179,67,.055))!important;border-color:rgba(243,179,67,.17)!important;box-shadow:inset 3px 0 0 #f3b343!important}
  .nav-item.r17-nav-enhanced.active>span:first-child{background:rgba(243,179,67,.18)!important}
  .nav-item.r17-nav-enhanced.active .r17-nav-copy strong{color:#ffd477!important}
  .side-bottom{margin-top:auto!important;padding-top:14px!important}
  .user-mini{padding:12px 9px!important;background:rgba(255,255,255,.045)!important;border:1px solid rgba(255,255,255,.07)!important;border-radius:13px!important}
  .user-mini strong{font-size:10px!important}.user-mini small{font-size:8px!important;color:#91a8c1!important}
  .side-action{height:38px!important;margin-top:8px!important;border-radius:10px!important;background:rgba(255,255,255,.035)!important;border-color:rgba(255,255,255,.13)!important;transition:.18s ease!important}
  .side-action:hover{background:rgba(255,255,255,.085)!important;color:#fff!important}

  .main{background:var(--r17-bg)!important}
  .topbar{
    min-height:82px!important;padding:15px 30px!important;background:rgba(255,255,255,.94)!important;
    border-bottom:1px solid var(--r17-line)!important;box-shadow:0 2px 24px rgba(9,31,55,.045)!important;
    backdrop-filter:blur(14px)!important;
  }
  .eyebrow{font-size:8px!important;letter-spacing:1.8px!important;color:#8390a3!important}
  .topbar h1{font-size:22px!important;letter-spacing:-.65px!important;color:var(--r17-ink)!important;margin:4px 0!important}
  .top-actions{gap:9px!important}
  .live{font-size:9px!important;padding:7px 10px!important;border-radius:999px!important;background:#edf9f3!important;color:#16865a!important;font-weight:700!important}
  #quickAdd{height:40px!important;padding:8px 14px!important;border-radius:10px!important}
  #quickAdd::after{content:'Añadir al módulo actual';font-size:8px!important;font-weight:500!important;opacity:.68!important;margin-left:3px!important}
  .mobile-menu{color:var(--r17-ink)!important}
  .main>#content{padding:28px 30px 48px!important;max-width:1500px!important}

  /* ---------- DASHBOARD 2.0 ---------- */
  .hero{
    position:relative!important;overflow:hidden!important;min-height:225px!important;padding:32px 36px!important;
    border-radius:22px!important;background:
      radial-gradient(circle at 85% 20%,rgba(243,179,67,.24),transparent 20%),
      radial-gradient(circle at 72% 100%,rgba(58,135,202,.22),transparent 30%),
      linear-gradient(125deg,#061a32,#0b315a 62%,#124b7c)!important;
    box-shadow:0 18px 45px rgba(7,27,53,.15)!important;
  }
  .hero::after{content:'R17';position:absolute;right:50px;top:50%;transform:translateY(-50%);font-size:145px;line-height:1;font-weight:900;color:rgba(255,255,255,.035);letter-spacing:-12px;pointer-events:none}
  .hero h2{font-size:28px!important;line-height:1.12!important;max-width:680px!important;letter-spacing:-1px!important;margin:9px 0!important}
  .hero p{max-width:620px!important;font-size:12px!important;line-height:1.65!important;color:#c2d5e8!important}
  .hero-kicker{font-size:8px!important;letter-spacing:2px!important;color:#a8bdd4!important}
  .hero-orb{width:70px!important;height:70px!important;display:grid!important;place-items:center!important;border:1px solid rgba(255,255,255,.15)!important;background:rgba(255,255,255,.06)!important;border-radius:20px!important;color:#ffd477!important;font-size:17px!important;font-weight:850!important;box-shadow:inset 0 1px rgba(255,255,255,.08)!important;z-index:1!important}
  .stats-grid{grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:12px!important;margin:16px 0!important}
  .stat-card{min-height:92px!important;padding:16px!important;border:1px solid var(--r17-line)!important;border-radius:15px!important;background:#fff!important;box-shadow:var(--r17-shadow)!important;transition:.18s ease!important}
  .stat-card:hover{transform:translateY(-3px)!important;box-shadow:0 15px 35px rgba(9,31,55,.09)!important}
  .stat-icon{width:38px!important;height:38px!important;border-radius:11px!important;background:#eef4fa!important;color:#1c4d7b!important;font-size:15px!important}
  .stat-card strong{font-size:20px!important;letter-spacing:-.5px!important;color:var(--r17-ink)!important}
  .stat-card span{font-size:8px!important;line-height:1.25!important;color:#8190a3!important}
  .dash-grid{gap:15px!important;grid-template-columns:1.35fr .65fr!important}
  .panel{border:1px solid var(--r17-line)!important;border-radius:17px!important;padding:19px!important;background:#fff!important;box-shadow:var(--r17-shadow)!important}
  .panel-head{align-items:flex-start!important;margin-bottom:13px!important}
  .panel h3{font-size:14px!important;letter-spacing:-.2px!important}
  .panel p{font-size:9px!important;color:#8290a3!important}
  .activity-row,.rank-row,.history-row{padding:12px 0!important;border-color:#edf1f5!important}
  .date-box{width:40px!important;height:42px!important;border-radius:10px!important;background:#f1f5fa!important}
  .grow strong{font-size:10px!important}.grow small,.rank-row small,.history-row small{font-size:8px!important}

  /* ---------- TABLES / LISTS ---------- */
  .toolbar{padding:10px!important;margin-bottom:14px!important;background:#fff!important;border:1px solid var(--r17-line)!important;border-radius:15px!important;box-shadow:var(--r17-shadow)!important;gap:8px!important}
  .toolbar .search{height:43px!important;border-color:#dce4ed!important;border-radius:10px!important}
  .toolbar select{height:43px!important;min-width:150px!important;border-color:#dce4ed!important;border-radius:10px!important;background:#fbfcfe!important}
  .toolbar select:focus,.toolbar .search:focus-within{border-color:#7fa1c2!important;box-shadow:0 0 0 3px rgba(33,103,165,.08)!important;outline:0!important}
  .table-wrap{border:1px solid #dfe6ef!important;border-radius:16px!important;box-shadow:0 8px 28px rgba(9,31,55,.055)!important;overflow:auto!important}
  .table-wrap table{min-width:920px!important}
  .table-wrap th{height:43px!important;padding:11px 14px!important;background:#f8fafc!important;color:#7d8b9e!important;font-size:8px!important;letter-spacing:.65px!important;border-bottom:1px solid #e6ebf1!important}
  .table-wrap td{padding:13px 14px!important;font-size:9px!important;color:#35465b!important;border-bottom:1px solid #edf1f5!important;vertical-align:middle!important}
  .table-wrap tbody tr{transition:background .14s ease!important}.table-wrap tbody tr:hover{background:#f8fbfe!important}
  .person{gap:10px!important}.person strong{font-size:10px!important;color:#16263d!important}.person small{font-size:8px!important;color:#8794a5!important}
  .actions{gap:5px!important}.icon-action{min-height:31px!important;padding:6px 9px!important;border:1px solid #dce4ed!important;border-radius:8px!important;background:#fff!important;font-size:8.5px!important;font-weight:750!important;transition:.15s ease!important}
  .icon-action:hover{transform:translateY(-1px)!important;box-shadow:0 5px 12px rgba(9,31,55,.08)!important}
  .icon-action[data-view-v]{color:#174b7f!important}.icon-action[data-edit-v]{color:#8a620b!important;background:#fffaf0!important;border-color:#ead9ac!important}.icon-action[data-del-v]{color:#b43745!important;background:#fff7f8!important;border-color:#f0cdd2!important}
  .status{padding:5px 9px!important;font-size:8px!important;border:1px solid transparent!important}.status.active{background:#eaf8f1!important;color:#167a53!important;border-color:#ccebdc!important}.status.off{background:#fff0f2!important;color:#b23746!important;border-color:#f0d0d5!important}.status.wait{background:#fff8e9!important;color:#91650b!important;border-color:#f2dfb2!important}
  .scorebar{height:5px!important;width:70px!important;background:#e9eef4!important;border-radius:999px!important;overflow:hidden!important;display:inline-block!important;vertical-align:middle!important;margin-right:5px!important}.scorebar span{height:100%!important;border-radius:999px!important;background:linear-gradient(90deg,#efc05a,#278660)!important}

  /* ---------- CARDS / BUTTONS / MODALS ---------- */
  .btn{min-height:37px!important;border-radius:10px!important;border-color:#dce4ed!important;font-weight:750!important;box-shadow:0 1px 2px rgba(9,31,55,.035)!important;transition:.16s ease!important}
  .btn:hover{transform:translateY(-1px)!important;box-shadow:0 7px 16px rgba(9,31,55,.10)!important}.btn:active{transform:none!important}
  .btn.primary{background:linear-gradient(135deg,#0b315a,#175287)!important;border-color:#0b315a!important;box-shadow:0 6px 16px rgba(11,49,90,.17)!important}.btn.primary:hover{background:linear-gradient(135deg,#103c6b,#1b639b)!important}
  .btn.danger{background:#fff7f8!important;color:var(--r17-danger)!important;border-color:#f0cdd2!important}
  .cards-grid{gap:14px!important}.activity-card,.center-card,.event-card{border:1px solid var(--r17-line)!important;border-radius:15px!important;box-shadow:var(--r17-shadow)!important;background:#fff!important}
  .modal{border:1px solid #dfe6ef!important;border-radius:19px!important;box-shadow:0 28px 80px rgba(4,17,34,.24)!important}.modal-head{background:#fbfcfe!important;padding:18px 21px!important}.modal-body{padding:20px!important}
  field label{font-size:9px!important;font-weight:750!important;color:#536276!important}field input,field select,field textarea{border-color:#dce4ed!important;border-radius:10px!important}field input:focus,field select:focus,field textarea:focus{border-color:#7fa1c2!important;box-shadow:0 0 0 3px rgba(33,103,165,.08)!important;outline:0!important}
  .toast{border-radius:11px!important;box-shadow:0 14px 30px rgba(4,17,34,.18)!important}

  /* ---------- HIDE MAP WITHOUT TOUCHING DATABASE ---------- */
  [data-view="map"],[data-r17-map]{display:none!important}

  /* ---------- RESPONSIVE ---------- */
  @media(max-width:1180px){.stats-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}.dash-grid{grid-template-columns:1fr!important}.login{grid-template-columns:1fr!important}.login-brand{min-height:46vh!important;padding:50px 8vw!important}.login-form{margin:34px auto 55px!important}.login-brand h1{font-size:48px!important}}
  @media(max-width:760px){
    .sidebar{width:270px!important;min-width:270px!important;position:fixed!important;left:-275px!important;z-index:90!important;transition:left .22s ease!important}.sidebar.open{left:0!important}
    .topbar{padding:13px 16px!important;min-height:70px!important}.top-actions .live{display:none!important}.main>#content{padding:16px 13px 32px!important}
    .hero{min-height:200px!important;padding:23px!important;border-radius:18px!important}.hero h2{font-size:23px!important}.hero-orb{display:none!important}.hero::after{right:-20px;font-size:100px}
    .stats-grid{grid-template-columns:1fr 1fr!important;gap:9px!important}.stat-card{min-height:82px!important;padding:12px!important}.stat-icon{width:33px!important;height:33px!important}
    .toolbar{padding:8px!important}.toolbar select{min-width:0!important;flex:1!important}.toolbar .search{min-width:100%!important}
    #quickAdd::after{display:none!important}.actions{gap:4px!important}.icon-action{padding:6px 8px!important}
    .login-brand{min-height:43vh!important;padding:34px 24px 30px!important}.login-brand .brand-mark{margin-bottom:20px!important}.login-brand h1{font-size:39px!important;letter-spacing:-1.8px!important}.login-brand>p{font-size:12px!important}.login-points{grid-template-columns:1fr 1fr!important;margin-top:20px!important;gap:7px!important}.login-points span{font-size:8px!important;padding:9px!important}.login-form{width:calc(100% - 28px)!important;padding:26px!important;margin:14px auto 30px!important;border-radius:18px!important}.login-form h2{font-size:25px!important}
  }
  `;

  function addStyles(){
    let style=document.getElementById('r17-redesign-css');
    if(!style){style=document.createElement('style');style.id='r17-redesign-css';document.head.appendChild(style)}
    style.textContent=css;
  }

  function removeMap(){
    document.querySelectorAll('[data-view="map"],[data-r17-map]').forEach(el=>el.remove());
    document.querySelectorAll('.login-points span').forEach(el=>{if(/mapa/i.test(el.textContent||''))el.remove()});
  }

  function navLabel(btn){
    const copy=btn.querySelector('.r17-nav-copy strong');
    if(copy)return copy.textContent.trim();
    const nodes=[...btn.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());
    return nodes.map(n=>n.textContent.trim()).join(' ').replace(/\s+/g,' ').trim();
  }

  function decorateNav(){
    const nav=document.querySelector('.sidebar nav');
    if(!nav)return;
    [...nav.querySelectorAll('.nav-item')].forEach(btn=>{
      if(btn.matches('[data-view="map"]')){btn.remove();return}
      const label=navLabel(btn);
      if(!label)return;
      if(MAP_RE.test(label)){btn.remove();return}
      btn.classList.add('r17-nav-enhanced');
      btn.title=DESCRIPTIONS[label]||label;
      if(!btn.querySelector('.r17-nav-copy')){
        const icon=btn.querySelector('span');
        const copy=document.createElement('span');
        copy.className='r17-nav-copy';
        const strong=document.createElement('strong');
        const small=document.createElement('small');
        strong.textContent=label;
        small.textContent=DESCRIPTIONS[label]||'Acceso al módulo';
        copy.append(strong,small);
        [...btn.childNodes].forEach(n=>{if(n!==icon)n.remove()});
        btn.appendChild(copy);
      }
    });
  }

  function ensureModule(nav,key,selector,icon,label,description,handler){
    if(nav.querySelector(selector)||nav.querySelector(`[data-r17-module="${key}"]`))return;
    const b=document.createElement('button');
    b.type='button';b.className='nav-item r17-nav-enhanced';b.dataset.r17Module=key;b.title=description;
    b.innerHTML=`<span>${icon}</span><span class="r17-nav-copy"><strong>${label}</strong><small>${description}</small></span>`;
    b.addEventListener('click',handler);nav.appendChild(b);
  }

  function restoreModules(){
    const nav=document.querySelector('.sidebar nav');
    if(!nav)return;
    if(window.R17Calendar?.open)ensureModule(nav,'calendar','[data-r17-calendar]','📅','Calendario','Agenda y planificación regional',e=>{e.preventDefault();window.R17Calendar.open()});
    if(window.R17Library?.open)ensureModule(nav,'library','[data-r17-tool="library"]','📚','Biblioteca','Recursos académicos y documentos',e=>{e.preventDefault();window.R17Library.open()});
  }

  function polishActions(){
    document.querySelectorAll('.btn,.icon-action,.side-action,.link-btn').forEach(b=>{
      const text=b.textContent.trim();
      if(!b.getAttribute('aria-label')&&text)b.setAttribute('aria-label',text);
    });
    const quick=document.getElementById('quickAdd');
    if(quick){
      const t=quick.textContent.trim();
      const descriptions={Centro:'Añadir un centro educativo',Actividad:'Registrar una actividad',Evento:'Programar un evento',Voluntario:'Registrar un voluntario'};
      const key=Object.keys(descriptions).find(k=>t.includes(k));
      if(key){quick.title=descriptions[key];quick.setAttribute('aria-label',`${t}. ${descriptions[key]}`)}
    }
    document.querySelectorAll('[data-view-v]').forEach(b=>b.title='Ver ficha del voluntario');
    document.querySelectorAll('[data-edit-v]').forEach(b=>b.title='Editar información del voluntario');
    document.querySelectorAll('[data-del-v]').forEach(b=>b.title='Archivar voluntario');
  }

  function removeStaleArtifacts(){
    document.querySelectorAll('.r17-redesign-artifact').forEach(el=>el.remove());
  }

  function fix(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{
      scheduled=false;
      try{
        addStyles();
        removeMap();
        decorateNav();
        restoreModules();
        polishActions();
        removeStaleArtifacts();
      }catch(err){console.error('[R17 UI]',err)}
    });
  }

  function boot(){
    fix();
    observer=new MutationObserver(fix);
    observer.observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
