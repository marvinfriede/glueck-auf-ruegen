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
	 * @param {Boolean} remove remove element after animation from DOM
	 * @returns {void}
	 */
	out: (el, duration = 1000, remove = false) => {
		el.style.opacity = 1;
		el.style.transition = `opacity ${duration}ms`;

		el.style.removeProperty("display");
		let display = window.getComputedStyle(el).display;
		if (display === "none") display = "block";
		el.style.display = window.getComputedStyle(el).display;

		el.style.opacity = 0;
		window.setTimeout(() => {
			el.style.removeProperty("opacity");
			el.style.removeProperty("transition");
			el.style.removeProperty("display");
			hideElement(el);
			if (remove === true) el.parentNode.removeChild(el);
		}, duration);
	},

	/**
	 * Show element with fade in animation
	 * @param {HTMLElement} el element that is removed
	 * @param {Number} duration of fade out animation (1000 = 1s)
	 * @returns {void}
	 */
	in: (el, duration = 1000) => {
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
		window.setTimeout(() => {
			el.style.removeProperty("opacity");
			el.style.removeProperty("transition");
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