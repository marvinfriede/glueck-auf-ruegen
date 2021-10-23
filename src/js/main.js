// import styles
//import "../css/reset.css";
import "../css/accordion.scss";
import "../css/animations.scss";
//import "../css/content.scss";
//import "../css/header.scss";
//import "../css/font.scss";
//import "../css/icons.scss";
import "../css/landing.scss";
import "../css/landing-cal.scss";
//import "../css/loading-mask.scss";
import "../css/modal.scss";
import "../css/section-details.scss";
//import "../css/section-footer.scss";
import "../css/section-grid.scss";
//import "../css/section-map.scss";
import "../css/section-pricing.scss";
import "../css/section-slider.scss";
import "../css/section-welcome.scss";
import "../css/tooltip.scss";

// import javascript
import { toggleAccordion } from "./accordion.js";
import { Calendar } from "./cal.js";
import { initIntersectionObserver, openImgFullscreen, setHeights } from "./slider.js";
import { openBookingModal } from "./overlays.js";
import { debounce, foreach } from "./utils-standard.js";
import {
  goToBooking,
  hideContact,
  openDropdown,
  openGoogleMap,
  openSelector,
  scaleGrids,
  showContact,
} from "./utils-project";

// ---------------------------------------------------
// event listeners and handlers
// ---------------------------------------------------

/**
 * Initializes all eventListeners except scroll and resize.
 * @returns {void}
 */
const setEventListeners = () => {
  // accordion
  foreach(document.querySelectorAll(".accordion"), (el) => {
    el.addEventListener("click", toggleAccordion);
  });

  // dropdowns in booking modal
  document.querySelector("#select-house").addEventListener("click", openDropdown);
  document.querySelector("#select-guests").addEventListener("click", openDropdown);
  document.querySelector("#select-extras").addEventListener("click", openSelector);

  // jump to booking through buttons in price cards
  foreach(document.querySelectorAll("[data-target='booking']"), (btn) =>
    btn.addEventListener("click", goToBooking)
  );

  // open booking modal
  document.querySelector("#contact").addEventListener("click", openBookingModal);

  // animation for contact bar in booking modal
  foreach(document.querySelectorAll(".contact-panel--item"), (el) => {
    el.addEventListener("mouseenter", showContact);
    el.addEventListener("mouseleave", hideContact);
  });

  // show google maps
  document.querySelector(".map .note").addEventListener("click", openGoogleMap);

  // enlarge images in Sliders
  foreach(document.querySelectorAll(".slider-container"), (el) => {
    el.addEventListener("dblclick", openImgFullscreen);
  });

  foreach(document.querySelectorAll(".slider-fullscreen"), (el) => {
    el.addEventListener("click", openImgFullscreen);
  });

  window.addEventListener("resize", debounce(handleWindowResize, 500));
};

/**
 * Contains all functions related to window resizing. This functions is debounced.
 * @returns {void}
 * @see debounce
 */
const handleWindowResize = () => {
  scaleGrids();
  setHeights();
};

// ---------------------------------------------------
// init
// ---------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  setEventListeners();
  initIntersectionObserver();
  Calendar.init();
});
window.addEventListener("load", () => {
  handleWindowResize();
});
