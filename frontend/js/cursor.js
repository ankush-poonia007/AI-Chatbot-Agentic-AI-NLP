(function () {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  let inner, ring;
  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;
  let hover = false;

  const sel = 'a, button, [role="button"], input, textarea, select, summary';

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function tick() {
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    const innerScale = hover ? 0 : 1;
    const ringScale = hover ? 1.5 : 1;
    if (inner) {
      inner.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%) scale(${innerScale})`;
    }
    if (ring) {
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${ringScale})`;
    }
    requestAnimationFrame(tick);
  }

  function init() {
    document.body.classList.add('nc-cursor-active');

    inner = document.createElement('div');
    inner.className =
      'nc-cursor-inner fixed top-0 left-0 w-3 h-3 rounded-full bg-[var(--accent)] pointer-events-none z-[300] mix-blend-difference';

    ring = document.createElement('div');
    ring.className =
      'nc-cursor-ring fixed top-0 left-0 w-7 h-7 rounded-full border border-[var(--accent)] opacity-60 pointer-events-none z-[299] mix-blend-difference';

    document.body.appendChild(ring);
    document.body.appendChild(inner);

    document.addEventListener(
      'mousemove',
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        const el = document.elementFromPoint(mx, my);
        hover = !!(el && el.closest(sel));
      },
      { passive: true }
    );

    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
