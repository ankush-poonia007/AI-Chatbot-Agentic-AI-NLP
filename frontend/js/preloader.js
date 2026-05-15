(function () {
  const FLAG = 'neurachat-preloader-shown';

  function shouldShow() {
    try {
      return !sessionStorage.getItem(FLAG);
    } catch {
      return true;
    }
  }

  function markShown() {
    try {
      sessionStorage.setItem(FLAG, '1');
    } catch (_) {}
  }

  function init() {
    if (!shouldShow()) return;

    const overlay = document.createElement('div');
    overlay.id = 'nc-preloader';
    overlay.className =
      'fixed inset-0 z-[200] flex items-center justify-center bg-[var(--bg-primary)]';
    overlay.innerHTML =
      '<div class="flex flex-col items-center gap-4">' +
      '<div class="nc-preloader-logo w-14 h-14 rounded-full border-2 border-[var(--accent)] shadow-[0_0_24px_var(--accent-glow-strong)] animate-pulse"></div>' +
      '<span class="font-display font-bold text-lg text-[var(--text-primary)] tracking-tight">NeuraChat</span>' +
      '</div>';
    document.body.appendChild(overlay);

    const done = () => {
      markShown();
      if (typeof gsap !== 'undefined') {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.45,
          ease: 'power2.out',
          onComplete() {
            overlay.remove();
          },
        });
      } else {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.45s ease';
        setTimeout(() => overlay.remove(), 500);
      }
    };

    const ms = Math.max(0, 1200 - (performance.now() - (window._ncPageStart || 0)));
    window.addEventListener('load', () => setTimeout(done, Math.min(ms, 400)));
    setTimeout(done, 1400);
  }

  window._ncPageStart = performance.now();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
