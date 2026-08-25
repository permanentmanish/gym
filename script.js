/**
 * Peak Performance Gym — Primary Navigation
 * ---------------------------------------------------------------------------
 * Core responsibilities (everything else CSS handles by reacting to the
 * aria-expanded attribute and the .no-scroll class):
 *   1. Toggle the mobile drawer open/closed.
 *   2. Keep aria-expanded on the trigger button in sync.
 *   3. Toggle .no-scroll on <body> to lock background scroll while open.
 *
 * A few extra affordances are included below because an off-canvas drawer
 * is a modal-like UI: Escape to close, click-outside to close, moving focus
 * into/out of the drawer, and a lightweight focus trap while it's open.
 */
(function () {
  'use strict';

  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('mobile-menu');
  var body = document.body;

  if (!toggle || !nav) return;

  // Keep in sync with the @media (min-width: 768px) breakpoint in styles.css.
  var desktopQuery = window.matchMedia('(min-width: 768px)');

  var FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function isOpen() {
    return toggle.getAttribute('aria-expanded') === 'true';
  }

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    body.classList.add('no-scroll');

    var firstFocusable = nav.querySelector(FOCUSABLE_SELECTOR);
    if (firstFocusable) firstFocusable.focus();

    document.addEventListener('keydown', onKeydown);
    document.addEventListener('click', onOutsideClick);
  }

  function closeMenu(options) {
    var returnFocus = !options || options.returnFocus !== false;

    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    body.classList.remove('no-scroll');

    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('click', onOutsideClick);

    if (returnFocus) toggle.focus();
  }

  function onOutsideClick(event) {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu();
    }
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      closeMenu();
      return;
    }

    if (event.key === 'Tab') {
      trapFocus(event);
    }
  }

  // Minimal focus trap: keep Tab / Shift+Tab cycling within the open drawer.
  function trapFocus(event) {
    var focusable = nav.querySelectorAll(FOCUSABLE_SELECTOR);
    if (focusable.length === 0) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  toggle.addEventListener('click', function () {
    if (isOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Selecting a link closes the drawer (desktop nav is static, so this is a
  // no-op there — no need to branch on viewport width).
  nav.addEventListener('click', function (event) {
    if (event.target.closest('a') && isOpen()) {
      closeMenu({ returnFocus: false });
    }
  });

  // If a resize crosses into the desktop layout while the drawer happens to
  // be open, reset state so it doesn't get stuck mid-transition.
  desktopQuery.addEventListener('change', function (event) {
    if (event.matches && isOpen()) {
      closeMenu({ returnFocus: false });
    }
  });
})();

/**
 * Peak Performance Gym — Hero Lead Capture Form
 * ---------------------------------------------------------------------------
 * Handles the phone-number form in the hero (.hero__form): prevents the
 * native submit, runs a light client-side validation pass, and simulates
 * a submission before swapping the form for a success message.
 */
(() => {
  'use strict';

  const form = document.querySelector('.hero__form');
  if (!form) return;

  const input = form.querySelector('.hero__form-input');
  const submitButton = form.querySelector('.hero__form-submit');
  if (!input || !submitButton) return;

  const MIN_DIGITS = 10;
  const SIMULATED_DELAY_MS = 600;

  const isValidPhone = (value) => value.replace(/\D/g, '').length >= MIN_DIGITS;

  const markInvalid = () => {
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
  };

  const clearInvalid = () => {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
  };

  const showSuccess = () => {
    form.innerHTML = `
      <div class="form-success" role="status">
        <p class="text-volt">✓ Pass Reserved!</p>
        <small>Check your SMS for your instant access pass.</small>
      </div>
    `;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!isValidPhone(input.value)) {
      markInvalid();
      return;
    }

    clearInvalid();
    submitButton.disabled = true;
    submitButton.textContent = 'Claiming...';

    window.setTimeout(showSuccess, SIMULATED_DELAY_MS);
  });

  // Clear the error state as soon as the person starts correcting it, rather
  // than leaving a stale .is-invalid border after a failed attempt.
  input.addEventListener('input', clearInvalid);
})();

/**
 * Peak Performance Gym — Facility Vibe Filter
 * ---------------------------------------------------------------------------
 * Filters the bento-grid cards by category. Uses a delegated click listener
 * on the button group rather than one per button.
 */
(() => {
  'use strict';

  const filters = document.querySelector('.facility__filters');
  const cards = document.querySelectorAll('.bento-card');
  if (!filters || cards.length === 0) return;

  filters.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    const activeFilter = button.dataset.filter;

    filters.querySelectorAll('button').forEach((btn) => {
      const isActive = btn === button;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    cards.forEach((card) => {
      const matches = activeFilter === 'all' || card.dataset.category === activeFilter;
      card.classList.toggle('is-hidden', !matches);
    });
  });
})();

/**
 * Peak Performance Gym — Programs Filter
 * ---------------------------------------------------------------------------
 * Filters .program-card elements by category (data-category), triggered by
 * a filter control inside #programs. Mirrors the Facility filter: delegated
 * click listener, .is-hidden toggling, aria-pressed kept in sync.
 *
 * Dormant until the matching markup exists (no .programs__filters container
 * or data-category attributes in index.html yet — see Phase 4.5 notes).
 */
(() => {
  'use strict';

  const container = document.querySelector('#programs .programs__filters');
  const cards = document.querySelectorAll('#programs .program-card');
  if (!container || cards.length === 0) return;

  container.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    const activeFilter = button.dataset.filter;

    container.querySelectorAll('button').forEach((btn) => {
      const isActive = btn === button;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    cards.forEach((card) => {
      const matches = activeFilter === 'all' || card.dataset.category === activeFilter;
      card.classList.toggle('is-hidden', !matches);
    });
  });
})();

/**
 * Peak Performance Gym — Pricing Switcher
 * ---------------------------------------------------------------------------
 * Toggles between monthly and yearly pricing (15% yearly discount). Prices
 * fade out, get updated, then fade back in — never snap instantly.
 */
(() => {
  'use strict';

  const toggle = document.getElementById('pricing-switch');
  const cards = document.querySelectorAll('.pricing-card');
  if (!toggle || cards.length === 0) return;

  const YEARLY_DISCOUNT = 0.15;
  const FADE_MS = 150; // keep in sync with --duration-fast in styles.css

  const monthlyLabel = document.querySelector('.pricing__toggle-label[data-period="monthly"]');
  const yearlyLabel = document.querySelector('.pricing__toggle-label[data-period="yearly"]');

  function priceForCard(card, isYearly) {
    const monthly = Number(card.dataset.priceMonthly);
    if (Number.isNaN(monthly)) return null;
    return isYearly ? Math.round(monthly * (1 - YEARLY_DISCOUNT)) : monthly;
  }

  function updatePrices(isYearly) {
    cards.forEach((card) => {
      const priceEl = card.querySelector('.pricing-card__price');
      const amountEl = card.querySelector('.pricing-card__amount');
      const nextPrice = priceForCard(card, isYearly);
      if (!priceEl || !amountEl || nextPrice === null) return;

      priceEl.classList.add('is-updating');

      window.setTimeout(() => {
        amountEl.textContent = `$${nextPrice}`;
        priceEl.classList.remove('is-updating');
      }, FADE_MS);
    });
  }

  function setActiveLabel(isYearly) {
    if (monthlyLabel) monthlyLabel.classList.toggle('is-active', !isYearly);
    if (yearlyLabel) yearlyLabel.classList.toggle('is-active', isYearly);
  }

  toggle.addEventListener('click', () => {
    const isYearly = toggle.getAttribute('aria-checked') !== 'true';
    toggle.setAttribute('aria-checked', String(isYearly));
    setActiveLabel(isYearly);
    updatePrices(isYearly);
  });
})();

/**
 * Peak Performance Gym — Contact Form Validation
 * ---------------------------------------------------------------------------
 * Real-time validation: each field is checked as the person interacts with
 * it (not just on submit), toggling .is-valid / .is-invalid and populating
 * that field's paired error message. novalidate is set on the <form> in
 * HTML since this replaces native validation entirely rather than layering
 * on top of it.
 */
(() => {
  'use strict';

  const form = document.getElementById('contact-form');
  if (!form) return;

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // One validator per field id — returns '' when valid, an error string
  // when not. Add a new field by adding an entry here.
  const validators = {
    'contact-name': (value) => (value.trim().length > 0 ? '' : 'Please enter your name.'),
    'contact-email': (value) => {
      if (value.trim().length === 0) return 'Please enter your email.';
      return EMAIL_PATTERN.test(value.trim()) ? '' : 'Enter a valid email address.';
    },
    'contact-message': (value) => (value.trim().length > 0 ? '' : 'Please enter a message.'),
  };

  const fields = Object.keys(validators)
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function validateField(field) {
    const validate = validators[field.id];
    if (!validate) return true;

    const errorMessage = validate(field.value);
    const errorEl = document.getElementById(`${field.id}-error`);
    const hasValue = field.value.trim().length > 0;

    field.classList.toggle('is-invalid', Boolean(errorMessage));
    field.classList.toggle('is-valid', !errorMessage && hasValue);
    field.setAttribute('aria-invalid', String(Boolean(errorMessage)));

    if (errorEl) errorEl.textContent = errorMessage;

    return !errorMessage;
  }

  fields.forEach((field) => {
    // Wait for the first blur before validating on every keystroke — showing
    // a red border before someone's even had a chance to type is more
    // alarming than helpful.
    let hasInteracted = false;

    field.addEventListener('blur', () => {
      hasInteracted = true;
      validateField(field);
    });

    field.addEventListener('input', () => {
      if (hasInteracted) validateField(field);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) {
      const firstInvalid = fields.find((field) => field.classList.contains('is-invalid'));
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Real submission (fetch/AJAX to your backend) goes here — out of scope
    // for this step, which is focused on the validation UX itself.
  });
})();
