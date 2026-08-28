/* Regional 17 — JavaScript manifest
 * Preserva deliberadamente el orden actual de inicialización.
 * Los módulos siguen independientes para reducir riesgo durante la refactorización.
 */
(function () {
  'use strict';

  const scripts = [
    'config.js',
    'stability-preload.js',
    'app.js',
    'role-visibility.js?v=1',
    'admin.js',
    'admin-users.js',
    'library.js',
    'library-preview.js',
    'calendar.js',
    'calendar-realtime.js',
    'profile.js',
    'dashboard-profile.js',
    'login-banner.js',
    'form-guidance.js',
    'dark-mode.js',
    'input-focus-fix.js',
    'stats-enhanced.js',
    'chat.js',
    'chat-exit-fix.js',
    'announcements.js?v=1',
    'password-toggle.js',
    'mega-upgrade.js',
    'importacion-masiva-v2.js',
    'navigation-organization.js?v=10',
    'module-cleanup.js?v=1',
    'button-customizer.js?v=1',
    'centers-renewed.js?v=1',
    'acreditacion.js',
    'acreditacion-modern.js?v=1',
    'evaluation-results.js?v=3',
    'evaluation-results-recognition.js?v=1',
    'activities-delete.js?v=1',
    'assignments.js?v=2',
    'assignments-dashboard.js?v=1'
  ];

  function load(index) {
    if (index >= scripts.length) return;

    const script = document.createElement('script');
    script.src = '/' + scripts[index];
    script.async = false;
    script.onload = function () { load(index + 1); };
    script.onerror = function () {
      console.error('[Regional 17] No se pudo cargar:', scripts[index]);
    };
    document.body.appendChild(script);
  }

  load(0);
})();
