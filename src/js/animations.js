import { getScrollbarWidth } from "./utils-standard";

/**
 * Hide an element by adding "hidden" class, removing "visible" class and setting aria-hidden to true.
 * @param {HTMLElement} el element to show
 * @returns {void}
 */
export const hideElement = (el) => {
	if (el) {
		el.classList.add("hidden");
		el.classList.remove("visible");
		el.setAttribute("aria-hidden", true);
	}
};

/**
 * Show an element by adding "visible" class, removing "hidden" class and setting aria-hidden to false.
 * @param {HTMLElement} el element to show
 * @returns {void}
 */
export const showElement = (el) => {
	if (el) {
		el.classList.add("visible");
		el.classList.remove("hidden");
		el.setAttribute("aria-hidden", false);
	}
};

export const Fade = {
	/**
	 * Hide element with fade out animation
	 * @param {HTMLElement} el element that is removed
	 * @param {Number} duration of fade out animation (1000 = 1s)
	 * @param {Boolean} enableScroll enable background scroll and remove margin
	 * @param {Boolean} remove remove element after animation from DOM
	 * @returns {void}
	 */
	out: (el, duration = 1000, enableScroll = false, remove = false) => {
		el.classList.add("is-fading-out");

		el.style.opacity = 1;
		el.style.transition = `opacity ${duration}ms`;

		el.style.removeProperty("display");
		let display = window.getComputedStyle(el).display;
		if (display === "none") display = "block";
		el.style.display = window.getComputedStyle(el).display;

		el.style.opacity = 0;
		setTimeout(() => {
			el.style.removeProperty("opacity");
			el.style.removeProperty("transition");
			el.style.removeProperty("display");
			hideElement(el);

			el.classList.remove("is-fading-out");

			// reenable scroll
			if (enableScroll) enableBackgroundScrollModal();

			// remove element from DOM
			if (remove === true) el.parentNode.removeChild(el);
		}, duration);
	},

	/**
	 * Show element with fade in animation
	 * @param {HTMLElement} el element that is removed
	 * @param {Number} duration of fade out animation (1000 = 1s)
	 * @param {Boolean} disableScroll disable background scroll and place margin
	 * @returns {void}
	 */
	in: (el, duration = 1000, disableScroll = false) => {
		el.classList.add("is-fading-in");
		if (disableScroll) disableBackgroundScrollModal();

		el.classList.add("visible");
		el.classList.remove("hidden");
		el.setAttribute("aria-hidden", false);

		el.style.opacity = 0;
		el.style.transition = `opacity ${duration}ms`;

		el.style.removeProperty("display");
		let display = window.getComputedStyle(el).display;
		if (display === "none") display = "block";
		el.style.display = window.getComputedStyle(el).display;

		el.style.opacity = 1;
		setTimeout(() => {
			el.style.removeProperty("opacity");
			el.style.removeProperty("transition");
			el.classList.remove("is-fading-in");
		}, duration);
	},

	/**
	 * Show or hide element with fade in or out animation
	 * @param {HTMLElement} el element that is removed
	 * @param {Number} duration of fade out animation (1000 = 1s)
	 * @returns {void}
	 */
	toggle: function (el, duration = 1000) {
		let display = window.getComputedStyle(el).display;
		if (display === "none") {
			this.in(el, duration);
		} else {
			this.out(el, duration);
		}
	},
};

// ------------------------------------------------------------------------
// helpers
// ------------------------------------------------------------------------

/**
 * Disables scroll on body by adding the "modal-open" class to the body.
 * @returns {void}
 */
const enableBackgroundScrollModal = () => {
	document.body.classList.remove("modal-open");
	document.documentElement.removeAttribute("style");
	document.querySelector("header .header-outer").removeAttribute("style");
	document.querySelector("header .s").removeAttribute("style");
};

/**
 * Enables scroll on body by removing the "modal-open" class from the body.
 * @returns {void}
 */
const disableBackgroundScrollModal = () => {
	document.body.classList.add("modal-open");
	const scrollbarWidth = getScrollbarWidth("px");
	document.documentElement.style.marginRight = scrollbarWidth;
	document.querySelector("header .header-outer").style.paddingRight =
		scrollbarWidth;
	document.querySelector("header .s").style.marginRight = scrollbarWidth;
};
