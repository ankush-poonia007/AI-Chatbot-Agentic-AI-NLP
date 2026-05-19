// contact.js — NeuraChat Contact Page Logic

const SUPPORT_EMAIL = 'neurachat.support@gmail.com';

let ejsConfig = null;

// Fetch EmailJS keys from Flask
async function loadConfig() {
  try {
    const res = await fetch('/api/config');
    const data = await res.json();
    ejsConfig = data;
    if (data.emailjs_public_key) {
      emailjs.init(data.emailjs_public_key);
    }
  } catch (e) {
    console.warn('Could not load config:', e);
  }
}

// Field focus styles
function addFocusStyles() {
  document.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('focus', () => {
      el.style.borderColor = 'var(--accent)';
      el.style.boxShadow = '0 0 0 3px var(--accent-glow)';
    });
    el.addEventListener('blur', () => {
      el.style.borderColor = 'var(--border)';
      el.style.boxShadow = 'none';
    });
  });
}

// Character counter
function initCharCount() {
  const msg = document.getElementById('field-message');
  const counter = document.getElementById('char-count');
  if (!msg || !counter) return;
  msg.addEventListener('input', () => {
    counter.textContent = `${msg.value.length} / 1000`;
  });
}

// Show inline field error
function showError(id, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden');
}

// Clear all errors
function clearErrors() {
  ['err-name', 'err-email', 'err-message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
}

// Shake animation on validation fail
function shakeForm() {
  const card = document.getElementById('contact-card');
  if (!card) return;
  gsap.fromTo(card,
    { x: -8 },
    { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)',
      keyframes: { x: [-8, 8, -6, 6, -4, 4, 0] } }
  );
}

// Validate form
function validate(name, email, message) {
  let valid = true;
  clearErrors();

  if (name.trim().length < 2) {
    showError('err-name', 'Name must be at least 2 characters');
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    showError('err-email', 'Please enter a valid email address');
    valid = false;
  }

  if (message.trim().length < 20) {
    showError('err-message', 'Message must be at least 20 characters');
    valid = false;
  }

  return valid;
}

// Show success state
function showSuccess(email) {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('success-state');
  const emailSpan = document.getElementById('success-email');

  if (emailSpan) emailSpan.textContent = email;

  gsap.to(form, {
    opacity: 0, duration: 0.3, onComplete: () => {
      form.classList.add('hidden');
      success.classList.remove('hidden');
      gsap.fromTo(success, { opacity: 0 }, { opacity: 1, duration: 0.3 });

      // Animate check icon
      const icon = document.getElementById('success-icon');
      gsap.fromTo(icon,
        { scale: 0 },
        { scale: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 0.1 }
      );
    }
  });
}

// Reset to form state
function resetForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('success-state');

  gsap.to(success, {
    opacity: 0, duration: 0.3, onComplete: () => {
      success.classList.add('hidden');
      form.classList.remove('hidden');
      form.reset();
      document.getElementById('char-count').textContent = '0 / 1000';
      clearErrors();
      gsap.fromTo(form, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }
  });
}

// Set button loading state
function setLoading(loading) {
  const btn = document.getElementById('btn-submit');
  const text = document.getElementById('btn-text');
  const spinner = document.getElementById('btn-spinner');
  const icon = btn.querySelector('[data-lucide="send"]');

  btn.disabled = loading;
  btn.style.opacity = loading ? '0.7' : '1';

  if (loading) {
    text.textContent = 'Sending...';
    spinner.classList.remove('hidden');
    if (icon) icon.classList.add('hidden');
  } else {
    text.textContent = 'Send Message';
    spinner.classList.add('hidden');
    if (icon) icon.classList.remove('hidden');
  }
}

// Submit handler
async function handleSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('field-name').value;
  const email = document.getElementById('field-email').value;
  const subject = document.getElementById('field-subject').value;
  const message = document.getElementById('field-message').value;

  if (!validate(name, email, message)) {
    shakeForm();
    return;
  }

  // Check config loaded
  if (!ejsConfig ||
      !ejsConfig.emailjs_service_id ||
      !ejsConfig.emailjs_template_id ||
      ejsConfig.emailjs_service_id.includes('YOUR_')) {
    if (typeof Toast !== 'undefined') {
      Toast.show('Contact form not configured yet', 'info');
    }
    return;
  }

  setLoading(true);

  try {
    await emailjs.send(
      ejsConfig.emailjs_service_id,
      ejsConfig.emailjs_template_id,
      {
        from_name: name.trim(),
        from_email: email.trim(),
        subject: subject,
        message: message.trim(),
        to_email: SUPPORT_EMAIL
      }
    );
    showSuccess(email.trim());
  } catch (err) {
    console.error('EmailJS error:', err);
    if (typeof Toast !== 'undefined') {
      Toast.show('Something went wrong. Please try again or email us directly.', 'error');
    }
  } finally {
    setLoading(false);
  }
}

// Copy email to clipboard
function initCopyEmail() {
  const btn = document.getElementById('btn-copy-email');
  const icon = document.getElementById('copy-icon');
  if (!btn || !icon) return;

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      icon.setAttribute('data-lucide', 'check');
      lucide.createIcons();
      icon.style.color = 'var(--accent)';
      if (typeof Toast !== 'undefined') Toast.show('Email copied to clipboard', 'success');
      setTimeout(() => {
        icon.setAttribute('data-lucide', 'copy');
        lucide.createIcons();
        icon.style.color = '';
      }, 2000);
    } catch {
      if (typeof Toast !== 'undefined') Toast.show('Could not copy email', 'error');
    }
  });
}

// GSAP page entrance
function initAnimations() {
  // Set initial states via CSS instead of GSAP to avoid timing issues
  const header = document.getElementById('contact-header');
  const card = document.getElementById('contact-card');
  const alt = document.getElementById('alt-contact');

  if (!header || !card || !alt) return;

  // Make visible immediately, then animate
  header.style.opacity = '1';
  card.style.opacity = '1';
  alt.style.opacity = '1';

  if (!window.gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.from(header, { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out' });
  gsap.from(card,   { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out', delay: 0.15 });
  gsap.from(alt,    { opacity: 0,        duration: 0.4, ease: 'power2.out', delay: 0.4 });
}

// Init
document.addEventListener('DOMContentLoaded', async () => {
  await loadConfig();
  lucide.createIcons();
  addFocusStyles();
  initCharCount();
  initCopyEmail();
  initAnimations();

  document.getElementById('contact-form')
    .addEventListener('submit', handleSubmit);

  document.getElementById('btn-reset')
    ?.addEventListener('click', resetForm);
});