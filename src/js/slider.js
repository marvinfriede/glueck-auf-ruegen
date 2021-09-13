import Splide from "@splidejs/splide";
import "@splidejs/splide/dist/css/splide.min.css";

import { BP, optionsCover, optionsFull, optionsThumb } from "./constants.js";
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
				console.log("Initialized slider for Landing.");
				initSliderLanding();
			} else if (t.id == "id-2") {
				console.log("Initialized slider for Duene.");
				initSlider("duene");
				intersectionObserver.unobserve(t);
			} else if (t.id == "id-3") {
				console.log("Initialized slider for Moewe.");
				initSlider("moewe");
				intersectionObserver.unobserve(t);
			}
		}

		// pause autoplay if out of view
		if (t.id == "id-0" && !isEmpty(Sliders.landing)) {
			if (entry.isIntersecting) {
				document.querySelector(".splide__play").click();
			} else {
				document.querySelector(".splide__pause").click();
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
		initSliderDuene();
		initSliderMoewe();
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
export const setSliderHeight = () => {
	const height =
		window.innerHeight ||
		document.documentElement.clientHeight ||
		document.body.clientHeight;
	let fixedHeight = 0;

	if (height < 300) {
		fixedHeight = 150;
	} else if (height >= 300 && height < 400) {
		fixedHeight = 200;
	} else if (height >= 400 && height < 500) {
		fixedHeight = 250;
	} else if (height >= 500 && height < 600) {
		fixedHeight = 350;
	} else if (height >= 600 && height < 700) {
		fixedHeight = 450;
	} else if (height >= 700 && height < 800) {
		fixedHeight = 550;
	} else if (height >= 800 && height < 900) {
		fixedHeight = 600;
	} else if (height >= 900 && height < 1000) {
		fixedHeight = 700;
	} else if (height >= 1000 && height < 1100) {
		fixedHeight = 800;
	} else if (height >= 1100 && height < 1200) {
		fixedHeight = 900;
	} else if (height >= 1200 && height < 1300) {
		fixedHeight = 1000;
	} else if (height >= 1300 && height < 1400) {
		fixedHeight = 110;
	} else if (height >= 1400 && height < 1600) {
		fixedHeight = 1200;
	} else if (height >= 1600 && height < 1900) {
		fixedHeight = 1400;
	} else {
		fixedHeight = 1600;
	}

	// set height to avoid CLS on load
	foreach(document.querySelectorAll(".slider-container"), (slider) => {
		slider.style.minHeight = fixedHeight + "px";
	});
	// also set height of map
	document.querySelector(".map").style.height = fixedHeight + "px";

	// for fullscreen
	if (document.body.classList.contains("modal-open")) {
		fixedHeight = height - 100;
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
		breakpoints: {
			[BP.n]: { fixedHeight: 640 },
			[BP.l]: { fixedHeight: 764 },
			[BP.xl]: { fixedHeight: 694 },
			[BP.xxl]: { fixedHeight: 764 },
		},
		cover: true,
		drag: false, // in background anyway
		fixedHeight: 764,
		interval: 10000,
		keyboard: false, // in background anyway
		lazyLoad: "nearby",
		pagination: true,
		perPage: 1,
		preloadPages: 0, // performance! loads 2 images if set to 1
		rewind: true,
		speed: 2000,
		type: "fade",
	}).mount();
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
		const thumb = new Splide(`#splide-${name}-thumb`, optionsThumb).mount();
		const splide = new Splide(
			`#splide-${name}`,
			Object.assign({}, optionsCover, { start: start })
		);
		Sliders[name] = splide.sync(thumb).mount();
	} else {
		// create slider only for full
		Sliders[name] = new Splide(
			`#splide-${name}`,
			Object.assign({}, optionsFull, { start: start })
		).mount();
	}

	// change title below image and init height
	Sliders[name].on("active", setTitleSlide);
	setSliderHeight();
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

	// modal before initSlider to change height on init
	const modal = document.querySelector("#modal-splide");
	const destination = modal.querySelector(".slider-wrap");
	const target = this.firstElementChild;
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
	if (e.target.closest(".content") && !e.target.closest(".close-button"))
		return;

	// closing logic
	const target = document.querySelector("#modal-splide .splide");
	const id = e.target.closest(".modal").querySelector(".splide").id;
	let destination, slider;
	if (id == "splide-duene") {
		slider = Sliders.duene;
		destination = document.querySelector("#id-2 .slider-container");
	} else if (id == "splide-moewe") {
		destination = document.querySelector("#id-3 .slider-container");
		slider = Sliders.moewe;
	} else {
		throw new TypeError("Slider ID unknown.");
	}

	moveHtml(target, destination);

	// init again with cover settings
	const index = slider.index;
	slider.destroy();
	initSlider(id, true, index);

	removeImgFullscreenListeners();
};

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
