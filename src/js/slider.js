import Splide from "@splidejs/splide";
import "@splidejs/splide/dist/css/splide.min.css";

import { optionsCover, optionsFull, optionsThumb, sliderLabels } from "./constants.js";
import { openModal } from "./overlays.js";
import { foreach, isEmpty, moveHtml } from "./utils-standard.js";

const Sliders = { landing: {}, duene: {}, moewe: {} };

// ---------------------------------------------------
// intersection observer
// ---------------------------------------------------

/**
 * Callback of IntersectionObserver. Initializes Sliders and toggles autoplayof landing slider.
 * @param {object} entries from IntersectionObserver
 * @returns {void}
 */
const onIntersection = (entries) => {
  entries.forEach((entry) => {
    const t = entry.target;
    if (entry.isIntersecting) {
      if (t.id == "id-0" && isEmpty(Sliders.landing)) {
        initSliderLanding();
      } else if (t.id == "id-2") {
        initSlider("duene");
        intersectionObserver.unobserve(t);
      } else if (t.id == "id-3") {
        initSlider("moewe");
        intersectionObserver.unobserve(t);
      }
    }
  });
};

let intersectionObserver = null;

/**
 * Initializes IntersectionObserver if supported. Otherwise Sliders are just initialized.
 * @returns {void}
 */
export const initIntersectionObserver = () => {
  if ("IntersectionObserver" in window) {
    intersectionObserver = new IntersectionObserver(onIntersection, {
      root: null,
      threshold: 0.05,
    });
    intersectionObserver.observe(document.querySelector("#id-0"));
    intersectionObserver.observe(document.querySelector("#id-2"));
    intersectionObserver.observe(document.querySelector("#id-3"));
  } else {
    initSlider("duene");
    initSlider("moewe");
    initSliderLanding();
  }
};

// ---------------------------------------------------
// Sliders
// ---------------------------------------------------

/**
 * Changes height of slider depending on height of viewport.
 * @returns {void}
 */
export const setHeights = () => {
  const height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  // Match the dimensions CSS reserved before the browser follows an anchor.
  let fixedHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--gallery-height"),
    10,
  ) || 550;

  // set height to avoid CLS on load
  foreach(document.querySelectorAll(".main .slider-container"), (slider) => {
    slider.style.minHeight = fixedHeight + "px";
  });

  // also set height of map
  document.querySelector(".map").style.height = fixedHeight + "px";

  // for fullscreen
  const modal = document.querySelector("#modal-splide");
  if (
    (modal.classList.contains("is-open") && !modal.classList.contains("is-fading-out")) ||
    modal.classList.contains("is-fading-in")
  ) {
    fixedHeight = height - 100;
    modal.querySelector(".slider-container").style.minHeight = fixedHeight + "px";
  }

  // change height
  if (!isEmpty(Sliders.duene)) {
    Sliders.duene.options = { fixedHeight: fixedHeight };
    Sliders.duene.refresh();
  }
  if (!isEmpty(Sliders.moewe)) {
    Sliders.moewe.options = { fixedHeight: fixedHeight };
    Sliders.moewe.refresh();
  }
};

/**
 * Changes title of current slide in ".splide-title span".
 * @param {Event} e active event from Splide
 * @returns {void}
 */
const setTitleSlide = (e) => {
  const img = e.slide.firstElementChild;
  const cont = img.closest(".slider").querySelector(".splide-title span");
  cont.innerText = img.title;
};

/**
 * Initializes slider for landing and binds it to global "Sliders" object.
 * @returns {void}
 */
export const initSliderLanding = () => {
  Sliders.landing = new Splide("#splide-landing", {
    arrows: false,
    autoplay: true,
    i18n: sliderLabels,
    cover: false,
    drag: false, // in background anyway
    height: "100%",
    interval: 10000,
    keyboard: false, // in background anyway
    lazyLoad: "nearby",
    pagination: true,
    perPage: 1,
    preloadPages: 1, // Load neighboring images before slide transitions.
    rewind: true,
    speed: 2000,
    type: "fade",
  });
  Sliders.landing.mount();
};

/**
 * Initializes slider for duene and moewe and binds it to global "Sliders" object.
 * @param {("duene"|"moewe")} name of slider
 * @param {Boolean} [cover=true] initialize Splide with {cover: true|false}
 * @param {Number} [start=0] initialize with this slide number
 * @returns {void}
 */
