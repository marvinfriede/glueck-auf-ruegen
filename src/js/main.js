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
import { foreach } from "./utils-standard.js";
import { openBookingModal, closeModalManually, openModal } from "./overlays.js";
import { toggleAccordion } from "./accordion.js";
import InjectWarning from "./inject-warning.js";
import Splide from "@splidejs/splide";
import { BP } from "./constants.js";

// import styles
import "../css/main.css";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import { Fade } from "./animations.js";

let sliders = { landing: null, duene: null, moewe: null };
let prevScrollPos = window.pageYOffset;

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

	window.addEventListener("resize", handleWindowResize);
	window.addEventListener("scroll", handleWindowScroll);
};

const removeLoadingMask = () => {
	Fade.out(document.querySelector(".mask"), 1500, true);
};

const toggleNavOnScroll = () => {
	const currentScrollPos = window.pageYOffset;
	const headerL = document.querySelector("header.l");
	const headerS = document.querySelector("header.s");
	const landing = document.querySelector(".header-placeholder");

	// avoid equal case -> do nothing on init
	if (prevScrollPos > currentScrollPos) {
		if (window.innerWidth >= 768) {
			headerL.style.top = 0;
			landing.style.marginTop = "var(--header-height)";
		} else {
			headerS.style.right = "20px";
		}
	} else if (prevScrollPos < currentScrollPos) {
		if (window.innerWidth >= 768) {
			headerL.style.top = "calc(-1 * var(--header-height))";
			landing.style.marginTop = 0;
		} else {
			headerS.style.right = "-60px";
		}
	}
	prevScrollPos = currentScrollPos;
};

const handleWindowScroll = () => {
	toggleNavOnScroll();
};

const handleWindowResize = () => {
	scaleGrids();
	setSliderHeight();
};

// ---------------------------------------------------
// init
// ---------------------------------------------------

const setSliderHeight = () => {
	const width =
		window.innerWidth ||
		document.documentElement.clientWidth ||
		document.body.clientWidth;

	if (sliders.landing) {
		if (width < BP.n) {
			sliders.landing.options = { fixedHeight: 640 };
		} else if (width >= BP.n && width < BP.l) {
			sliders.landing.options = { fixedHeight: 710 };
		} else if (width >= BP.l && width < BP.xl) {
			sliders.landing.options = { fixedHeight: 600 };
		} else if (width >= BP.xl && width < BP.xxl) {
			sliders.landing.options = { fixedHeight: 820 };
		} else {
			sliders.landing.options = { fixedHeight: 1040 };
		}
	}

	sliders.landing.refresh();
};

const setTitleSlider = (slider) => {
	const el = slider.root.closest(".slider");

	// get title from picture (by data-id) and place in in container below image
	const img = el.querySelector("li.is-active img");
	const cont = el.querySelector(".splide-title span");
	cont.innerText = img.title;
};

const initSliders = () => {
	const dueneRoot = document.querySelector("#splide-duene");
	const moeweRoot = document.querySelector("#splide-moewe");
	const dueneRootThumb = document.querySelector("#splide-duene-thumb");
	const moeweRootThumb = document.querySelector("#splide-moewe-thumb");

	const optionsCover = {
		cover: true,
		height: "500px",
		lazyLoad: "nearby",
		pagination: false,
		perPage: 1,
		preloadPages: 0,
		rewind: true,
		type: "fade",
	};
	const optionsFull = {
		lazyLoad: "nearby",
		pagination: false,
		perPage: 1,
		preloadPages: 0,
		rewind: true,
		type: "fade",
	};
	const optionsThumb = {
		cover: true,
		classes: {
			arrow: "splide__arrow transparent",
			next: "splide__arrow--next outside",
			prev: "splide__arrow--prev outside",
		},
		focus: "center",
		fixedHeight: 64,
		fixedWidth: 100,
		gap: 10,
		isNavigation: true,
		pagination: false,
		rewind: true,
		width: "calc(100% - 5em)",
	};

	sliders.landing = new Splide("#splide-landing", {
		arrows: false,
		autoplay: true,
		cover: true,
		fixedHeight: 640,
		interval: 10000,
		lazyLoad: "nearby",
		pagination: true,
		perPage: 1,
		preloadPages: 1,
		rewind: true,
		speed: 2000,
		type: "fade",
	}).mount();

	// create slider and thumbnail for cover
	const dueneThumb = new Splide(dueneRootThumb, optionsThumb).mount();
	sliders.duene = new Splide(dueneRoot, optionsCover);
	sliders.duene.sync(dueneThumb).mount();

	const moeweThumb = new Splide(moeweRootThumb, optionsThumb).mount();
	sliders.moewe = new Splide(moeweRoot, optionsCover);
	sliders.moewe.sync(moeweThumb).mount();

	// change title below image
	sliders.duene.on("move", () => {
		setTitleSlider(sliders.duene);
	});
	sliders.moewe.on("move", () => {
		setTitleSlider(sliders.moewe);
	});

	// testing
	// document
	// 	.querySelector(".welcome-wrap .text")
	// 	.addEventListener("click", () => {
	// 		const index = sliders.duene.index;

	// 		const modal = document.querySelector("#modal-splide");
	// 		openModal(modal);

	// 		let dueneSlider2 = new Splide(
	// 			document.querySelector("#splide-duene-2"),
	// 			Object.assign(optionsFull, { start: index })
	// 		).mount();
	// 	});
};

const init = async () => {
	setEventListeners();
	initSliders();
	Calendar.init({ disablePastDays: true, markToday: true });
};

document.addEventListener("DOMContentLoaded", () => {
	init();
	removeLoadingMask();
});
window.addEventListener("load", () => {
	handleWindowResize();
});

// temporary
window.addEventListener("load", () => {
	// inject "under construction" warning
	const warning = new InjectWarning();
	warning.setParent(document.querySelector("main section.landing"));
	warning.setMessage(
		"Buchungskalender nicht aktuell. Seite wird noch minimal überarbeitet. Buchung/Nachfragen trotzdem möglich."
	);
	warning.addClass("warning");
	warning.inject();
});
