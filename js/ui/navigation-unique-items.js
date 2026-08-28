/* Regional 17 — navegación: garantiza un único elemento por módulo. */
(function () {
  'use strict';

  const MODULES = {
    acreditacion: { selector: '[data-acreditacion], .nav-item[data-module="acreditacion"]', label: 'Acreditación' },
    biblioteca: { selector: '[data-module="biblioteca"]', label: 'Biblioteca' },
    evaluaciones: { selector: '[data-module="evaluaciones"], [data-module="evaluacion"]', label: 'Evaluaciones' }
  };

  function dedupe(selector) {
    const nodes = Array.from(document.querySelectorAll(selector));
    nodes.slice(1).forEach(node => node.remove());
  }

  function run() {
    Object.values(MODULES).forEach(({ selector }) => dedupe(selector));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }

  window.RVNavigation = window.RVNavigation || {};
  window.RVNavigation.dedupeModules = run;
})();
