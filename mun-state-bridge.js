/* Regional 17 · MUN · State bridge
   Evita que el renderer antiguo de MUN sobrescriba el estado nuevo de localStorage.
   Al seleccionar modelo/comisión, persiste la selección y recarga para que el renderer
   vuelva a leer el estado actual. No modifica la estructura de datos existente.
*/
(() => {
  'use strict';
  const KEY = 'r17_mun_state_v2';

  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '{"models":[],"selectedModel":null,"selectedCommission":null}');
    } catch {
      return { models: [], selectedModel: null, selectedCommission: null };
    }
  }

  function write(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  document.addEventListener('click', event => {
    const modelCard = event.target.closest?.('[data-model]');
    if (modelCard) {
      const state = read();
      state.selectedModel = modelCard.dataset.model;
      state.selectedCommission = null;
      write(state);
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.reload();
      return;
    }

    const commissionCard = event.target.closest?.('[data-com]');
    if (commissionCard) {
      const state = read();
      state.selectedCommission = commissionCard.dataset.com;
      write(state);
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.reload();
    }
  }, true);
})();
