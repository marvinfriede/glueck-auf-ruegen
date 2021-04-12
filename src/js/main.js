// import javascript
import { calendar } from "./cal.js";
import {
	doBooking,
	goToBooking,
	hideContact,
	imageEnlarge,
	openDropdown,
	openSelector,
	scaleGrids,
	showContact,
	toggleSmallMenu,
	updateListSelection,
} from "./utils-project";
import { foreach, timeout } from "./utils-standard.js";
import { tns } from "../../node_modules/tiny-slider/src/tiny-slider";

// import styles
import "../css/main.css";
import "../../node_modules/tiny-slider/src/tiny-slider.scss";

const sliderDefaultOpts = {
	autoplay: false,
	autoplayButton: false,
	autoplayButtonOutput: false,
	autoplayHoverPause: true,
	autoplayTimeout: 10000,
	controls: true,
	items: 1,
	lazyload: true,
	lazyloadSelector: ".tns-lazy",
	mode: "gallery",
	mouseDrag: false,
	nav: true,
	navAsThumbnails: true,
	navPosition: "bottom",
	rewind: true,
	slideBy: "page",
	speed: 500,
	swipeAngle: 15,
	touch: false,
};

const init = async () => {
	setEventListeners();
	// setAnimations();
	calendar.init({ disablePastDays: true, markToday: true });

	const sliders = {
		duene: tns(
			Object.assign(sliderDefaultOpts, {
				container: "#slider-duene",
				controlsContainer: "#slider-duene-controls",
				navContainer: "#slider-duene-thumbnails",
			})
		),
		moewe: tns(
			Object.assign(sliderDefaultOpts, {
				container: "#slider-moewe",
				controlsContainer: "#slider-moewe-controls",
				navContainer: "#slider-moewe-thumbnails",
			})
		),
		landing: tns(
			Object.assign(sliderDefaultOpts, {
				autoplay: true,
				container: "#slider-landing",
				controls: false,
				mouseDrag: true,
				navContainer: "#slider-landing-nav",
				preventScrollOnTouch: false,
				speed: 1000,
			})
		),
	};

	await timeout(2000);
	handleWindowResize();
};

const setEventListeners = () => {
	// document.querySelector(".btn-link").addEventListener("click", getPage);

	// document.addEventListener("touchstart", (e) => console.log(e));

	foreach(document.querySelectorAll(".main .slider"), (slider) =>
		slider.addEventListener("click", imageEnlarge)
	);

	document.querySelector("#contact").addEventListener("click", doBooking);

	document
		.querySelector("#select-house")
		.addEventListener("click", openDropdown);
	document
		.querySelector("#select-guests")
		.addEventListener("click", openDropdown);
	document
		.querySelector("#select-extras")
		.addEventListener("click", openSelector);

	foreach(document.querySelectorAll(".customize-tools ul.controls li"), (btn) =>
		btn.addEventListener("click", updateListSelection)
	);

	foreach(document.querySelectorAll("[data-target='booking']"), (btn) =>
		btn.addEventListener("click", goToBooking)
	);

	foreach(document.querySelectorAll(".contact-panel--item"), (el) => {
		el.addEventListener("mouseenter", showContact);
		el.addEventListener("mouseleave", hideContact);
	});

	document.querySelector("header.s").addEventListener("click", toggleSmallMenu);

	window.addEventListener("resize", handleWindowResize);
	window.addEventListener("scroll", handleWindowScroll);
};

let prevScrollPos = window.pageYOffset;
const toggleNavOnScroll = () => {
	const currentScrollPos = window.pageYOffset;
	const headerL = document.querySelector("header.l");
	const headerS = document.querySelector("header.s");

	if (prevScrollPos > currentScrollPos) {
		if (window.innerWidth >= 768) {
			headerL.style.top = 0;
		} else {
			headerS.style.right = "20px";
		}
	} else {
		if (window.innerWidth >= 768) {
			headerL.style.top = "-64px";
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
};

// ---------------------------------------------------
// init
// ---------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
	init();
});
