// Regional 17 · Fix de foco en formularios
// Evita que un rerender/MutationObserver externo quite el foco de un campo
// mientras el usuario está escribiendo o usando Backspace.
(() => {
  'use strict';
  let editing = null;
  let restoring = false;

  function remember(el) {
    if (!el || restoring) return;
    const tag = el.tagName;
    if (!['INPUT','TEXTAREA','SELECT'].includes(tag)) return;
    if (el.disabled || el.readOnly) return;
    editing = {
      tag,
      name: el.getAttribute('name') || '',
      id: el.id || '',
      type: el.type || '',
      value: el.value,
      start: typeof el.selectionStart === 'number' ? el.selectionStart : null,
      end: typeof el.selectionEnd === 'number' ? el.selectionEnd : null,
      time: Date.now()
    };
  }

  function findReplacement() {
    if (!editing) return null;
    const candidates = Array.from(document.querySelectorAll('input,textarea,select'));
    return candidates.find(el => {
      if (el.tagName !== editing.tag) return false;
      if (editing.id && el.id === editing.id) return true;
      if (editing.name && el.getAttribute('name') === editing.name && (el.type || '') === editing.type) return true;
      return false;
    });
  }

  function restore() {
    if (!editing || restoring || Date.now() - editing.time > 3000) return;
    const el = findReplacement();
    if (!el || document.activeElement === el) return;
    // Solo restaurar si el campo sigue siendo relevante; no interferir con botones.
    restoring = true;
    try {
      el.focus({preventScroll:true});
      if (typeof el.setSelectionRange === 'function' && editing.start !== null) {
        const len = el.value.length;
        const start = Math.min(editing.start, len);
        const end = Math.min(editing.end ?? start, len);
        el.setSelectionRange(start, end);
      }
    } finally {
      setTimeout(() => { restoring = false; }, 0);
    }
  }

  document.addEventListener('focusin', e => remember(e.target), true);
  document.addEventListener('input', e => {
    remember(e.target);
    // Permite que el valor y los eventos originales terminen antes de verificar cambios.
    setTimeout(restore, 0);
  }, true);
  document.addEventListener('keydown', e => {
    const el = e.target;
    if (el && ['INPUT','TEXTAREA'].includes(el.tagName) && !['button','submit'].includes(el.type)) remember(el);
  }, true);

  const observer = new MutationObserver(() => {
    if (!editing) return;
    setTimeout(restore, 0);
  });
  observer.observe(document.body, {childList:true, subtree:true});
})();
