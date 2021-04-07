import { foreach } from "./utils-standard.js";
import { Fade, hideElement, showElement } from "./animations.js";

export const toggleSmallMenu = () => {
	if (document.querySelector("header.s").classList.contains("open")) {
		closeSideNav();
	} else {
		openSideNav();
	}
};
const openSideNav = () => {
	document.querySelector("header.s").classList.add("open");
	document.querySelector("aside").classList.add("open");
	document.addEventListener("click", closeSideNavOnClick);
};
const closeSideNav = () => {
	document.querySelector("header.s").classList.remove("open");
	document.querySelector("aside").classList.remove("open");
	document.removeEventListener("click", closeSideNavOnClick);
};
const closeSideNavOnClick = (e) => {
	if (
		e.target.closest("main") ||
		e.target.closest("footer") ||
		e.target.closest("a.nav-link")
	) {
		closeSideNav();
	}
};

export const openDropdown = (e) => {
	const drop = e.target.closest(".drop-root").querySelector(".dropdown");
	const caret = e.target.closest(".drop-root").querySelector(".caret img");
	if (window.getComputedStyle(drop).display === "none") {
		if (caret) {
			caret.classList.remove("rotate90deg");
			caret.classList.add("rotate270deg");
		}
		Fade.in(drop, 500);
		document.addEventListener("mousedown", closeDropdown);
		document.addEventListener("touchstart", closeDropdown);
		document.addEventListener("keyup", closeDropdown);
	}
};
const closeDropdown = (e) => {
	const drop = document.querySelector(".dropdown.visible");
	const root = drop.closest(".drop-root");
	if (!drop || !root) return;

	// cover ESC press
	if (e.type === "keyup" && e.key !== "Escape") return;

	// close dropdown
	const caret = root.querySelector(".caret img");
	if (caret) {
		caret.classList.remove("rotate270deg");
		caret.classList.add("rotate90deg");
	}
	Fade.out(drop, 500);
	document.removeEventListener("mousedown", closeDropdown);
	document.removeEventListener("touchstart", closeDropdown);
	document.removeEventListener("keyup", closeDropdown);

	// do extra stuff for certain targets (dropdown options)
	if (e.target.classList.contains("dropdown-option")) {
		// display selection
		const name = e.target.getAttribute("data-value");
		root.querySelector(".selection").innerText = name;

		// change available options
		if (root.id === "select-house") {
			updateDropdownGuests(name);
		}
	}
};

const updateDropdownGuests = (name) => {
	const opts = document.querySelectorAll("#select-guests .dropdown-option");
	if (name === "Düne") {
		// show all options and display max number of guests
		foreach(opts, (opt) => showElement(opt));
		document.querySelector("#select-guests .selection").innerText = "6";
	} else if (name === "Möwe") {
		// hide all options with more than 2 people and display max number
		foreach(opts, (opt) => {
			if (opt.getAttribute("data-value") > 2) {
				hideElement(opt);
			}
		});
		document.querySelector("#select-guests .selection").innerText = "2";
	} else {
		// if something goes wrong...
		console.warn("Identifier in dropdown options not found.");
	}
};

export const openSelector = (e) => {
	const select = e.target.closest(".selector-root").querySelector(".selector");
	const caret = e.target.closest(".selector-root").querySelector(".caret img");

	if (window.getComputedStyle(select).display === "none") {
		if (caret) {
			caret.classList.remove("rotate90deg");
			caret.classList.add("rotate270deg");
		}
		Fade.in(select, 500);

		if (e.touches) {
			document.addEventListener("touchstart", closeSelector);
		} else {
			document.addEventListener("keyup", closeSelector);
			document.addEventListener("mousedown", closeSelector);
		}
	}
};
const closeSelector = (e) => {
	e.preventDefault();

	const select = document.querySelector(".selector.visible");
	const root = select.closest(".selector-root");
	if (!select || !root) return;

	// cover click of selector option
	if (e.target.closest(".selector-option")) {
		const opt = e.target.closest(".selector-option");
		if (opt.classList.contains("active")) {
			opt.classList.remove("active");
		} else {
			opt.classList.add("active");
		}
		const act = root.querySelectorAll(".active .selector-option--text");
		const text = root.querySelector(".selection");
		if (act.length === 0) {
			text.classList.add("faded");
			text.innerText = "keine Extras";
		} else {
			text.classList.remove("faded");
			text.innerText = Array.from(act)
				.map((e) => e.innerText)
				.join(", ");
		}
		return;
	}

	// cover ESC press
	if (e.type === "keyup" && e.key !== "Escape") return;

	// close selector
	const caret = root.querySelector(".caret img");
	if (caret) {
		caret.classList.remove("rotate270deg");
		caret.classList.add("rotate90deg");
	}
	Fade.out(select, 500);
	document.removeEventListener("mousedown", closeSelector);
	document.removeEventListener("touchstart", closeSelector);
	document.removeEventListener("keyup", closeSelector);
};

