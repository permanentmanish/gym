/* =========================================================
   PULSEFIT — SCRIPT.JS
   Phase 4 scope: mobile navigation only. Nothing here talks
   to a server or simulates functionality that doesn't exist
   yet — that arrives in the backend/functionality phase.
   ========================================================= */

function navigation() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("mobile-menu");
  const mainContent = document.querySelector("main");

  // Fail safely if the header markup isn't present for any reason.
  if (!toggle || !menu) return;

  const menuLinks = menu.querySelectorAll("a");

  // Keep this in sync with the desktop breakpoint in styles.css
  // (section 10, "Desktop: full navigation replaces the hamburger").
  const desktopBreakpoint = window.matchMedia("(min-width: 1024px)");

  function isOpen() {
    return toggle.getAttribute("aria-expanded") === "true";
  }

  function openMenu() {
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    menu.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");

    // Keep keyboard/screen-reader focus from reaching content that sits
    // behind the open overlay.
    if (mainContent) mainContent.setAttribute("inert", "");

    const firstLink = menu.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  function closeMenu(options) {
    const returnFocus = options && options.returnFocus;

    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    menu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");

    if (mainContent) mainContent.removeAttribute("inert");

    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener("click", function () {
    if (isOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close on Escape and hand focus back to the toggle button.
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) {
      closeMenu({ returnFocus: true });
    }
  });

  // Close after any navigation link inside the menu is selected.
  menuLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      closeMenu();
    });
  });

  // If the viewport is resized into the desktop layout while the mobile
  // menu happens to be open, close it so it doesn't stay stuck open
  // behind the now-hidden hamburger button.
  desktopBreakpoint.addEventListener("change", function (event) {
    if (event.matches && isOpen()) {
      closeMenu();
    }
  });
}

navigation();
