(function () {
  function initParticles(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0,
      h = 0,
      particles = [],
      running = true;
    const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function color() {
      const c = getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim();
      return c || 'rgba(34, 211, 238, 0.35)';
    }

    function spawn() {
      particles = [];
      const n = isDark() ? 60 : 30;
      for (let i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 1 + Math.random(),
        });
      }
    }

    function parseParticleRgb() {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim();
      const m = v.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
      if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
      return [34, 211, 238];
    }

    function step() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      const col = color();
      const rgb = parseParticleRgb();
      const maxDist = 120;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.fillStyle = col;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i],
            b = particles[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < maxDist) {
            const alpha = 0.18 * (1 - d / maxDist);
            ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(step);
    }

    document.addEventListener('visibilitychange', () => {
      running = document.visibilityState === 'visible';
      if (running) requestAnimationFrame(step);
    });

    window.addEventListener('resize', () => {
      resize();
      spawn();
    });

    resize();
    spawn();
    requestAnimationFrame(step);
  }

  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduce) {
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      });

      gsap.utils.toArray('.stagger-cards').forEach((section) => {
        const cards = section.querySelectorAll('.stagger-card');
        if (!cards.length) return;
        gsap.from(cards, {
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' },
          y: 36,
          opacity: 0,
          duration: 0.55,
          stagger: 0.15,
          ease: 'power2.out',
        });
      });

      const heroEls = ['#hero-badge', '#hero-h1', '#hero-sub', '#hero-btns'].map((s) => document.querySelector(s)).filter(Boolean);
      if (heroEls.length) {
        gsap.from(heroEls, {
          y: 24,
          opacity: 0,
          duration: 0.55,
          stagger: 0.2,
          ease: 'power2.out',
          delay: 0.05,
        });
      }

      const mock = document.querySelector('#hero-mock');
      if (mock) {
        gsap.from(mock, { x: 40, opacity: 0, duration: 0.65, ease: 'power2.out', delay: 0.4 });
      }

      const freeCard = document.querySelector('#pricing-free');
      const proCard = document.querySelector('#pricing-pro');
      if (freeCard && proCard) {
        gsap.from(freeCard, {
          scrollTrigger: { trigger: '#pricing', start: 'top 78%' },
          x: -40,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
        gsap.from(proCard, {
          scrollTrigger: { trigger: '#pricing', start: 'top 78%' },
          x: 40,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      }

      const steps = document.querySelectorAll('.how-step');
      if (steps.length) {
        gsap.from(steps, {
          scrollTrigger: { trigger: '#how-it-works', start: 'top 75%' },
          y: 28,
          opacity: 0,
          duration: 0.5,
          stagger: 0.2,
          ease: 'power2.out',
        });
      }

      const cta = document.querySelector('#cta-banner');
      if (cta) {
        gsap.from(cta, {
          scrollTrigger: { trigger: cta, start: 'top 85%' },
          opacity: 0,
          y: 20,
          duration: 0.55,
          ease: 'power2.out',
        });
      }
    }

    const canvas = document.getElementById('particle-canvas');
    if (canvas && !reduce) {
      const startParticles = () => initParticles(canvas);
      if (sessionStorage.getItem('neurachat-preloader-shown')) {
        startParticles();
      } else {
        window.addEventListener(
          'load',
          () => {
            setTimeout(startParticles, 1300);
          },
          { once: true }
        );
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGSAP);
  } else {
    initGSAP();
  }
})();
