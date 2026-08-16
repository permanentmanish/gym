document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------
  // Element references
  // ---------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('#primary-nav');

  // Bail out safely if the shell isn't present on this page
  if (!header || !navToggle || !siteNav) return;

  const navLinks = siteNav.querySelectorAll('a');

  // ---------------------------------------------------------------------
  // Drawer open/close state engine
  // ---------------------------------------------------------------------

  /**
   * Opens the mobile nav drawer and syncs a11y + scroll-lock state.
   */
  const openMenu = () => {
    navToggle.classList.add('is-active');
    siteNav.classList.add('is-open');
    // Tell assistive tech the disclosure widget is now expanded
    navToggle.setAttribute('aria-expanded', 'true');
    // Prevent the page underneath the drawer from scrolling
    document.body.classList.add('no-scroll');
  };

  /**
   * Closes the mobile nav drawer and syncs a11y + scroll-lock state.
   * @param {boolean} restoreFocus - Whether to return focus to the toggle button
   */
  const closeMenu = (restoreFocus = false) => {
    navToggle.classList.remove('is-active');
    siteNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');

    // On Escape, send focus back to the control that owns this widget
    if (restoreFocus) {
      navToggle.focus();
    }
  };

  const isMenuOpen = () => siteNav.classList.contains('is-open');

  // ---------------------------------------------------------------------
  // Toggle button click
  // ---------------------------------------------------------------------
  navToggle.addEventListener('click', () => {
    isMenuOpen() ? closeMenu() : openMenu();
  });

  // ---------------------------------------------------------------------
  // Keyboard safeguard: Escape closes the drawer and restores focus
  // ---------------------------------------------------------------------
  document.addEventListener('keyup', (event) => {
    if (event.key === 'Escape' && isMenuOpen()) {
      closeMenu(true);
    }
  });

  // ---------------------------------------------------------------------
  // Close drawer on nav link click (single-page anchor navigation)
  // ---------------------------------------------------------------------
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (isMenuOpen()) {
        closeMenu();
      }
    });
  });

  // ---------------------------------------------------------------------
  // Dynamic header background on scroll
  // ---------------------------------------------------------------------
  const handleScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Set correct state on load (e.g. page refreshed mid-scroll)
  handleScroll();
});