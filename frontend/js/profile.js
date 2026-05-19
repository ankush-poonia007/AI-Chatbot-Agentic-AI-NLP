(function () {
  const DICEBEAR_BASE = 'https://api.dicebear.com/7.x/avataaars/svg?seed=';
  const AVATAR_SUFFIXES = ['', '-v2', '-v3', '-v4', '-v5'];

  const state = {
    username: '',
    avatarSeedIndex: 0,
    avatarSeeds: [],
    currentAvatarUrl: '',
    plan: 'basic',
    messageCount: 0,
    messageLimit: 50,
  };

  function $(id) {
    return document.getElementById(id);
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function refreshIcons() {
    if (window.lucide) lucide.createIcons();
  }

  function setText(el, text) {
    if (!el) return;
    if (text) {
      el.textContent = text;
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
      el.textContent = '';
    }
  }

  function setLoading(btn, labelEl, spinnerEl, loading) {
    if (!btn) return;
    btn.disabled = !!loading;
    if (labelEl) labelEl.classList.toggle('invisible', !!loading);
    if (spinnerEl) spinnerEl.classList.toggle('hidden', !loading);
  }

  function dicebearUrl(seed) {
    return DICEBEAR_BASE + encodeURIComponent(seed || 'user');
  }

  function buildAvatarSeeds(base) {
    const b = (base || 'user').trim() || 'user';
    return AVATAR_SUFFIXES.map(function (suffix) {
      return b + suffix;
    });
  }

  function formatMemberDate(value) {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }

  function nextResetDateLabel() {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return next.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  }

  function shakeEl(el) {
    if (!el || prefersReducedMotion() || typeof gsap === 'undefined') return;
    gsap.fromTo(
      el,
      { x: 0 },
      { x: [8, -8, 6, -6, 3, -3, 0], duration: 0.4, ease: 'power1.inOut' }
    );
  }

  function passwordStrength(password) {
    if (!password) {
      return { w: 0, barClass: 'bg-slate-600', textClass: 'text-[var(--text-muted)]', label: 'Password strength', level: 0 };
    }
    let c = 0;
    if (password.length >= 8) c++;
    if (password.length >= 12) c++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) c++;
    if (/\d/.test(password)) c++;
    if (/[^A-Za-z0-9]/.test(password)) c++;

    if (password.length < 8) {
      return { w: 22, barClass: 'bg-red-500', textClass: 'text-red-400', label: 'Weak', level: 1 };
    }
    if (c <= 2) {
      return { w: 25, barClass: 'bg-red-500', textClass: 'text-red-400', label: 'Weak', level: 1 };
    }
    if (c === 3) {
      return { w: 50, barClass: 'bg-amber-500', textClass: 'text-amber-400', label: 'Fair', level: 2 };
    }
    if (c === 4) {
      return { w: 75, barClass: 'bg-sky-500', textClass: 'text-sky-400', label: 'Good', level: 3 };
    }
    return { w: 100, barClass: 'bg-cyan-400', textClass: 'text-cyan-400', label: 'Strong', level: 4 };
  }

  function wirePasswordToggles(root) {
    if (!root) return;
    root.querySelectorAll('[data-toggle-password]').forEach(function (btn) {
      const id = btn.getAttribute('data-toggle-password');
      const input = id && document.getElementById(id);
      if (!input) return;
      const showIcon = btn.querySelector('.js-pw-icon-show');
      const hideIcon = btn.querySelector('.js-pw-icon-hide');
      btn.addEventListener('click', function () {
        const on = input.type === 'password';
        input.type = on ? 'text' : 'password';
        btn.setAttribute('aria-label', on ? 'Hide password' : 'Show password');
        if (showIcon) showIcon.classList.toggle('hidden', on);
        if (hideIcon) hideIcon.classList.toggle('hidden', !on);
        refreshIcons();
      });
    });
  }

  function setAvatarPreview(seed) {
    const img = $('profile-avatar');
    if (!img) return;
    state.currentAvatarUrl = dicebearUrl(seed);
    img.src = state.currentAvatarUrl;
  }

  function cycleAvatar() {
    if (!state.avatarSeeds.length) return;
    state.avatarSeedIndex = (state.avatarSeedIndex + 1) % state.avatarSeeds.length;
    setAvatarPreview(state.avatarSeeds[state.avatarSeedIndex]);
  }

  function applyPlanBadge(plan) {
    const badge = $('profile-plan-badge');
    const upgradeBtn = $('profile-upgrade-btn');
    const isPro = plan === 'pro';
    if (badge) {
      badge.textContent = isPro ? 'PRO' : 'FREE';
      badge.className =
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ' +
        (isPro
          ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
          : 'bg-[var(--bg-surface-2)] text-[var(--text-muted)]');
    }
    if (upgradeBtn) {
      upgradeBtn.classList.toggle('hidden', isPro);
    }
  }

  function applyMembership(count, limit, plan) {
    const usageText = $('profile-usage-text');
    const bar = $('profile-usage-bar');
    const resetText = $('profile-reset-text');
    const isPro = plan === 'pro' || limit == null;

    if (usageText) {
      if (isPro) {
        usageText.textContent = count + ' messages used this month (unlimited)';
      } else {
        usageText.textContent = count + ' of ' + limit + ' messages used this month';
      }
    }
    if (bar) {
      const pct = isPro ? 100 : limit > 0 ? Math.min(100, Math.round((count / limit) * 100)) : 0;
      bar.style.width = pct + '%';
    }
    if (resetText) {
      resetText.textContent = 'Resets on ' + nextResetDateLabel();
    }
  }

  function populateProfile(data) {
    if (!data || !data.success) return;

    const p = data.profile || {};
    state.username = data.username || '';
    state.plan = data.plan || 'basic';
    state.messageCount = Number(data.message_count) || 0;
    state.messageLimit = data.message_limit == null ? null : Number(data.message_limit) || 50;

    state.avatarSeeds = buildAvatarSeeds(state.username);
    state.avatarSeedIndex = 0;

    const savedAvatar = p.avatar_url || '';
    if (savedAvatar) {
      const matchIdx = state.avatarSeeds.findIndex(function (seed) {
        return savedAvatar.indexOf(encodeURIComponent(seed)) !== -1 || savedAvatar.indexOf(seed) !== -1;
      });
      if (matchIdx >= 0) state.avatarSeedIndex = matchIdx;
      state.currentAvatarUrl = savedAvatar;
    } else {
      setAvatarPreview(state.avatarSeeds[state.avatarSeedIndex]);
    }

    const avatarImg = $('profile-avatar');
    if (avatarImg && savedAvatar) avatarImg.src = savedAvatar;

    const nameInput = $('profile-display-name');
    if (nameInput) nameInput.value = p.display_name || state.username || '';

    const emailInput = $('profile-email');
    if (emailInput) emailInput.value = data.email || '';

    const memberEl = $('profile-member-since');
    if (memberEl) memberEl.textContent = formatMemberDate(data.created_at || data.member_since);

    applyPlanBadge(state.plan);
    applyMembership(state.messageCount, state.messageLimit, state.plan);
  }

  async function loadProfile() {
    try {
      const res = await fetch('/api/profile', { credentials: 'same-origin' });
      const data = await res.json().catch(function () {
        return {};
      });
      if (!data.success) {
        if (window.Toast) Toast.show(data.error || 'Could not load profile.', 'error');
        return;
      }
      populateProfile(data);
    } catch (_) {
      if (window.Toast) Toast.show('Network error. Please try again.', 'error');
    }
  }

  function initCardStagger() {
    const cards = document.querySelectorAll('#profile-cards .stagger-card');
    if (!cards.length || prefersReducedMotion() || typeof gsap === 'undefined') return;
    gsap.from(cards, {
      y: 36,
      opacity: 0,
      duration: 0.55,
      stagger: 0.15,
      ease: 'power2.out',
      delay: 0.08,
    });
  }

  function initProfileForm() {
    const form = $('profile-form');
    if (!form) return;

    const nameInput = $('profile-display-name');
    const errName = $('profile-display-name-error');
    const saveBtn = $('profile-save-btn');
    const saveLabel = $('profile-save-label');
    const saveSpinner = $('profile-save-spinner');
    const changeAvatarBtn = $('profile-change-avatar');

    changeAvatarBtn &&
      changeAvatarBtn.addEventListener('click', function () {
        cycleAvatar();
      });

    nameInput &&
      nameInput.addEventListener('input', function () {
        setText(errName, '');
      });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      setText(errName, '');

      const displayName = (nameInput && nameInput.value.trim()) || '';
      if (displayName.length < 2) {
        setText(errName, 'Display name must be at least 2 characters');
        shakeEl($('card-profile'));
        return;
      }

      setLoading(saveBtn, saveLabel, saveSpinner, true);
      try {
        const res = await fetch('/api/profile/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            display_name: displayName,
            avatar_url: state.currentAvatarUrl,
          }),
        });
        const data = await res.json().catch(function () {
          return {};
        });
        if (data.success) {
          if (window.Toast) Toast.show('Profile updated', 'success');
          return;
        }
        setText(errName, data.error || 'Could not save profile');
        shakeEl($('card-profile'));
      } catch (_) {
        if (window.Toast) Toast.show('Network error. Please try again.', 'error');
        shakeEl($('card-profile'));
      } finally {
        setLoading(saveBtn, saveLabel, saveSpinner, false);
      }
    });
  }

  function initUpgrade() {
    const btn = $('profile-upgrade-btn');
    btn &&
      btn.addEventListener('click', function () {
        if (window.Toast) Toast.show('Coming Soon', 'info');
      });
  }

  function initPasswordPanel() {
    const toggleBtn = $('profile-toggle-password');
    const panel = $('password-panel');
    const form = $('password-form');
    const cancelBtn = $('password-cancel');
    if (!panel || !form) return;

    const currentInput = $('password-current');
    const newInput = $('password-new');
    const confirmInput = $('password-confirm');
    const errCurrent = $('password-current-error');
    const errNew = $('password-new-error');
    const errConfirm = $('password-confirm-error');
    const strengthBar = $('password-strength-bar');
    const strengthText = $('password-strength-text');
    const matchOk = $('password-confirm-match');
    const matchNo = $('password-confirm-mismatch');
    const submitBtn = $('password-submit-btn');
    const submitLabel = $('password-submit-label');
    const submitSpinner = $('password-submit-spinner');

    wirePasswordToggles(form);

    function clearPasswordErrors() {
      setText(errCurrent, '');
      setText(errNew, '');
      setText(errConfirm, '');
    }

    function expandPanel(open) {
      panel.style.gridTemplateRows = open ? '1fr' : '0fr';
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    }

    function resetPasswordForm() {
      form.reset();
      clearPasswordErrors();
      updateStrength();
      updateMatchIcons();
      refreshIcons();
    }

    function updateStrength() {
      const pwd = (newInput && newInput.value) || '';
      const s = passwordStrength(pwd);
      if (strengthBar) {
        strengthBar.style.width = (pwd ? s.w : 0) + '%';
        strengthBar.className = 'h-full transition-all duration-300 rounded-full ' + (pwd ? s.barClass : 'bg-slate-600');
      }
      if (strengthText) {
        strengthText.textContent = s.level === 0 ? s.label : 'Strength: ' + s.label;
        strengthText.className = 'text-xs font-medium ' + s.textClass;
      }
    }

    function updateMatchIcons() {
      const pwd = (newInput && newInput.value) || '';
      const c = (confirmInput && confirmInput.value) || '';
      if (!matchOk || !matchNo) return;
      if (!c) {
        matchOk.classList.add('hidden');
        matchNo.classList.add('hidden');
        return;
      }
      const match = pwd === c && pwd.length > 0;
      matchOk.classList.toggle('hidden', !match);
      matchNo.classList.toggle('hidden', match);
      refreshIcons();
    }

    toggleBtn &&
      toggleBtn.addEventListener('click', function () {
        const open = panel.style.gridTemplateRows === '1fr';
        expandPanel(!open);
        if (!open) currentInput && currentInput.focus();
      });

    cancelBtn &&
      cancelBtn.addEventListener('click', function () {
        expandPanel(false);
        resetPasswordForm();
      });

    newInput &&
      newInput.addEventListener('input', function () {
        updateStrength();
        updateMatchIcons();
        setText(errNew, '');
      });
    confirmInput &&
      confirmInput.addEventListener('input', function () {
        updateMatchIcons();
        setText(errConfirm, '');
      });
    currentInput &&
      currentInput.addEventListener('input', function () {
        setText(errCurrent, '');
      });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      clearPasswordErrors();

      const current = (currentInput && currentInput.value) || '';
      const next = (newInput && newInput.value) || '';
      const confirm = (confirmInput && confirmInput.value) || '';

      let ok = true;
      if (!current) {
        setText(errCurrent, 'Enter your current password');
        ok = false;
      }
      if (next.length < 8) {
        setText(errNew, 'Password must be at least 8 characters');
        ok = false;
      }
      if (next !== confirm) {
        setText(errConfirm, 'Passwords do not match');
        ok = false;
      }
      if (!ok) {
        shakeEl($('card-security'));
        refreshIcons();
        return;
      }

      setLoading(submitBtn, submitLabel, submitSpinner, true);
      try {
        const res = await fetch('/api/auth/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            current_password: current,
            new_password: next,
          }),
        });
        const data = await res.json().catch(function () {
          return {};
        });
        if (data.success) {
          if (window.Toast) Toast.show('Password updated', 'success');
          expandPanel(false);
          resetPasswordForm();
          return;
        }
        const raw = (data.error && String(data.error)) || 'Could not update password';
        const low = raw.toLowerCase();
        if (low.includes('current') || low.includes('incorrect') || low.includes('wrong')) {
          setText(errCurrent, raw);
        } else {
          setText(errNew, raw);
        }
        shakeEl($('card-security'));
      } catch (_) {
        if (window.Toast) Toast.show('Network error. Please try again.', 'error');
        shakeEl($('card-security'));
      } finally {
        setLoading(submitBtn, submitLabel, submitSpinner, false);
        refreshIcons();
      }
    });

    updateStrength();
  }

  function initDeleteModal() {
    const modal = $('delete-modal');
    const openBtn = $('profile-delete-open');
    const cancelBtn = $('delete-modal-cancel');
    const confirmBtn = $('delete-modal-confirm');
    const backdrop = $('delete-modal-backdrop');
    if (!modal) return;

    function setOpen(open) {
      modal.classList.toggle('hidden', !open);
      modal.classList.toggle('flex', open);
      document.body.classList.toggle('overflow-hidden', open);
    }

    openBtn &&
      openBtn.addEventListener('click', function () {
        setOpen(true);
      });

    function closeModal() {
      setOpen(false);
    }

    cancelBtn && cancelBtn.addEventListener('click', closeModal);
    backdrop && backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
    });

    confirmBtn &&
      confirmBtn.addEventListener('click', async function () {
        confirmBtn.disabled = true;
        try {
          const res = await fetch('/api/auth/delete-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
          });
          const data = await res.json().catch(function () {
            return {};
          });
          if (data.success) {
            window.location.href = '/';
            return;
          }
          if (window.Toast) Toast.show(data.error || 'Could not delete account', 'error');
          shakeEl($('card-danger'));
        } catch (_) {
          if (window.Toast) Toast.show('Network error. Please try again.', 'error');
          shakeEl($('card-danger'));
        } finally {
          confirmBtn.disabled = false;
        }
      });
  }

  function boot() {
    initCardStagger();
    initProfileForm();
    initUpgrade();
    initPasswordPanel();
    initDeleteModal();
    loadProfile().then(refreshIcons);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
