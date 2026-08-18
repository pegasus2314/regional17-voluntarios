/* Regional 17 · MUN · State bridge
   Sincroniza la selección del modelo/comisión sin recargar la página.
   El renderer de MUN conserva el control de navegación y renderiza la vista
   inmediatamente, evitando la caída causada por window.location.reload().
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
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('[MUN] No se pudo persistir la selección:', error);
    }
  }

  // No cancelamos el click: mun-replace.js necesita recibirlo para renderizar.
  document.addEventListener('click', event => {
    const modelCard = event.target.closest?.('[data-model]');
    if (modelCard) {
      const state = read();
      state.selectedModel = modelCard.dataset.model || null;
      state.selectedCommission = null;
      write(state);
      return;
    }

    const commissionCard = event.target.closest?.('[data-com]');
    if (commissionCard) {
      const state = read();
      state.selectedCommission = commissionCard.dataset.com || null;
      write(state);
    }
  }, true);
})();
