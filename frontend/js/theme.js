(function () {
  const STORAGE_KEY = 'neurachat-theme';

  function getPreferred() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'dark';
    } catch {
      return 'dark';
    }
  }

  function syncIcons() {
    const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    document.querySelectorAll('[data-theme-icon]').forEach((el) => {
      el.setAttribute('data-lucide', theme === 'light' ? 'moon' : 'sun');
    });
    if (window.lucide) lucide.createIcons();
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
    syncIcons();
  }

  function toggle() {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (_) {}
    apply(next);
  }

  function init() {
    apply(getPreferred());
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-theme-toggle]');
      if (btn) {
        e.preventDefault();
        toggle();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.NeuraChatTheme = { apply, toggle, getPreferred, syncIcons };
})();
