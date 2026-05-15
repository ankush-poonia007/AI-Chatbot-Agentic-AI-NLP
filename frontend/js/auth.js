(function () {
  const CHAT_URL = '/chat';

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function refreshIcons() {
    if (window.lucide) lucide.createIcons();
  }

  function initAuthCardIntro() {
    const card = document.getElementById('auth-card');
    if (!card || prefersReducedMotion()) return;
    if (typeof gsap === 'undefined') return;
    gsap.from(card, {
      scale: 0.95,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  }

  function shakeCard() {
    const card = document.getElementById('auth-card');
    if (!card) return;
    if (typeof gsap !== 'undefined' && !prefersReducedMotion()) {
      gsap.fromTo(
        card,
        { x: 0 },
        {
          x: [10, -10, 8, -8, 4, -4, 0],
          duration: 0.45,
          ease: 'power1.inOut',
        }
      );
    }
  }

  function wirePasswordToggles(root) {
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

  function validEmailFormat(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function mapLoginApiError(err) {
    const e = (err || '').toLowerCase();
    if (e.includes('user not found') || e.includes('not found')) {
      return 'No account found with this email';
    }
    if (e.includes('wrong password') || e.includes('incorrect')) {
      return 'Incorrect password';
    }
    return err || 'Something went wrong. Please try again.';
  }

  function passwordStrength(password) {
    if (!password) {
      return { w: 0, barClass: 'bg-slate-500', textClass: 'text-[var(--text-muted)]', label: 'Password strength', level: 0 };
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

  function rememberEmailKey() {
    return 'neurachat-login-email';
  }

  function initLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;

    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const remember = document.getElementById('login-remember');
    const errEmail = document.getElementById('login-email-error');
    const errPassword = document.getElementById('login-password-error');
    const submitBtn = document.getElementById('login-submit');
    const submitLabel = document.getElementById('login-submit-label');
    const submitSpinner = document.getElementById('login-submit-spinner');

    try {
      const saved = localStorage.getItem(rememberEmailKey());
      if (saved && emailInput) emailInput.value = saved;
    } catch (_) {}

    wirePasswordToggles(form);

    function clearErrors() {
      setText(errEmail, '');
      setText(errPassword, '');
    }

    [emailInput, passwordInput].forEach(function (el) {
      el &&
        el.addEventListener('input', function () {
          clearErrors();
        });
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      clearErrors();

      const email = (emailInput && emailInput.value.trim()) || '';
      const password = (passwordInput && passwordInput.value) || '';

      let ok = true;
      if (!validEmailFormat(email)) {
        setText(errEmail, 'Invalid email format');
        ok = false;
      }
      if (password.length < 8) {
        setText(errPassword, 'Password must be at least 8 characters');
        ok = false;
      }
      if (!ok) {
        shakeCard();
        refreshIcons();
        return;
      }

      if (remember && remember.checked) {
        try {
          localStorage.setItem(rememberEmailKey(), email);
        } catch (_) {}
      } else {
        try {
          localStorage.removeItem(rememberEmailKey());
        } catch (_) {}
      }

      setLoading(submitBtn, submitLabel, submitSpinner, true);
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ email: email, password: password }),
        });
        const data = await res.json().catch(function () {
          return {};
        });
        if (data.success) {
          window.location.href = CHAT_URL;
          return;
        }
        const msg = mapLoginApiError(data.error);
        if (msg.includes('email') || msg.includes('account')) {
          setText(errEmail, msg);
        } else if (msg.includes('password')) {
          setText(errPassword, msg);
        } else {
          setText(errPassword, msg);
        }
        shakeCard();
      } catch (err) {
        if (window.Toast) Toast.show('Network error. Please try again.', 'error');
        shakeCard();
      } finally {
        setLoading(submitBtn, submitLabel, submitSpinner, false);
        refreshIcons();
      }
    });

    initAuthCardIntro();
  }

  function initRegister() {
    const form = document.getElementById('register-form');
    if (!form) return;

    const usernameInput = document.getElementById('register-username');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const confirmInput = document.getElementById('register-confirm');
    const terms = document.getElementById('register-terms');
    const strengthBar = document.getElementById('register-strength-bar');
    const strengthText = document.getElementById('register-strength-text');
    const errUser = document.getElementById('register-username-error');
    const errEmail = document.getElementById('register-email-error');
    const errPassword = document.getElementById('register-password-error');
    const errConfirm = document.getElementById('register-confirm-error');
    const errTerms = document.getElementById('register-terms-error');
    const matchOk = document.getElementById('register-confirm-match');
    const matchNo = document.getElementById('register-confirm-mismatch');
    const submitBtn = document.getElementById('register-submit');
    const submitLabel = document.getElementById('register-submit-label');
    const submitSpinner = document.getElementById('register-submit-spinner');

    wirePasswordToggles(form);

    function clearErrors() {
      setText(errUser, '');
      setText(errEmail, '');
      setText(errPassword, '');
      setText(errConfirm, '');
      setText(errTerms, '');
    }

    function updateStrength() {
      const pwd = (passwordInput && passwordInput.value) || '';
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
      const pwd = (passwordInput && passwordInput.value) || '';
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

    passwordInput &&
      passwordInput.addEventListener('input', function () {
        updateStrength();
        updateMatchIcons();
        clearErrors();
      });
    confirmInput &&
      confirmInput.addEventListener('input', function () {
        updateMatchIcons();
        setText(errConfirm, '');
      });
    usernameInput &&
      usernameInput.addEventListener('input', function () {
        setText(errUser, '');
      });
    emailInput &&
      emailInput.addEventListener('input', function () {
        setText(errEmail, '');
      });
    terms &&
      terms.addEventListener('change', function () {
        setText(errTerms, '');
      });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      clearErrors();

      const username = (usernameInput && usernameInput.value.trim()) || '';
      const email = (emailInput && emailInput.value.trim()) || '';
      const password = (passwordInput && passwordInput.value) || '';
      const confirm = (confirmInput && confirmInput.value) || '';

      let ok = true;
      if (username.length < 2) {
        setText(errUser, 'Please enter your full name');
        ok = false;
      }
      if (!validEmailFormat(email)) {
        setText(errEmail, 'Invalid email format');
        ok = false;
      }
      if (password.length < 8) {
        setText(errPassword, 'Password must be at least 8 characters');
        ok = false;
      }
      if (password !== confirm) {
        setText(errConfirm, 'Passwords do not match');
        ok = false;
      }
      if (terms && !terms.checked) {
        setText(errTerms, 'You must accept the terms to continue');
        ok = false;
      }
      if (!ok) {
        shakeCard();
        refreshIcons();
        return;
      }

      setLoading(submitBtn, submitLabel, submitSpinner, true);
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            username: username,
            email: email,
            password: password,
          }),
        });
        const data = await res.json().catch(function () {
          return {};
        });
        if (data.success) {
          window.location.href = CHAT_URL;
          return;
        }
        const raw = (data.error && String(data.error)) || 'Registration failed';
        const low = raw.toLowerCase();
        if (low.includes('unique') || low.includes('email') || low.includes('already')) {
          setText(errEmail, 'An account with this email may already exist');
        } else if (low.includes('username')) {
          setText(errUser, raw);
        } else {
          if (window.Toast) Toast.show(raw, 'error');
          else setText(errPassword, raw);
        }
        shakeCard();
      } catch (err) {
        if (window.Toast) Toast.show('Network error. Please try again.', 'error');
        shakeCard();
      } finally {
        setLoading(submitBtn, submitLabel, submitSpinner, false);
        refreshIcons();
      }
    });

    updateStrength();
    initAuthCardIntro();
  }

  function boot() {
    initLogin();
    initRegister();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