export const goToBooking = (e) => {
	document.querySelector("#buchen").scrollIntoView();
	if (!e.target.dataset.value) return;

	const house = document.querySelector("#select-house .selection");
	if (e.target.dataset.value === "duene") {
		house.innerText = "Düne";
		updateDropdownGuests("Düne");
	} else if (e.target.dataset.value === "moewe") {
		house.innerText = "Möwe";
		updateDropdownGuests("Möwe");
	} else {
		console.warn("Identifier not found.");
	}
};

export const updateListSelection = (e) => {
	const ul = e.target
		.closest(".customize-tools")
		.querySelector("ul.thumbnails");
	let active;

	if (e.target.closest("li").classList.contains("next")) {
		active =
			ul.querySelector(".tns-nav-active").nextElementSibling ||
			ul.firstElementChild;
	} else {
		active =
			ul.querySelector(".tns-nav-active").previousElementSibling ||
			ul.lastElementChild;
	}
	active.scrollIntoView({
		behavior: "smooth",
		block: "nearest",
		inline: "start",
	});
};

export const scaleGrids = () => {
	const grids = document.querySelectorAll(".info-grid");
	foreach(grids, (grid) => {
		const items = Array.from(grid.querySelectorAll(".grid-item"));

		// calculate how many items are in one row
		let factor = 1;
		for (let i = 0; i < items.length; i++) {
			if (
				Math.abs(
					items[i].getBoundingClientRect().y -
						items[i + 1].getBoundingClientRect().y
				) < 5
			) {
				factor += 1;
			} else {
				break;
			}
		}

		// get last elements of row
		let arr = [];
		for (let i = 1; i < items.length + 1; i++) {
			if (i % factor == 0) {
				arr.push(items[i - 1]);
			}
		}

		// get longest of last elements
		let longest = arr[0];
		for (let i = 0; i < arr.length; i++) {
			if (longest.offsetWidth < arr[i].offsetWidth) {
				longest = arr[i];
			}
		}

		// calculate padding to make grid centered
		const padding =
			(grid.offsetWidth / factor - longest.offsetWidth) * 0.5 + "px";
		foreach(items, (item) => (item.style.marginLeft = padding));
	});
};

// ------------------------------------------------------------------------
// modals
// ------------------------------------------------------------------------

/**
 * Attach listeners for closing modal functions. "Click event" would be triggered immediately and thereby closing the modal after opening "click event".
 * @returns {void}
 */
const addModalListeners = () => {
	document.addEventListener("mousedown", closeModal);
	document.addEventListener("touchstart", closeModal);
	document.addEventListener("keyup", closeModal);
};

/**
 * Remove listeners for closing modal functions.
 * @returns {void}
 */
const removeModalListeners = () => {
	document.removeEventListener("mousedown", closeModal);
	document.removeEventListener("touchstart", closeModal);
	document.removeEventListener("keyup", closeModal);
};

export const openModal = (modal, id) => {
	if (!modal) return;
	modal.setAttribute("data-for", id);

	Fade.in(modal, 500);
	addModalListeners();
};

/**
 * Closes visible modal, if users click outside. Calls reset function for upload modal.
 * @param {MouseEvent} e event object
 * @returns {void}
 */
const closeModal = (e) => {
	e.preventDefault();
	e.stopImmediatePropagation();

	// cover ESC press
	if (e.type === "keyup" && e.key !== "Escape") return;

	// do nothing, if modal is not even visible
	const modal = document.querySelector(".modal.visible");
	if (!modal) return;

	Fade.out(modal, 500);
	removeModalListeners();

	if (modal.dataset.for == "img-large") imgNormalize();
};

export const imageEnlarge = (e) => {
	if (e.type !== "dblclick" && e.type !== "touchstart") return;

	// emulating a double tap with time between two touchstarts
	let clickTimer = null;
	if (e.type === "touchstart") {
		if (clickTimer == null) {
			clickTimer = setTimeout(() => (clickTimer = null), 500);
			return;
		}
		clearTimeout(clickTimer);
		clickTimer = null;
	}
	console.log(e.type);
	const slider = e.target.closest(".slider");
	slider.classList.add("max");
	slider.classList.remove("default");
	openModal(document.querySelector(".modal"), "img-large");
};
const imgNormalize = () => {
	const slider = document.querySelector(".slider.max");
	slider.classList.remove("max");
	slider.classList.add("default");
};
