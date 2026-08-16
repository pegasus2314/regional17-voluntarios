/* Regional 17 — Visual System 3.0 */
(() => {
  'use strict';

  const MAP_RE = /^\s*mapa\s*$/i;

  const css = `
    :root{
      --r17-navy:#071b35;--r17-navy-2:#0c315b;--r17-blue:#1f6aa8;--r17-gold:#eeb44a;
      --r17-bg:#f5f7fb;--r17-card:#ffffff;--r17-line:#e4e9f0;--r17-ink:#12243d;
      --r17-muted:#748198;--r17-shadow:0 14px 40px rgba(8,28,50,.07);
    }
    html,body{background:var(--r17-bg)!important;color:var(--r17-ink)!important}
    body{font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important}
    button,input,select,textarea{font-family:inherit!important}

    /* LOGIN */
    .login{min-height:100vh!important;display:grid!important;grid-template-columns:minmax(0,1.08fr) minmax(420px,.92fr)!important;background:#f7f9fc!important;overflow:hidden!important;position:relative!important}
    .login-brand{position:relative!important;min-height:100vh!important;padding:clamp(42px,7vw,92px)!important;justify-content:center!important;background:radial-gradient(circle at 80% 17%,rgba(238,180,74,.20),transparent 23%),radial-gradient(circle at 8% 92%,rgba(31,106,168,.22),transparent 32%),linear-gradient(145deg,#041426 0%,#08294d 58%,#0e416e 100%)!important;color:#fff!important}
    .login-brand:after{content:"17";position:absolute;right:6%;bottom:-12%;font-size:clamp(180px,28vw,430px);font-weight:900;line-height:.8;letter-spacing:-.08em;color:rgba(255,255,255,.035);pointer-events:none}
    .login-brand .brand-mark{width:68px!important;height:68px!important;border-radius:20px!important;background:linear-gradient(145deg,#ffd77e,#e9a52f)!important;color:#3a2907!important;box-shadow:0 18px 36px rgba(0,0,0,.22)!important;margin-bottom:25px!important;z-index:1!important}
    .login-brand .hero-kicker{font-size:10px!important;letter-spacing:2.4px!important;color:#b9cce0!important;z-index:1!important}
    .login-brand h1{font-size:clamp(42px,5.6vw,76px)!important;line-height:.98!important;letter-spacing:-3.2px!important;margin:13px 0 18px!important;max-width:760px!important;color:#fff!important;z-index:1!important}
    .login-brand h1 span{color:#ffd477!important}
    .login-brand>p{max-width:620px!important;font-size:15px!important;line-height:1.75!important;color:#c0d0e1!important;z-index:1!important}
    .login-points{grid-template-columns:repeat(2,minmax(0,250px))!important;gap:10px!important;margin-top:30px!important;z-index:1!important}
    .login-points span{padding:12px 14px!important;border-radius:12px!important;border:1px solid rgba(255,255,255,.10)!important;background:rgba(255,255,255,.055)!important;color:#dbe8f5!important;backdrop-filter:blur(10px)!important;font-size:10px!important}
    .login-form{align-self:center!important;width:min(470px,calc(100% - 58px))!important;margin:auto!important;padding:42px!important;border-radius:24px!important;background:rgba(255,255,255,.96)!important;border:1px solid #dfe6ee!important;box-shadow:0 30px 90px rgba(8,28,50,.13)!important}
    .login-form h2{font-size:31px!important;letter-spacing:-1px!important;margin:8px 0 6px!important}
    .login-form>p{font-size:12px!important;color:var(--r17-muted)!important;margin-bottom:27px!important}
    .login-form field{display:block!important}
    .login-form field label{display:block!important;font-size:10px!important;font-weight:750!important;color:#506074!important;margin-bottom:7px!important}
    .login-form field input{width:100%!important;height:50px!important;border-radius:12px!important;border:1px solid #d8e1eb!important;background:#fbfcfe!important;padding:0 14px!important;font-size:12px!important}
    .login-form field input:focus{border-color:#5d8db8!important;box-shadow:0 0 0 4px rgba(31,106,168,.09)!important;outline:0!important}
    .login-form .btn.full{width:100%!important;height:50px!important;border-radius:12px!important;margin-top:4px!important}
    .login-form>small{display:block!important;text-align:center!important;margin-top:20px!important;color:#8996a8!important;font-size:9px!important}

    /* APP SHELL */
    .sidebar{width:266px!important;min-width:266px!important;background:linear-gradient(180deg,#04172d 0%,#092b4f 62%,#0c3965 100%)!important;box-shadow:10px 0 38px rgba(3,18,35,.11)!important;padding:20px 13px!important}
    .brand{padding:6px 10px 27px!important}.brand strong{font-size:14px!important}.brand span{font-size:9px!important;color:#8fa6be!important}.brand-mark{box-shadow:0 9px 22px rgba(238,180,74,.18)!important}
    .nav-item{min-height:55px!important;border-radius:12px!important;transition:.18s ease!important}.nav-item:hover{background:rgba(255,255,255,.06)!important}.nav-item.active{background:linear-gradient(90deg,rgba(238,180,74,.18),rgba(238,180,74,.04))!important;box-shadow:inset 3px 0 #eeb44a!important;color:#ffd477!important}
    .topbar{min-height:82px!important;padding:15px 30px!important;background:rgba(255,255,255,.95)!important;border-bottom:1px solid var(--r17-line)!important;box-shadow:0 2px 24px rgba(8,28,50,.045)!important;backdrop-filter:blur(14px)!important}
    .topbar h1{font-size:23px!important;letter-spacing:-.7px!important;color:var(--r17-ink)!important}.main>#content{padding:30px!important;max-width:1500px!important}

    /* DASHBOARD */
    .hero{min-height:240px!important;padding:36px 40px!important;border-radius:24px!important;position:relative!important;overflow:hidden!important;background:radial-gradient(circle at 86% 18%,rgba(238,180,74,.23),transparent 21%),radial-gradient(circle at 72% 110%,rgba(57,139,205,.22),transparent 32%),linear-gradient(125deg,#061a32,#0b315b 62%,#124b7c)!important;box-shadow:0 20px 50px rgba(7,27,53,.14)!important}
    .hero:after{content:"R17";position:absolute;right:42px;top:50%;transform:translateY(-50%);font-size:150px;font-weight:900;letter-spacing:-.08em;color:rgba(255,255,255,.035);pointer-events:none}
    .hero h2{font-size:32px!important;letter-spacing:-1.2px!important;max-width:720px!important}.hero p{font-size:13px!important;line-height:1.7!important;max-width:650px!important;color:#c4d6e8!important}
    .stats-grid{gap:13px!important;margin:18px 0!important}.stat-card{min-height:98px!important;border-radius:16px!important;border:1px solid var(--r17-line)!important;box-shadow:var(--r17-shadow)!important;padding:17px!important;transition:.18s ease!important}.stat-card:hover{transform:translateY(-3px)!important;box-shadow:0 18px 42px rgba(8,28,50,.10)!important}.stat-icon{width:40px!important;height:40px!important;border-radius:12px!important}.stat-card strong{font-size:21px!important}.stat-card span{font-size:8px!important}
    .dash-grid{gap:16px!important}.panel{border:1px solid var(--r17-line)!important;border-radius:17px!important;box-shadow:var(--r17-shadow)!important;padding:20px!important}.panel h3{font-size:15px!important}.panel p{font-size:9px!important}

    /* FULL-SCREEN LIBRARY / CALENDAR */
    body:has(.overlay .library-modal),body:has(.overlay .calendar-modal){overflow:hidden!important}
    .overlay:has(.library-modal),.overlay:has(.calendar-modal){position:fixed!important;inset:0!important;padding:0!important;display:block!important;background:#f5f7fb!important;z-index:9999!important}
    .overlay:has(.library-modal) .library-modal,.overlay:has(.calendar-modal) .calendar-modal{width:100vw!important;height:100vh!important;max-width:none!important;max-height:none!important;margin:0!important;border-radius:0!important;display:flex!important;flex-direction:column!important;background:#f5f7fb!important;box-shadow:none!important;border:0!important}
    .overlay:has(.library-modal) .modal-head,.overlay:has(.calendar-modal) .modal-head{min-height:78px!important;padding:17px 28px!important;background:#fff!important;border-bottom:1px solid var(--r17-line)!important;align-items:center!important;flex:none!important}
    .overlay:has(.library-modal) .modal-body,.overlay:has(.calendar-modal) .modal-body{flex:1!important;min-height:0!important;overflow:auto!important;padding:28px!important;background:#f5f7fb!important}
    .overlay:has(.library-modal) .library-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.overlay:has(.library-modal) .library-card{min-height:145px!important;border-radius:16px!important;box-shadow:0 8px 28px rgba(8,28,50,.055)!important}
    .overlay:has(.calendar-modal) .calendar-head{max-width:1200px!important;margin:0 auto 16px!important}.overlay:has(.calendar-modal) .cal-grid,.overlay:has(.calendar-modal) .cal-week{max-width:1200px!important;margin-left:auto!important;margin-right:auto!important}.overlay:has(.calendar-modal) .cal-day{min-height:120px!important;background:#fff!important}.overlay:has(.calendar-modal) .timeline{max-width:1100px!important}
    .r17-full-back{display:inline-flex!important;align-items:center!important;gap:7px!important;height:36px!important;padding:0 12px!important;border:1px solid #dce4ed!important;border-radius:9px!important;background:#fff!important;color:#173c63!important;font-size:10px!important;font-weight:750!important;margin-right:6px!important}.r17-full-back:hover{background:#f4f7fb!important}

    /* MAP MUST NOT APPEAR */
    [data-view="map"],[data-r17-map]{display:none!important}

    @media(max-width:1180px){.login{grid-template-columns:1fr!important}.login-brand{min-height:45vh!important}.login-form{margin:28px auto 45px!important}.stats-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}.dash-grid{grid-template-columns:1fr!important}}
    @media(max-width:760px){.sidebar{width:270px!important;min-width:270px!important;position:fixed!important;left:-275px!important;z-index:900!important;transition:left .22s ease!important}.sidebar.open{left:0!important}.topbar{padding:13px 16px!important}.main>#content{padding:16px 13px 30px!important}.hero{min-height:205px!important;padding:24px!important}.hero h2{font-size:24px!important}.hero:after{font-size:100px;right:-10px}.stats-grid{grid-template-columns:1fr 1fr!important;gap:9px!important}.stat-card{min-height:82px!important;padding:12px!important}.login-brand{min-height:43vh!important;padding:34px 24px 28px!important}.login-brand h1{font-size:42px!important;letter-spacing:-2px!important}.login-form{width:calc(100% - 28px)!important;padding:27px!important}.login-points{grid-template-columns:1fr 1fr!important;gap:7px!important}.login-points span{font-size:8px!important;padding:9px!important}.overlay:has(.library-modal) .modal-body,.overlay:has(.calendar-modal) .modal-body{padding:15px!important}.overlay:has(.library-modal) .library-grid{grid-template-columns:1fr!important}.overlay:has(.library-modal) .modal-head,.overlay:has(.calendar-modal) .modal-head{padding:12px 14px!important}.overlay:has(.calendar-modal) .cal-day{min-height:76px!important;padding:5px!important}}
  `;

  function addStyles(){
    let style=document.getElementById('r17-v3-css');
    if(!style){style=document.createElement('style');style.id='r17-v3-css';document.head.appendChild(style)}
    style.textContent=css;
  }

  function textFixes(){
    document.querySelectorAll('.login-brand h1').forEach(h=>{
      if(!h.dataset.r17TextFixed){h.innerHTML='Voluntarios Regional<br><span>17</span>';h.dataset.r17TextFixed='1'}
    });
    document.querySelectorAll('.login-brand .hero-kicker').forEach(x=>x.textContent='VOLUNTARIOS · REGIONAL 17 · MONTE PLATA');
    document.querySelectorAll('.login-brand>p').forEach(p=>{
      if(!p.dataset.r17TextFixed){p.textContent='Plataforma institucional para gestionar voluntarios, actividades, centros educativos, eventos y recursos académicos de la Regional 17.';p.dataset.r17TextFixed='1'}
    });
    document.querySelectorAll('.login-points span').forEach(x=>{if(/mapa/i.test(x.textContent||''))x.remove()});
    document.querySelectorAll('.brand strong').forEach(x=>x.textContent='Voluntarios Regional 17');
    document.querySelectorAll('.brand span').forEach(x=>x.textContent='Plataforma de gestión');
    document.querySelectorAll('.hero-kicker').forEach(x=>{if(x.closest('.hero'))x.textContent='VOLUNTARIOS REGIONAL 17'});
  }

  function removeMap(){
    document.querySelectorAll('[data-view="map"],[data-r17-map]').forEach(el=>el.remove());
    document.querySelectorAll('.nav-item').forEach(btn=>{if(MAP_RE.test((btn.textContent||'').trim()))btn.remove()});
  }

  function decorateNav(){
    const nav=document.querySelector('.sidebar nav');if(!nav)return;
    nav.querySelectorAll('.nav-item').forEach(btn=>{if(btn.matches('[data-view="map"]')){btn.remove();return}if(MAP_RE.test((btn.textContent||'').trim())){btn.remove();return}btn.classList.add('r17-nav-v3')});
  }

  function addBackButton(){
    document.querySelectorAll('.overlay:has(.library-modal),.overlay:has(.calendar-modal)').forEach(overlay=>{
      const head=overlay.querySelector('.modal-head');if(!head||head.querySelector('.r17-full-back'))return;
      const close=head.querySelector('[data-close]');if(!close)return;
      const back=document.createElement('button');back.type='button';back.className='r17-full-back';back.innerHTML='← Volver al dashboard';back.onclick=()=>close.click();
      close.parentElement.insertBefore(back,close);
    });
  }

  function fix(){addStyles();textFixes();removeMap();decorateNav();addBackButton()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix,{once:true});else fix();
  new MutationObserver(fix).observe(document.body,{childList:true,subtree:true});
})();