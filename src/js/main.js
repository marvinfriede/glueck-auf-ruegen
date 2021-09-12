// import javascript
import { toggleAccordion } from "./accordion.js";
import { Fade } from "./animations.js";
import { Calendar } from "./cal.js";
import { BP } from "./constants.js";
import {
	closeImgFullscreen,
	initIntersectionObserver,
	openImgFullscreen,
	setSliderHeight,
} from "./slider.js";
import { openBookingModal, closeModalManually } from "./overlays.js";
import { debounce, foreach, throttle } from "./utils-standard.js";
import {
	goToBooking,
	hideContact,
	openDropdown,
	openGoogleMap,
	openSelector,
	scaleGrids,
	showContact,
	toggleSmallMenu,
} from "./utils-project";
import InjectWarning from "./inject-warning.js";

// import styles
import "../css/main.css";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";

let prevScrollPos = window.pageYOffset;

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
	const headerL = document.querySelector("header .l");
	const headerS = document.querySelector("header .s");

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

	// jump to booking through buttons in price cards
	foreach(document.querySelectorAll("[data-target='booking']"), (btn) =>
		btn.addEventListener("click", goToBooking)
	);

	// open booking modal
	document
		.querySelector("#contact")
		.addEventListener("click", openBookingModal);

	// closing button in all modals
	foreach(document.querySelectorAll(".modal .close-button"), (el) => {
		el.addEventListener("click", closeModalManually);
	});

	// closing button in sldier modals
	// document
	// 	.querySelector("#modal-splide .close-button")
	// 	.addEventListener("click", closeImgFullscreen);

	// animation for contact bar in booking modal
	foreach(document.querySelectorAll(".contact-panel--item"), (el) => {
		el.addEventListener("mouseenter", showContact);
		el.addEventListener("mouseleave", hideContact);
	});

	// show google maps
	document.querySelector(".map .note").addEventListener("click", openGoogleMap);

	// toggle side nav with button on small screens
	document
		.querySelector("header .s")
		.addEventListener("click", toggleSmallMenu);

	window.addEventListener("resize", debounce(handleWindowResize, 500));
	window.addEventListener("scroll", throttle(handleWindowScroll, 100));

	// enlarge images in Sliders
	foreach(document.querySelectorAll(".slider-container"), (el) => {
		el.addEventListener("dblclick", openImgFullscreen);
	});
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
