(() => {
  'use strict';

  // The calendar module uses a MutationObserver. Keep that observer from
  // reopening the calendar after the user navigates to another section.
  // The original symptom was: click another menu item -> calendar replaces
  // the section -> buttons appear only again after F5.
  const clearCalendarState = (event) => {
    const target = event.target instanceof Element ? event.target.closest('.nav-item') : null;
    if (!target) return;
    if (target.hasAttribute('data-r17-calendar')) return;
    window.__R17_CALENDAR_OPEN__ = false;
  };

  // Capture runs before the calendar's button-level handler and before the
  // main app's navigation handler, so normal navigation always clears the
  // calendar state first.
  document.addEventListener('click', clearCalendarState, true);

  // If the main app rebuilds the sidebar, make sure the calendar button is
  // never left visually active while another section is selected.
  const syncActiveState = () => {
    if (window.__R17_CALENDAR_OPEN__) return;
    document.querySelectorAll('.nav-item').forEach((button) => {
      if (button.hasAttribute('data-r17-calendar')) button.classList.remove('active');
    });
  };

  const observer = new MutationObserver(syncActiveState);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', syncActiveState);
  setTimeout(syncActiveState, 250);
  setTimeout(syncActiveState, 1000);
})();
