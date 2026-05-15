(function () {
  const CONTAINER_ID = 'nc-toast-root';

  function ensureContainer() {
    let el = document.getElementById(CONTAINER_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = CONTAINER_ID;
      el.className =
        'fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end pointer-events-none';
      document.body.appendChild(el);
    }
    return el;
  }

  const styles = {
    success: 'bg-cyan-600 text-white border border-cyan-400/40',
    error: 'bg-red-600 text-white border border-red-400/40',
    info: 'bg-slate-700 text-white border border-slate-500/40',
    warning: 'bg-amber-600 text-white border border-amber-400/40',
  };

  function show(message, type) {
    const container = ensureContainer();
    const t = type || 'info';
    const row = document.createElement('div');
    row.className =
      'pointer-events-auto max-w-sm px-4 py-3 rounded-2xl text-sm font-medium shadow-lg ' +
      (styles[t] || styles.info) +
      ' translate-x-4 opacity-0 transition-all duration-300';
    row.textContent = message;
    container.appendChild(row);
    requestAnimationFrame(() => {
      row.classList.remove('translate-x-4', 'opacity-0');
    });
    setTimeout(() => {
      row.classList.add('translate-x-4', 'opacity-0');
      setTimeout(() => row.remove(), 300);
    }, 3000);
  }

  window.Toast = { show };
})();
