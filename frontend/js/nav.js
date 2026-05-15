(function () {
  const root = document.getElementById('nav-root');
  if (!root) return;

  const navHTML = `
<header id="site-header" class="fixed top-0 left-0 right-0 z-[150] transition-all duration-300">
  <nav id="site-nav" class="mx-auto max-w-6xl px-4 sm:px-6 mt-4 rounded-2xl border border-transparent flex items-center justify-between gap-4 py-3 px-4 sm:px-5">
    <a href="/" class="flex items-center gap-2 shrink-0 group">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="shrink-0">
        <circle cx="16" cy="16" r="6" fill="#22d3ee" class="group-hover:scale-110 transition-transform origin-center"/>
        <circle cx="16" cy="16" r="12" stroke="#22d3ee" stroke-opacity="0.5" stroke-width="1.5"/>
      </svg>
      <span class="font-display font-bold text-lg tracking-tight text-[var(--text-primary)]">NeuraChat</span>
    </a>
    <div class="hidden lg:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
      <a href="#features" class="hover:text-[var(--accent)] transition-colors">Features</a>
      <a href="/docs.html" class="hover:text-[var(--accent)] transition-colors">Docs</a>
      <a href="#pricing" class="hover:text-[var(--accent)] transition-colors">Pricing</a>
      <a href="/contact.html" class="hover:text-[var(--accent)] transition-colors">Contact</a>
    </div>
    <div class="flex items-center gap-2 sm:gap-3">
      <button type="button" data-theme-toggle class="p-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--border-accent)] transition-all" aria-label="Toggle theme">
        <i data-theme-icon data-lucide="sun" class="w-5 h-5"></i>
      </button>
      <a href="/login.html" class="hidden sm:inline-flex px-4 py-2 rounded-full border border-[var(--border)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all">Login</a>
      <a href="/login.html" class="inline-flex px-4 py-2 sm:px-5 rounded-full text-sm font-semibold text-[#0f1117] bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-all shadow-[var(--shadow-accent)]">Get Started</a>
      <button type="button" id="nav-open" class="lg:hidden p-2.5 rounded-full border border-[var(--border)] text-[var(--text-primary)]" aria-label="Open menu">
        <i data-lucide="menu" class="w-5 h-5"></i>
      </button>
    </div>
  </nav>
</header>
<div id="nav-overlay" class="fixed inset-0 z-[160] bg-[var(--bg-primary)]/95 backdrop-blur-lg opacity-0 pointer-events-none transition-opacity duration-300 lg:hidden flex flex-col">
  <div class="flex justify-between items-center p-6 border-b border-[var(--border)]">
    <span class="font-display font-bold text-xl">Menu</span>
    <button type="button" id="nav-close" class="p-2 rounded-full border border-[var(--border)]" aria-label="Close menu">
      <i data-lucide="x" class="w-6 h-6"></i>
    </button>
  </div>
  <div class="flex flex-col gap-6 p-8 text-lg font-medium text-[var(--text-primary)]">
    <a href="#features" class="nav-overlay-link">Features</a>
    <a href="/docs.html" class="nav-overlay-link">Docs</a>
    <a href="#pricing" class="nav-overlay-link">Pricing</a>
    <a href="/contact.html" class="nav-overlay-link">Contact</a>
    <a href="/login.html" class="mt-4 text-[var(--accent)]">Login</a>
  </div>
</div>`;

  root.innerHTML = navHTML;

  const nav = document.getElementById('site-nav');
  const overlay = document.getElementById('nav-overlay');
  const openBtn = document.getElementById('nav-open');
  const closeBtn = document.getElementById('nav-close');

  function setScrolled(on) {
    if (!nav) return;
    if (on) {
      nav.classList.add(
        'bg-[var(--bg-surface)]/85',
        'backdrop-blur-xl',
        'border-[var(--border)]',
        'shadow-[var(--shadow)]'
      );
      nav.classList.remove('border-transparent');
    } else {
      nav.classList.remove(
        'bg-[var(--bg-surface)]/85',
        'backdrop-blur-xl',
        'border-[var(--border)]',
        'shadow-[var(--shadow)]'
      );
      nav.classList.add('border-transparent');
    }
  }

  function onScroll() {
    setScrolled(window.scrollY > 50);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function openMenu() {
    if (!overlay) return;
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons();
  }

  function closeMenu() {
    if (!overlay) return;
    overlay.classList.add('opacity-0', 'pointer-events-none');
    overlay.classList.remove('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = '';
  }

  openBtn?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  overlay?.querySelectorAll('.nav-overlay-link').forEach((a) => {
    a.addEventListener('click', closeMenu);
  });

  if (window.NeuraChatTheme) {
    NeuraChatTheme.apply(NeuraChatTheme.getPreferred());
  }
  if (window.lucide) lucide.createIcons();
})();
