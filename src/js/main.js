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
import { debounce, foreach, throttle } from "./utils-standard.js";
import { openBookingModal, closeModalManually, openModal } from "./overlays.js";
import { toggleAccordion } from "./accordion.js";
import InjectWarning from "./inject-warning.js";
import Splide from "@splidejs/splide";
import { BP } from "./constants.js";

// import styles
import "../css/main.css";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import { Fade } from "./animations.js";

let sliders = { landing: null, duene: null, moewe: null, modal: null };
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

	window.addEventListener("resize", debounce(handleWindowResize, 500));
	window.addEventListener("scroll", throttle(handleWindowScroll, 100));
};

const removeLoadingMask = () => {
	Fade.out(document.querySelector(".mask"), 1500, true);
};

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
	if (document.body.classList.contains("modal-open")) return;

	const height =
		window.innerHeight ||
		document.documentElement.clientHeight ||
		document.body.clientHeight;

	if (sliders.duene && sliders.moewe) {
		if (height < 300) {
			sliders.duene.options = { fixedHeight: 150 };
			sliders.moewe.options = { fixedHeight: 150 };
		} else if (height >= 300 && height < 400) {
			sliders.duene.options = { fixedHeight: 200 };
			sliders.moewe.options = { fixedHeight: 200 };
		} else if (height >= 400 && height < 500) {
			sliders.duene.options = { fixedHeight: 250 };
			sliders.moewe.options = { fixedHeight: 250 };
		} else if (height >= 500 && height < 600) {
			sliders.duene.options = { fixedHeight: 350 };
			sliders.moewe.options = { fixedHeight: 350 };
		} else if (height >= 600 && height < 700) {
			sliders.duene.options = { fixedHeight: 450 };
			sliders.moewe.options = { fixedHeight: 450 };
		} else if (height >= 700 && height < 800) {
			sliders.duene.options = { fixedHeight: 550 };
			sliders.moewe.options = { fixedHeight: 550 };
		} else if (height >= 800 && height < 900) {
			sliders.duene.options = { fixedHeight: 600 };
			sliders.moewe.options = { fixedHeight: 600 };
		} else if (height >= 900 && height < 1000) {
			sliders.duene.options = { fixedHeight: 700 };
			sliders.moewe.options = { fixedHeight: 700 };
		} else if (height >= 1000 && height < 1100) {
			sliders.duene.options = { fixedHeight: 800 };
			sliders.moewe.options = { fixedHeight: 800 };
		} else if (height >= 1100 && height < 1200) {
			sliders.duene.options = { fixedHeight: 900 };
			sliders.moewe.options = { fixedHeight: 900 };
		} else if (height >= 1200 && height < 1300) {
			sliders.duene.options = { fixedHeight: 1000 };
			sliders.moewe.options = { fixedHeight: 1000 };
		} else if (height >= 1300 && height < 1400) {
			sliders.duene.options = { fixedHeight: 1100 };
			sliders.moewe.options = { fixedHeight: 1100 };
		} else if (height >= 1400 && height < 1600) {
			sliders.duene.options = { fixedHeight: 1200 };
			sliders.moewe.options = { fixedHeight: 1200 };
		} else if (height >= 1600 && height < 1900) {
			sliders.duene.options = { fixedHeight: 1400 };
			sliders.moewe.options = { fixedHeight: 1400 };
		} else {
			sliders.duene.options = { fixedHeight: 1600 };
			sliders.moewe.options = { fixedHeight: 1600 };
		}
		sliders.duene.refresh();
		sliders.moewe.refresh();
	}
};

const setTitleSlide = (e) => {
	const img = e.slide.firstElementChild;
	const cont = img.closest(".slider").querySelector(".splide-title span");
	cont.innerText = img.title;
};

const initSliders = () => {
	const dueneRoot = document.querySelector("#splide-duene");
	const moeweRoot = document.querySelector("#splide-moewe");
	const dueneRootThumb = document.querySelector("#splide-duene-thumb");
	const moeweRootThumb = document.querySelector("#splide-moewe-thumb");

	const optionsCover = {
		cover: true,
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
		breakpoints: {
			700: {
				fixedHeight: 50,
				fixedWidth: 70,
			},
		},
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
		breakpoints: {
			[BP.n]: { fixedHeight: 640 },
			[BP.l]: { fixedHeight: 764 },
			[BP.xl]: { fixedHeight: 694 },
			[BP.xxl]: { fixedHeight: 884 },
		},
		autoplay: true,
		cover: true,
		fixedHeight: 1104,
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
	sliders.duene.on("active", setTitleSlide);
	sliders.moewe.on("active", setTitleSlide);

	// dueneRoot
	// 	.querySelector("#splide-duene-track")
	// 	.addEventListener("dblclick", (e) => {
	// 		if (document.body.classList.contains("modal-open")) return;

	// 		e.preventDefault();
	// 		e.stopImmediatePropagation();

	// 		// get index and destroy
	// 		const index = sliders.duene.index;
	// 		sliders.duene.destroy(false);

	// 		// move to modal
	// 		const modal = document.querySelector("#modal-splide");
	// 		const wrap = modal.querySelector(".slider-wrap");
	// 		wrap.insertBefore(dueneRoot, wrap.firstChild);
	// 		openModal(modal);

	// 		// create new with settings for fullscreen
	// 		sliders.duene = new Splide(
	// 			dueneRoot,
	// 			Object.assign(optionsFull, { start: index })
	// 		).mount();

	// 		// set title and add listener
	// 		setTitleSlider(sliders.duene);
	// 		sliders.duene.on("moved", () => {
	// 			setTitleSlider(sliders.duene);
	// 		});

	// 		// for identification on close
	// 		sliders.modal = "duene";
	// 	});
};

// const closeModalSplide = () => {
// 	let sl;
// 	switch (sliders.modal) {
// 		case "duene":
// 			sl = sliders.duene;
// 			break;
// 		case "moewe":
// 			sl = sliders.moewe;
// 			break;
// 		default:
// 			return;
// 	}
// 	sliders.modal = null;

// 	sl.destroy();
// };

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
	warning.setParent(document.querySelector("main section.intro"));
	warning.setMessage(
		"Buchungskalender nicht aktuell. Seite wird noch minimal überarbeitet. Buchung/Nachfragen trotzdem möglich."
	);
	warning.addClass("warning");
	warning.inject();
});
