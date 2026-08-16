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
