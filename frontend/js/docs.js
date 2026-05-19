(function () {
  'use strict';

  var sidebar = document.getElementById('docs-sidebar');
  var mainEl = document.getElementById('docs-main');
  var searchInput = document.getElementById('docs-search');
  var sidebarToggle = document.getElementById('docs-sidebar-toggle');
  var sidebarBackdrop = document.getElementById('docs-sidebar-backdrop');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.docs-nav-link'));
  var navGroups = Array.prototype.slice.call(document.querySelectorAll('.docs-nav-group'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('.docs-section'));

  function scrollMainTo(target) {
    if (!mainEl || !target) return;
    var mainTop = mainEl.getBoundingClientRect().top;
    var targetTop = target.getBoundingClientRect().top;
    var offset = targetTop - mainTop + mainEl.scrollTop - 24;
    mainEl.scrollTo({ top: offset, behavior: 'smooth' });
  }

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      var match = link.getAttribute('data-section') === id;
      link.classList.toggle('docs-nav-link-active', match);
      if (match) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function filterSidebar(query) {
    var q = (query || '').trim().toLowerCase();
    navGroups.forEach(function (group) {
      var heading = group.querySelector('.docs-nav-heading');
      var headingText = heading ? (heading.textContent || '').toLowerCase() : '';
      var headingMatch = q && headingText.indexOf(q) !== -1;
      var items = Array.prototype.slice.call(group.querySelectorAll('.docs-nav-link'));
      var anyVisible = false;
      items.forEach(function (link) {
        var label = (link.textContent || '').toLowerCase();
        var show = !q || headingMatch || label.indexOf(q) !== -1;
        link.closest('li').classList.toggle('hidden', !show);
        if (show) anyVisible = true;
      });
      if (heading) heading.classList.toggle('hidden', !anyVisible);
      group.classList.toggle('hidden', !anyVisible);
    });
  }

  function openSidebar() {
    if (!sidebar || window.innerWidth >= 1024) return;
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('translate-x-0');
    sidebarBackdrop?.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  function closeSidebar() {
    if (!sidebar) return;
    if (window.innerWidth < 1024) {
      sidebar.classList.add('-translate-x-full');
      sidebar.classList.remove('translate-x-0');
      sidebarBackdrop?.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  }

  function initNavLinks() {
    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var id = link.getAttribute('data-section');
        var target = id ? document.getElementById(id) : null;
        if (target) {
          scrollMainTo(target);
          setActiveLink(id);
        }
        if (window.innerWidth < 1024) closeSidebar();
      });
    });
  }

  function initSearch() {
    if (!searchInput) return;
    searchInput.addEventListener('input', function () {
      filterSidebar(searchInput.value);
    });
  }

  function initSidebarToggle() {
    sidebarToggle?.addEventListener('click', function () {
      if (sidebar?.classList.contains('-translate-x-full')) openSidebar();
      else closeSidebar();
    });
    sidebarBackdrop?.addEventListener('click', closeSidebar);
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024) {
        sidebarBackdrop?.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        sidebar?.classList.remove('translate-x-0');
        sidebar?.classList.add('-translate-x-full', 'lg:translate-x-0');
      } else if (sidebar) {
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.remove('translate-x-0');
      }
    });
  }

  function initIntersectionObserver() {
    if (!mainEl || !sections.length) return;
    var observer = new IntersectionObserver(
      function (entries) {
        var visible = entries
          .filter(function (e) { return e.isIntersecting; })
          .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
        if (visible.length) setActiveLink(visible[0].target.id);
      },
      { root: mainEl, rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.1, 0.25] }
    );
    sections.forEach(function (section) { observer.observe(section); });
  }

  function initCopyButtons() {
    document.querySelectorAll('.docs-code-block').forEach(function (block) {
      var btn = block.querySelector('.docs-copy-btn');
      var code = block.querySelector('code');
      if (!btn || !code) return;
      btn.addEventListener('click', function () {
        var text = code.textContent || '';
        navigator.clipboard.writeText(text).then(function () {
          var icon = btn.querySelector('[data-lucide]');
          if (icon) {
            icon.setAttribute('data-lucide', 'check');
            if (window.lucide) lucide.createIcons();
          }
          setTimeout(function () {
            if (icon) {
              icon.setAttribute('data-lucide', 'copy');
              if (window.lucide) lucide.createIcons();
            }
          }, 2000);
        });
      });
    });
  }

  function initFaq() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var btn = item.querySelector('.faq-trigger');
      btn?.addEventListener('click', function () {
        var open = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (window.lucide) lucide.createIcons();
      });
    });
  }

  function initPageAnimations() {
    if (typeof gsap === 'undefined') return;
    gsap.from('#docs-sidebar', {
      x: -32,
      opacity: 0,
      duration: 0.55,
      ease: 'power2.out',
    });
    gsap.from('#docs-main', {
      opacity: 0,
      y: 16,
      duration: 0.55,
      delay: 0.12,
      ease: 'power2.out',
    });
  }

  initNavLinks();
  initSearch();
  initSidebarToggle();
  initIntersectionObserver();
  initCopyButtons();
  initFaq();
  initPageAnimations();

  if (window.lucide) lucide.createIcons();
})();
