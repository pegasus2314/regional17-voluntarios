/* Regional 17 — UI stability + professional visual system */
(() => {
  'use strict';

  const DESCRIPTIONS = {
    'Dashboard':'Resumen de la gestión regional',
    'Voluntarios':'Registro y seguimiento del equipo',
    'Actividades':'Planifica y controla actividades',
    'Centros educativos':'Centros de la Regional 17',
    'Eventos':'Eventos y compromisos programados',
    'Estadísticas':'Indicadores y desempeño',
    'Biblioteca':'Recursos académicos y documentos',
    'Calendario':'Eventos y planificación regional',
    'Mi líder':'Información y coordinación'
  };

  const MAP_RE=/^mapa$/i;
  let fixing=false;

  const css=`
    /* ===== Regional 17 · Professional UI ===== */
    :root{
      --r17-navy:#071b35;
      --r17-navy-2:#0d315d;
      --r17-blue:#1b4f83;
      --r17-gold:#f3b343;
      --r17-bg:#f5f7fb;
      --r17-line:#e1e7ef;
      --r17-text:#162238;
      --r17-muted:#718096;
      --r17-success:#16865a;
      --r17-danger:#c43d4c;
      --r17-radius:12px;
    }

    body{background:var(--r17-bg)!important;color:var(--r17-text)!important}

    /* Sidebar */
    .sidebar{
      background:linear-gradient(180deg,#061a32 0%,#092744 100%)!important;
      box-shadow:10px 0 35px rgba(6,23,42,.10)!important;
    }
    .brand{padding-bottom:25px!important}
    .brand-mark{box-shadow:0 8px 18px rgba(243,179,67,.18)!important}
    .sidebar nav{gap:6px!important}
    .nav-item.r17-nav-enhanced{
      min-height:56px!important;
      padding:8px 10px!important;
      gap:10px!important;
      border:1px solid transparent!important;
      border-radius:11px!important;
      align-items:center!important;
      transition:background .18s ease,border-color .18s ease,transform .18s ease,box-shadow .18s ease!important;
    }
    .nav-item.r17-nav-enhanced>span:first-child{
      width:31px!important;height:31px!important;min-width:31px!important;
      display:grid!important;place-items:center!important;
      border-radius:9px!important;
      background:rgba(255,255,255,.055)!important;
      font-size:14px!important;
      transition:background .18s ease,transform .18s ease!important;
    }
    .nav-item.r17-nav-enhanced .r17-nav-copy{
      display:flex!important;flex-direction:column!important;align-items:flex-start!important;
      gap:3px!important;min-width:0!important;text-align:left!important;
    }
    .r17-nav-copy strong{font-size:11px!important;font-weight:750!important;line-height:1.15!important;color:#dbe7f4!important}
    .r17-nav-copy small{font-size:8.5px!important;font-weight:500!important;line-height:1.2!important;color:#8097b2!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;max-width:145px!important}
    .nav-item.r17-nav-enhanced:hover{
      transform:translateX(2px)!important;
      background:rgba(255,255,255,.065)!important;
      border-color:rgba(255,255,255,.07)!important;
    }
    .nav-item.r17-nav-enhanced:hover>span:first-child{background:rgba(243,179,67,.14)!important;transform:scale(1.04)}
    .nav-item.r17-nav-enhanced.active{
      background:linear-gradient(90deg,rgba(243,179,67,.17),rgba(243,179,67,.06))!important;
      border-color:rgba(243,179,67,.18)!important;
      box-shadow:inset 3px 0 0 var(--r17-gold)!important;
    }
    .nav-item.r17-nav-enhanced.active>span:first-child{background:rgba(243,179,67,.18)!important}
    .nav-item.r17-nav-enhanced.active .r17-nav-copy strong{color:#ffd477!important}
    .nav-item.r17-nav-enhanced.active .r17-nav-copy small,.nav-item.r17-nav-enhanced:hover .r17-nav-copy small{color:#b6c8dc!important}

    .side-bottom{padding-top:12px!important}
    .user-mini{padding:13px 8px!important;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.06)!important;border-radius:11px!important}
    .side-action{margin-top:8px!important;height:38px!important;border-color:rgba(255,255,255,.14)!important;background:rgba(255,255,255,.035)!important;transition:.18s ease!important}
    .side-action:hover{background:rgba(255,255,255,.09)!important;border-color:rgba(255,255,255,.24)!important;color:#fff!important}

    /* Topbar */
    .topbar{
      min-height:78px!important;
      background:rgba(255,255,255,.96)!important;
      box-shadow:0 2px 18px rgba(6,23,42,.055)!important;
      backdrop-filter:blur(10px)!important;
    }
    .topbar h1{font-size:21px!important;letter-spacing:-.3px!important}
    .live{padding:6px 9px;border-radius:999px;background:#eefaf4;font-weight:600!important}

    /* Toolbar / filters */
    .toolbar{
      padding:10px!important;
      margin-bottom:14px!important;
      background:#fff!important;
      border:1px solid var(--r17-line)!important;
      border-radius:14px!important;
      box-shadow:0 3px 18px rgba(6,23,42,.045)!important;
      gap:8px!important;
    }
    .toolbar .search{height:42px!important;border-color:#dce4ee!important;box-shadow:inset 0 1px 2px rgba(6,23,42,.02)!important}
    .toolbar select{height:42px!important;border-color:#dce4ee!important;min-width:150px!important;outline:none!important;background:#fbfcfe!important}
    .toolbar select:focus,.toolbar .search:focus-within{border-color:#8aa9c8!important;box-shadow:0 0 0 3px rgba(27,79,131,.08)!important}

    /* Buttons */
    .btn{
      min-height:36px!important;
      border-radius:9px!important;
      border-color:#dce4ed!important;
      font-weight:700!important;
      letter-spacing:-.05px!important;
      box-shadow:0 1px 2px rgba(6,23,42,.03)!important;
      transition:transform .15s ease,box-shadow .15s ease,background .15s ease,border-color .15s ease!important;
    }
    .btn:hover{transform:translateY(-1px)!important;box-shadow:0 6px 15px rgba(7,27,53,.10)!important}
    .btn:active{transform:translateY(0)!important}
    .btn.primary{background:linear-gradient(135deg,#0d315d,#174b7f)!important;border-color:#0d315d!important;box-shadow:0 4px 12px rgba(13,49,93,.16)!important}
    .btn.primary:hover{background:linear-gradient(135deg,#123c6d,#1b5a92)!important}
    .btn.danger{background:#fff7f8!important;border-color:#f0cdd2!important;color:var(--r17-danger)!important}
    .btn.danger:hover{background:#fff0f2!important;border-color:#e7adb5!important}
    #quickAdd{height:40px!important;padding:7px 14px!important;display:inline-flex!important;align-items:center!important;gap:7px!important}
    #quickAdd::after{content:'Agregar al módulo actual';font-size:8px;font-weight:500;opacity:.62;margin-left:2px}

    /* Action buttons in tables/cards */
    .actions{display:flex!important;gap:5px!important;align-items:center!important;flex-wrap:wrap!important}
    .icon-action{
      min-height:30px!important;
      padding:5px 9px!important;
      border:1px solid #dce4ed!important;
      background:#fff!important;
      color:#345778!important;
      border-radius:8px!important;
      font-size:9px!important;
      font-weight:700!important;
      transition:all .15s ease!important;
    }
    .icon-action:hover{transform:translateY(-1px)!important;border-color:#b9cadc!important;background:#f7fafd!important;box-shadow:0 4px 10px rgba(6,23,42,.07)!important}
    .icon-action[data-view-v]{color:#174b7f!important}
    .icon-action[data-edit-v]{color:#8a620b!important;background:#fffaf0!important;border-color:#ead9ac!important}
    .icon-action[data-del-v]{color:#b43745!important;background:#fff7f8!important;border-color:#f0cdd2!important}
    .icon-action[data-del-v]:hover{background:#fff0f2!important}

    /* Table */
    .table-wrap{
      border-radius:15px!important;
      border-color:#dfe6ef!important;
      box-shadow:0 5px 22px rgba(6,23,42,.055)!important;
      background:#fff!important;
    }
    .table-wrap table{min-width:920px!important}
    .table-wrap th{
      height:42px!important;
      padding:10px 13px!important;
      background:#f8fafc!important;
      color:#7a899c!important;
      font-size:8px!important;
      letter-spacing:.55px!important;
      border-bottom:1px solid #e6ebf1!important;
    }
    .table-wrap td{padding:12px 13px!important;border-bottom:1px solid #edf1f5!important;color:#334155!important;vertical-align:middle!important}
    .table-wrap tbody tr{transition:background .14s ease!important}
    .table-wrap tbody tr:hover{background:#f8fbfe!important}
    .person strong{font-size:10px!important;color:#14243a!important}
    .person small{font-size:8px!important;color:#8290a3!important}
    .avatar{box-shadow:inset 0 0 0 1px rgba(13,49,93,.05)!important}

    /* Status and performance */
    .status{padding:5px 9px!important;font-size:8px!important;border:1px solid transparent!important}
    .status.active{background:#eaf8f1!important;color:#167a53!important;border-color:#ccebdc!important}
    .status.off{background:#fff0f2!important;color:#b23746!important;border-color:#f0d0d5!important}
    .status.wait{background:#fff8e9!important;color:#91650b!important;border-color:#f2dfb2!important}
    .scorebar{height:5px!important;width:72px!important;background:#e9eef4!important;border-radius:999px!important;overflow:hidden!important;display:inline-block!important;vertical-align:middle!important;margin-right:5px!important}
    .scorebar span{display:block;height:100%;border-radius:999px!important;background:linear-gradient(90deg,#f0c35c,#2b8a64)!important}

    /* Cards / dashboard */
    .panel,.stat-card,.activity-card,.center-card,.event-card{
      border-color:#e0e7ef!important;
      box-shadow:0 4px 20px rgba(6,23,42,.045)!important;
    }
    .panel{border-radius:15px!important}
    .stat-card{border-radius:14px!important;transition:transform .16s ease,box-shadow .16s ease!important}
    .stat-card:hover{transform:translateY(-2px)!important;box-shadow:0 8px 24px rgba(6,23,42,.08)!important}
    .hero{box-shadow:0 12px 30px rgba(7,27,53,.12)!important}
    .link-btn{border:0!important;background:transparent!important;color:#174b7f!important;font-weight:700!important;font-size:10px!important;padding:6px 8px!important;border-radius:7px!important}
    .link-btn:hover{background:#edf4fa!important}

    /* Forms and modals */
    .modal{border:1px solid #e0e7ef!important;box-shadow:0 24px 70px rgba(4,17,34,.22)!important}
    .modal-head{background:#fbfcfe!important}
    field label{font-size:9px!important;font-weight:700!important;color:#526174!important}
    field input,field select,field textarea{border-color:#dce4ed!important;border-radius:9px!important}
    field input:focus,field select:focus,field textarea:focus{border-color:#7fa1c2!important;box-shadow:0 0 0 3px rgba(27,79,131,.08)!important;outline:none!important}

    /* Help text for action bars */
    .quick-help{display:block;font-size:8px;color:var(--r17-muted);margin-top:3px;line-height:1.25}
    .r17-help{font-size:8px!important;color:var(--r17-muted)!important;display:block!important;margin-top:3px!important}

    /* Responsive */
    @media(max-width:760px){
      .toolbar{padding:8px!important}
      .toolbar select{min-width:0!important;flex:1!important}
      #quickAdd::after{display:none}
      .actions{gap:4px!important}
      .icon-action{padding:6px 8px!important}
    }
  `;

  const addStyles=()=>{
    if(document.getElementById('r17-polish-css'))document.getElementById('r17-polish-css').textContent=css;
    else{const s=document.createElement('style');s.id='r17-polish-css';s.textContent=css;document.head.appendChild(s)}
  };

  const removeMap=()=>document.querySelectorAll('[data-view="map"],[data-r17-map]').forEach(x=>x.remove());

  const decorateNav=()=>{
    const nav=document.querySelector('.sidebar nav');
    if(!nav)return;
    [...nav.querySelectorAll('.nav-item')].forEach(btn=>{
      if(btn.matches('[data-view="map"]'))return;
      let label='';
      const text=[...btn.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());
      if(text)label=text.textContent.trim();
      else label=btn.querySelector('.r17-nav-copy strong')?.textContent.trim()||'';
      if(!label)return;
      label=label.replace(/\s+/g,' ').trim();
      if(MAP_RE.test(label)){btn.remove();return}
      btn.classList.add('r17-nav-enhanced');
      btn.title=DESCRIPTIONS[label]||label;
      if(!btn.querySelector('.r17-nav-copy')){
        const icon=btn.querySelector('span');
        const copy=document.createElement('span');
        copy.className='r17-nav-copy';
        copy.innerHTML=`<strong>${label}</strong><small>${DESCRIPTIONS[label]||'Acceso al módulo'}</small>`;
        if(text)text.remove();
        btn.appendChild(copy);
      }
    });
  };

  const ensureModule=(nav,key,selector,icon,label,description,handler)=>{
    if(nav.querySelector(selector)||nav.querySelector(`[data-r17-module="${key}"]`))return;
    const b=document.createElement('button');
    b.type='button';b.className='nav-item r17-nav-enhanced';b.dataset.r17Module=key;
    b.innerHTML=`<span>${icon}</span><span class="r17-nav-copy"><strong>${label}</strong><small>${description}</small></span>`;
    b.title=description;b.addEventListener('click',handler);nav.appendChild(b);
  };

  const restoreModules=()=>{
    const nav=document.querySelector('.sidebar nav');
    if(!nav)return;
    if(window.R17Calendar?.open)ensureModule(nav,'calendar','[data-r17-calendar]','📅','Calendario','Eventos y planificación regional',e=>{e.preventDefault();window.R17Calendar.open()});
    if(window.R17Library?.open)ensureModule(nav,'library','[data-r17-tool="library"]','📚','Biblioteca','Recursos académicos y documentos',e=>{e.preventDefault();window.R17Library.open()});
  };

  const polishActions=()=>{
    document.querySelectorAll('.btn,.icon-action,.side-action').forEach(b=>{
      if(!b.getAttribute('aria-label')&&!b.title&&b.textContent.trim())b.setAttribute('aria-label',b.textContent.trim());
    });
    document.querySelectorAll('#quickAdd').forEach(b=>{
      const t=b.textContent.trim();
      const map={Centro:'Añadir un centro educativo',Actividad:'Registrar una actividad',Evento:'Programar un evento',Voluntario:'Registrar un voluntario'};
      const k=Object.keys(map).find(x=>t.includes(x));
      if(k){b.title=map[k];b.setAttribute('aria-label',`${t}. ${map[k]}`)}
    });
  };

  const fix=()=>{
    if(fixing)return;
    fixing=true;
    try{addStyles();removeMap();decorateNav();restoreModules();polishActions()}
    finally{fixing=false}
  };

  const boot=()=>{fix();new MutationObserver(fix).observe(document.body,{childList:true,subtree:true})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
