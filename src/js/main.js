// import styles

// first import (hidden required)
import "../css/content.scss";

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

// last import
import "../css/html.scss";

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
import Pricelist from "./pricelist";

/**
 * Adds keyboard support and accessible states to the existing custom controls.
 * @returns {void}
 */
const initAccessibleControls = () => {
  const makeButton = (el, label) => {
    el.setAttribute("role", "button");
    el.tabIndex = 0;
    if (label) el.setAttribute("aria-label", label);
  };
  const labels = {
    "select-house": "Unterkunft",
    "select-guests": "Personen",
    "select-extras": "Extras",
    "select-month": "Monat",
    "select-year": "Jahr",
  };

  foreach(document.querySelectorAll(".drop-root, .selector-root"), (root) => {
    if (root.id === "select-date") return;

    const trigger = root.querySelector(".select") || root.querySelector(".selection");
    const popup = root.querySelector(".dropdown, .selector");
    if (!trigger || !popup) return;

    popup.id = `${root.id}-options`;
    makeButton(trigger);

    const caption = document.createElement("span");
    caption.id = `${root.id}-label`;
    caption.className = "visually-hidden";
    caption.textContent = labels[root.id];
    root.prepend(caption);

    root.querySelector(".selection").id = `${root.id}-value`;
    trigger.setAttribute("aria-labelledby", `${caption.id} ${root.id}-value`);
    trigger.setAttribute("aria-controls", popup.id);
    trigger.setAttribute("aria-expanded", "false");
  });

  const buttons = [
    ".dropdown-option",
    ".accordion",
    ".cal-footer--button",
    "#contact",
    ".map .note",
    ".slider-fullscreen",
    ".close-button",
  ];
  foreach(document.querySelectorAll(buttons.join(", ")), (el) => {
    let label;
    if (el.matches(".close-button")) {
      label = "Schließen";
    } else if (el.matches(".slider-fullscreen")) {
      label = "Bilder in Großansicht öffnen";
    } else if (el.id === "contact") {
      label = "Buchungsanfrage stellen";
    }
    makeButton(el, label);
    if (el.matches(".accordion")) el.setAttribute("aria-expanded", "false");
  });

  foreach(document.querySelectorAll(".selector-option"), (el) => {
    el.setAttribute("role", "checkbox");
    el.setAttribute("aria-checked", el.dataset.selected);
    el.removeAttribute("aria-selected");
    el.tabIndex = 0;
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const target = event.target;
    if (target.matches('[role="button"], [role="checkbox"], .date-picker')) {
      event.preventDefault();
      target.click();
    }
  });
};

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

const initPrices = async () => {
  try {
    const p = new Pricelist();
    await p.loadData();

    const moewe = p;
    const duene = p;

    // print stuff in price cards
    duene.hookPriceCard("duene");
    duene.run();
    moewe.hookPriceCard("moewe");
    moewe.run();
  } catch (err) {
    console.error(err);
  }
};

// ---------------------------------------------------
// init
// ---------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  setEventListeners();
  initAccessibleControls();
  initIntersectionObserver();
  initPrices();
  Calendar.init();
});
window.addEventListener("load", () => {
  handleWindowResize();
});
