(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest?.('[data-view="library"]')) return;
    const text = document.querySelector('.user-mini small')?.textContent?.trim().toLowerCase();
    if (text) window.__R17_PROFILE_ROLE = text;
  }, true);
})();
