// import javascript
import { Calendar } from "./cal.js";
import {
	goToBooking,
	hideContact,
	openDropdown,
	openGoogleMap,
	openSelector,
	scaleGrids,
	showContact,
	toggleSmallMenu,
	updateListSelection,
} from "./utils-project";
import { debounce, foreach, isEmpty, throttle } from "./utils-standard.js";
import { openBookingModal, closeModalManually, openModal } from "./overlays.js";
import { toggleAccordion } from "./accordion.js";
import { Fade } from "./animations.js";
import InjectWarning from "./inject-warning.js";
import Splide from "@splidejs/splide";
import { BP, optionsCover, optionsThumb } from "./constants.js";

// import styles
import "../css/main.css";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";

let sliders = { landing: {}, duene: {}, moewe: {} };
let prevScrollPos = window.pageYOffset;

// ---------------------------------------------------
// intersection observer
// ---------------------------------------------------

/**
 * Callback of IntersectionObserver. Initializes sliders and toggles autoplayof landing slider.
 * @param {object} entries from IntersectionObserver
 * @returns {void}
 */
const onIntersection = (entries) => {
	entries.forEach((entry) => {
		const t = entry.target;
		if (entry.isIntersecting) {
			if (t.id == "id-0" && isEmpty(sliders.landing)) {
				console.log("Initialized slider for Landing.");
				initSliderLanding();
			} else if (t.id == "id-2") {
				console.log("Initialized slider for Duene.");
				initSliderDuene();
				intersectionObserver.unobserve(t);
			} else if (t.id == "id-3") {
				console.log("Initialized slider for Moewe.");
				initSliderMoewe();
				intersectionObserver.unobserve(t);
			}
		}

		// pause autoplay if out of view
		if (t.id == "id-0" && !isEmpty(sliders.landing)) {
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
 * Initializes IntersectionObserver if supported. Otherwise sliders are just initialized.
 * @returns {void}
 */
const initIntersectionObserver = () => {
	if (typeof IntersectionObserver == "undefined") {
		initSliderDuene();
		initSliderMoewe();
		initSliderLanding();
	} else {
		intersectionObserver = new IntersectionObserver(onIntersection, {
			root: null,
			threshold: 0.05,
		});
		intersectionObserver.observe(document.querySelector("#id-0"));
		intersectionObserver.observe(document.querySelector("#id-2"));
		intersectionObserver.observe(document.querySelector("#id-3"));
	}
};

// ---------------------------------------------------
// variois
// ---------------------------------------------------

/**
 * Fades out loading mask on ".mask".
 * @returns {void}
 * @see Fade
 */
const removeLoadingMask = () => {
	Fade.out(document.querySelector(".mask"), 1500, true);
};

/**
 * Toggles visibility of header (small and large) depending on scroll.
 * @returns {void}
 */
const toggleNavOnScroll = () => {
	const currentScrollPos = window.pageYOffset;
	const headerL = document.querySelector("header.l");
	const headerS = document.querySelector("header.s");

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
			headerS.style.right = "-60px";
		}
	}
	prevScrollPos = currentScrollPos;
};

// ---------------------------------------------------
// event listeners and handlers
// ---------------------------------------------------

/**
 * Initializes all eventListeners except scroll and resize.
 * @returns {void}
 */
const setEventListeners = () => {
	// // enlarge images in sliders
	// foreach(document.querySelectorAll(".main .slider"), (slider) =>
	// 	slider.addEventListener("click", openImgFullscreen)
	// );

	// accordion
	document.querySelectorAll(".accordion").forEach((el) => {
		el.addEventListener("click", toggleAccordion);
	});

	// dropdowns in booking modal
	document
		.querySelector("#select-house")
		.addEventListener("click", openDropdown);
	document
		.querySelector("#select-guests")
		.addEventListener("click", openDropdown);
	document
		.querySelector("#select-extras")
		.addEventListener("click", openSelector);

	// autoscroll in horizontal image thumbnails
	foreach(
		document.querySelectorAll(".customize-tools ul.controls li"),
		(btn) => {
			btn.addEventListener("click", updateListSelection);
		}
	);
	foreach(
		document.querySelectorAll(".customize-tools ul.thumbnails"),
		(btn) => {
			btn.addEventListener("click", (e) => updateListSelection(e, false));
		}
	);

	// jump to booking through buttons in price cards
	foreach(document.querySelectorAll("[data-target='booking']"), (btn) =>
		btn.addEventListener("click", goToBooking)
	);

	// open booking modal
	document
		.querySelector("#contact")
		.addEventListener("click", openBookingModal);

	// closing button in all modals (currently only one in use)
	foreach(document.querySelectorAll(".modal .close-button"), (el) => {
		el.addEventListener("click", closeModalManually);
	});

	// animation for contact bar in booking modal
	foreach(document.querySelectorAll(".contact-panel--item"), (el) => {
		el.addEventListener("mouseenter", showContact);
		el.addEventListener("mouseleave", hideContact);
	});

	// show google maps
	document.querySelector(".map .note").addEventListener("click", openGoogleMap);

	// toggle side nav with button on small screens
	document.querySelector("header.s").addEventListener("click", toggleSmallMenu);

	window.addEventListener("resize", debounce(handleWindowResize, 500));
	window.addEventListener("scroll", throttle(handleWindowScroll, 100));
};

/**
 * Contains all functions related to scroll behaviour. This functions is throttled.
 * @returns {void}
 * @see throttle
 */
const handleWindowScroll = () => {
	toggleNavOnScroll();
};

/**
 * Contains all functions related to window resizing. This functions is debounced.
 * @returns {void}
 * @see debounce
 */
const handleWindowResize = () => {
	scaleGrids();
	setSliderHeight();
};

// ---------------------------------------------------
// sliders
// ---------------------------------------------------

/**
 * Changes height of slider depending on height of viewport.
 * @returns {void}
 */
const setSliderHeight = () => {
	if (document.body.classList.contains("modal-open")) return;

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
	document.querySelector("#splide-duene").style.minHeight = fixedHeight + "px";
	document.querySelector("#splide-moewe").style.minHeight = fixedHeight + "px";

	// also set height of map
	document.querySelector(".map").style.height = fixedHeight + "px";

	// change height
	if (!isEmpty(sliders.duene)) {
		sliders.duene.options = { fixedHeight: fixedHeight };
		sliders.duene.refresh();
	}

	if (!isEmpty(sliders.moewe)) {
		sliders.moewe.options = { fixedHeight: fixedHeight };
		sliders.moewe.refresh();
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
 * Initializes slider for landing and binds it to global "sliders" object.
 * @returns {void}
 */
const initSliderLanding = () => {
	sliders.landing = new Splide("#splide-landing", {
		arrows: false,
		autoplay: true,
		breakpoints: {
			[BP.n]: { fixedHeight: 640 },
			[BP.l]: { fixedHeight: 764 },
			[BP.xl]: { fixedHeight: 694 },
			[BP.xxl]: { fixedHeight: 764 },
		},
		cover: true,
		fixedHeight: 764,
		interval: 10000,
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
 * Initializes slider for duene and binds it to global "sliders" object.
 * @returns {void}
 */
const initSliderDuene = () => {
	// create slider and thumbnail for cover
	const dueneThumb = new Splide("#splide-duene-thumb", optionsThumb).mount();
	const duene = new Splide("#splide-duene", optionsCover);
	sliders.duene = duene.sync(dueneThumb).mount();

	// change title below image
	sliders.duene.on("active", setTitleSlide);

	setSliderHeight();
};

/**
 * Initializes slider for moewe and binds it to global "sliders" object.
 * @returns {void}
 */
const initSliderMoewe = () => {
	// create slider and thumbnail for cover
	const moeweThumb = new Splide("#splide-moewe-thumb", optionsThumb).mount();
	const moewe = new Splide("#splide-moewe", optionsCover);
	sliders.moewe = moewe.sync(moeweThumb).mount();

	// change title below image
	sliders.moewe.on("active", setTitleSlide);

	setSliderHeight();
};

// ---------------------------------------------------
// init
// ---------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
	setEventListeners();
	initIntersectionObserver();
	Calendar.init({ disablePastDays: true, markToday: true });
	removeLoadingMask();
});
window.addEventListener("load", () => {
	handleWindowResize();
});

// temporary
window.addEventListener("load", () => {
	// inject "under construction" warning
	const warning = new InjectWarning();
	warning.setParent(document.querySelector("main section.intro"));
	warning.setMessage(
		"Buchungskalender nicht aktuell. Seite wird noch minimal überarbeitet. Buchung/Nachfragen trotzdem möglich."
	);
	warning.addClass("warning");
	warning.inject();
});
