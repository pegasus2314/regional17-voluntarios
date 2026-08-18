/* Regional 17 · Conexión del módulo de asignaciones */
(() => {
  'use strict';
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-module="asignaciones"]');
    if (!btn) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    document.getElementById('rv-evaluation-dashboard')?.remove();
    window.RV_EVALUATION_ASSIGNMENTS?.open();
  }, true);
})();