export const initSlider = (name, cover = true, start = 0) => {
  // only allow duene and moewe and replace possible prefix from id
  if (!name.includes("duene") && !name.includes("moewe")) return;
  name = name.replace("splide-", "");

  if (cover) {
    // create slider and thumbnail for cover
    const thumb = new Splide(
      `#splide-${name}-thumb`,
      Object.assign({}, optionsThumb, { start: start }),
    ).mount();
    const splide = new Splide(
      `#splide-${name}`,
      Object.assign({}, optionsCover, { start: start }),
    );
    Sliders[name] = splide.sync(thumb).mount();
  } else {
    // create slider only for full
    Sliders[name] = new Splide(
      `#splide-${name}`,
      Object.assign({}, optionsFull, { start: start }),
    ).mount();
  }

  // change title below image and init height
  Sliders[name].on("active", setTitleSlide);
  setHeights();
};

// ------------------------------------------------------------------------
// image fullscreen
// ------------------------------------------------------------------------

/**
 * Open modal with slider for image in fullscreen. No arrow function as "this" is used.
 * @returns {void}
 */
export function openImgFullscreen(e) {
  e.preventDefault();
  e.stopImmediatePropagation();

  // avoid triggering when arrows are clicked very fast
  if (e.target.closest(".splide__arrows")) return;

  // get html elements
  const modal = document.querySelector("#modal-splide");
  const destination = modal.querySelector(".slider-container");
  const target = e.target.closest(".slider").querySelector(".splide");

  // modal before initSlider to change height on init
  moveHtml(target, destination);
  openModal(modal);
  addImgFullscreenListeners();

  // get correct slider
  let slider;
  if (target.id == "splide-duene") {
    slider = Sliders.duene;
  } else if (target.id == "splide-moewe") {
    slider = Sliders.moewe;
  } else {
    throw new TypeError("Slider ID unknown.");
  }

  // reinit slider
  if (!isEmpty(slider)) {
    const index = slider.index;
    slider.destroy();
    initSlider(target.id, false, index);
  }
}

/**
 * Closes fullscreen view and resets to initial state.
 * @returns {void}
 */
export const closeImgFullscreen = (e) => {
  // standard for touch events
  if (e.touches) e.preventDefault();

  // cover ESC press
  if (e.type === "keyup" && e.key !== "Escape") return;

  // targets
  if (
    e.type !== "keyup" &&
    e.target.closest(".content") &&
    !e.target.closest(".close-button")
  )
    return;

  // closing logic
  const target = document.querySelector("#modal-splide .splide");
  if (!target) return;

  let destination, slider;
  if (target.id == "splide-duene") {
    slider = Sliders.duene;
    destination = document.querySelector("#id-2 .slider-container");
  } else if (target.id == "splide-moewe") {
    destination = document.querySelector("#id-3 .slider-container");
    slider = Sliders.moewe;
  } else {
    throw new TypeError("Slider ID unknown.");
  }

  moveHtml(target, destination);

  // init again with cover settings
  const index = slider.index;
  slider.destroy();
  initSlider(target.id, true, index);

  window.scrollTo({
    top: slider.root.closest(".slider").getBoundingClientRect().top + window.scrollY - 64,
  });

  removeImgFullscreenListeners();
};

function getCoords(el) {
  const elem = document.querySelector(el);
  // crossbrowser version
  var box = elem.getBoundingClientRect();

  var body = document.body;
  var docEl = document.documentElement;

  var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  var clientTop = docEl.clientTop || body.clientTop || 0;
  var clientLeft = docEl.clientLeft || body.clientLeft || 0;

  var top = box.top + scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;

  return Math.round(top);

  // return { top: Math.round(top), left: Math.round(left) };
}

/**
 * Attach listeners for closing image fullscreen view.
 * @returns {void}
 */
const addImgFullscreenListeners = () => {
  setTimeout(() => {
    document.addEventListener("click", closeImgFullscreen);
    document.addEventListener("keyup", closeImgFullscreen);
  }, 10);
};

/**
 * Remove listeners for closing fullscreen view of images.
 * @returns {void}
 */
const removeImgFullscreenListeners = () => {
  document.removeEventListener("click", closeImgFullscreen);
  document.removeEventListener("keyup", closeImgFullscreen);
};
