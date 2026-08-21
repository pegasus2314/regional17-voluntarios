/* Regional 17 — role-based visibility hardening for volunteer accounts */
(() => {
  'use strict';
  const STYLE_ID = 'r17-volunteer-visibility';

  function isVolunteer() {
    const roleEl = document.querySelector('.user-mini small');
    return (roleEl?.textContent || '').trim().toLowerCase() === 'voluntario';
  }

  function apply() {
    if (!isVolunteer()) return;
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = `
        /* Dashboard: no featured volunteers / performance */
        #content .dash-grid > .panel:has(.panel-head h3) { }
        #content .rank-row { display:none!important; }
        #content .panel:has(.rank-row) { display:none!important; }
        /* Volunteer list: hide performance column */
        #content .table-wrap table th:nth-child(4),
        #content .table-wrap table td:nth-child(4) { display:none!important; }
        /* Profile modal: hide score/performance metrics */
        .overlay .profile-head .score-big,
        .overlay .metric-grid { display:none!important; }
        /* Statistics module is not a volunteer-facing module */
        .sidebar .nav-item[data-view="stats"] { display:none!important; }
      `;
      document.head.appendChild(style);
    }

    // Remove the dashboard performance panel itself, even if it is rendered after navigation.
    document.querySelectorAll('#content .panel').forEach(panel => {
      const heading = panel.querySelector('.panel-head h3');
      if (heading && /voluntarios destacados/i.test(heading.textContent || '')) panel.remove();
    });
  }

  function boot() {
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();
