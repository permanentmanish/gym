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

  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('mobile-menu');
  const body = document.body;

  if (!toggle || !nav) return;

  // Keep in sync with the @media (min-width: 768px) breakpoint in styles.css.
  const desktopQuery = window.matchMedia('(min-width: 768px)');

  const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function isOpen() {
    return toggle.getAttribute('aria-expanded') === 'true';
  }

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    body.classList.add('no-scroll');

    const firstFocusable = nav.querySelector(FOCUSABLE_SELECTOR);
    if (firstFocusable) firstFocusable.focus();

    document.addEventListener('keydown', onKeydown);
    document.addEventListener('click', onOutsideClick);
  }

  function closeMenu(options) {
    const returnFocus = !options || options.returnFocus !== false;

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
    const focusable = Array.from(nav.querySelectorAll(FOCUSABLE_SELECTOR));
focusable.unshift(toggle); // This forces the close button into the trap!
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

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
    <div class="form-success" role="status" tabindex="-1" id="form-success-msg">
      <p class="text-volt">✓ Pass Reserved!</p>
      <small>Check your SMS for your instant access pass.</small>
    </div>
  `;
  // Force the browser to focus on the new message so screen readers announce it
  document.getElementById('form-success-msg').focus();
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
 * Dormant until the matching markup exists — see notes below the code.
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
