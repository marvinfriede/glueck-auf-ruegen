import { BP } from "./constants.js";
import { throttle } from "./utils-standard.js";

import "../css/reset.css";
import "../css/content.scss";
import "../css/font.scss";
import "../css/header.scss";
import "../css/icons.scss";
import "../css/section-map.scss";
import "../css/imprint.scss";
import "../css/footer.scss";

// ---------------------------------------------------
// navigation
// ---------------------------------------------------

let prevScrollPos = window.pageYOffset;

/**
 * Toggles visibility of header (small and large) depending on scroll. This functions is throttled.
 * @returns {void}
 * @see throttle
 */
const toggleNavOnScroll = () => {
  const currentScrollPos = window.pageYOffset;
  const headerL = document.querySelector("header .l");
  const headerS = document.querySelector("header .s");

  // avoid closing if side nav is open
  if (headerS.classList.contains("open")) return;

  // avoid equal case -> do nothing on init
  if (prevScrollPos > currentScrollPos) {
    if (window.innerWidth >= BP.n) {
      headerL.style.top = 0;
    } else {
      headerS.style.right = "20px";
    }
  } else if (prevScrollPos < currentScrollPos) {
    if (window.innerWidth >= BP.n) {
      headerL.style.top = "calc(-1 * var(--header-height))";
    } else {
      headerS.style.right = "15px";
    }
  }
  prevScrollPos = currentScrollPos;
};

// ---------------------------------------------------
// side navigation
// ---------------------------------------------------

export const toggleSmallMenu = () => {
  const clHeader = document.querySelector("header .s").classList;
  const clAside = document.querySelector("aside .nav-collapsed").classList;
  const menu = document.querySelector("aside .nav-collapsed");
  const button = document.querySelector("header .s");
  if (clHeader.contains("open")) {
    clHeader.remove("open");
    clAside.remove("open");
    menu.inert = true;
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Menü öffnen");
    button.focus({ preventScroll: true });
    removeSideNavListeners();
  } else {
    clHeader.add("open");
    clAside.add("open");
    menu.inert = false;
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-label", "Menü schließen");
    menu.querySelector("a")?.focus({ preventScroll: true });
    addSideNavListeners();
  }
};

const closeSideNav = (e) => {
  if (e.touches) e.preventDefault();
  const t = e.target;

  // autoplay of landing slider triggered by click
  if (t.closest(".splide__autoplay.hidden")) return;

  // Handle Escape once, even when focus is on a navigation link.
  if (e.type === "keyup") {
    if (e.key === "Escape") toggleSmallMenu();
    return;
  }

  // close if clicked next to nav or on link in nav
  if (t.closest("main") || t.closest("footer") || t.closest("a.nav-link"))
    toggleSmallMenu();
};

/**
 * Attach listeners for closing sidenav. Without timeout, "click event" would be triggered immediately and thereby closing after opening "click event".
 * @returns {void}
 */
const addSideNavListeners = () => {
  document.addEventListener("click", closeSideNav);
  document.addEventListener("keyup", closeSideNav);
};

/**
 * Remove listeners for closing sidenav.
 * @returns {void}
 */
const removeSideNavListeners = () => {
  document.removeEventListener("click", closeSideNav);
  document.removeEventListener("keyup", closeSideNav);
};

// ---------------------------------------------------
// set listeners
// ---------------------------------------------------

export const setEventListenersNavs = () => {
  // toggle side nav with button on small screens
  document
    .querySelector("header .s")
    .addEventListener("click", toggleSmallMenu);

  window.addEventListener("scroll", throttle(toggleNavOnScroll, 100));
  window.addEventListener("resize", () => {
    const menuIsOpen = document.querySelector("header .s").classList.contains("open");
    if (window.innerWidth >= BP.n && menuIsOpen) toggleSmallMenu();
  });
};

// ---------------------------------------------------
// init
// ---------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  setEventListenersNavs();
});
