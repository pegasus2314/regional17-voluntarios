(() => {
  'use strict';

  const clearCalendarState = (event) => {
    const target = event.target instanceof Element ? event.target.closest('.nav-item') : null;
    if (!target || target.hasAttribute('data-r17-calendar')) return;
    window.__R17_CALENDAR_OPEN__ = false;
  };

  document.addEventListener('click', clearCalendarState, true);

  const syncActiveState = () => {
    if (window.__R17_CALENDAR_OPEN__) return;
    document.querySelectorAll('.nav-item[data-r17-calendar]').forEach((button) => button.classList.remove('active'));
  };

  const observer = new MutationObserver(syncActiveState);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', syncActiveState);
  setTimeout(syncActiveState, 250);
  setTimeout(syncActiveState, 1000);
})();
