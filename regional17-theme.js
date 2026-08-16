(()=>{'use strict';
const css=`
@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@500;600;700;800&family=Source+Sans+3:wght@400;500;600;700&display=swap');
:root{--navy:#072144;--navy2:#0d315d;--turquoise:#7cfbdd;--sky:#b6e7ff;--bg:#f4f7fa;--line:#dfe7ee;--ink:#172033;--muted:#68778b;--white:#fff;--green:#198b63;--red:#c53d4b;--shadow:0 12px 32px rgba(7,33,68,.08)}
html,body{font-family:'Source Sans 3',system-ui,sans-serif;background:var(--bg);color:var(--ink)}
h1,h2,h3,h4,.brand strong,.hero h2,.login-brand h1,.topbar h1{font-family:'Barlow',system-ui,sans-serif}
.nav-item,.eyebrow,.hero-kicker,.pill,.status,.btn,.toolbar select,.table-wrap th,field>label{font-family:'Barlow',system-ui,sans-serif}
.sidebar{background:linear-gradient(180deg,#072144 0%,#0a2b50 58%,#071d39 100%);box-shadow:8px 0 28px rgba(7,33,68,.12)}
.brand{padding-bottom:30px}.brand-mark{background:var(--turquoise);color:var(--navy);box-shadow:0 0 0 5px rgba(124,251,221,.08)}.brand span{color:#b6e7ff}.nav-item{color:#b9c9da;border-left:3px solid transparent}.nav-item:hover,.nav-item.active{background:rgba(124,251,221,.10);color:#fff;border-left-color:var(--turquoise)}
.topbar{box-shadow:0 1px 12px rgba(7,33,68,.04)}.topbar h1{font-size:22px;letter-spacing:-.2px}.live{color:var(--green)}
.main>#content{padding-top:28px}.hero{background:radial-gradient(circle at 85% 20%,rgba(124,251,221,.18),transparent 28%),linear-gradient(135deg,#072144 0%,#0d315d 68%,#12436f 100%);box-shadow:var(--shadow);border:1px solid rgba(182,231,255,.12)}.hero h2{font-size:28px}.hero-orb{color:var(--turquoise);border-color:rgba(124,251,221,.35);background:rgba(124,251,221,.08);box-shadow:inset 0 0 30px rgba(124,251,221,.05)}
.stat-card,.panel,.table-wrap,.activity-card,.center-card,.event-card{border-color:var(--line);box-shadow:0 5px 18px rgba(7,33,68,.045)}.stat-card:hover,.activity-card:hover,.center-card:hover,.event-card:hover{transform:translateY(-1px);box-shadow:var(--shadow);transition:.18s ease}.stat-icon{background:rgba(182,231,255,.35);color:var(--navy2)}
.btn{border-radius:10px}.btn.primary{background:var(--navy);border-color:var(--navy)}.btn.primary:hover{background:#0d315d;border-color:#0d315d}.btn.primary:focus{box-shadow:0 0 0 3px rgba(124,251,221,.25)}
.table-wrap th{background:#edf8fc;color:#4d6379}.table-wrap td{font-size:11px}.scorebar span,.bar i{background:linear-gradient(90deg,#0d315d,#35bfa3)}
.toolbar select,.search,field input,field select,field textarea{border-color:#d5e0e8}.search:focus-within{border-color:#7cfbdd;box-shadow:0 0 0 3px rgba(124,251,221,.16)}
.center-icon,.event-date,.date-box{background:rgba(182,231,255,.30);color:#0d315d}.pill.success,.status.active{background:rgba(124,251,221,.22);color:#08745c}.status.wait{background:rgba(182,231,255,.35);color:#175b7c}
.segmented{background:#e4edf3}.segmented button.active{color:var(--navy);box-shadow:0 1px 4px rgba(7,33,68,.08)}
.login-brand{background:radial-gradient(circle at 80% 18%,rgba(124,251,221,.16),transparent 30%),linear-gradient(150deg,#072144,#0d315d 72%,#12436f)}.login-brand h1{letter-spacing:-1px}.login-brand p{color:#cbe9f5}.login-points span{border-color:rgba(182,231,255,.2);background:rgba(182,231,255,.06)}
.avatar{background:#e8f7fb;color:#0d315d}.side-action:hover{border-color:rgba(124,251,221,.45);color:#fff}
.map{box-shadow:var(--shadow);border:1px solid #dbe5ed}.popup button:hover{border-color:#7cfbdd;background:#f3fffc}
.toast{background:#072144}.toast.error{background:#9f2939}
.icon-action:hover{border-color:#7cfbdd;background:#f3fffc;color:#072144}
@media(max-width:760px){.hero{border-radius:14px}.topbar h1{font-size:18px}.main>#content{padding-top:18px}}
`;
function apply(){if(document.getElementById('r17-brand-theme'))return;const s=document.createElement('style');s.id='r17-brand-theme';s.textContent=css;document.head.appendChild(s)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
})();
