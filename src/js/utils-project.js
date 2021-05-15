import { dateDiff, dt, foreach, sanitizeHTML } from "./utils-standard.js";
import { Fade, hideElement, showElement } from "./animations.js";
import { calendar } from "./cal.js";
import { PRICES } from "./data.js";

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
	e.preventDefault();

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
		root.dataset.value = name;

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
		document.querySelector("#select-guests").dataset.value = 6;
	} else if (name === "Möwe") {
		// hide all options with more than 2 people and display max number
		foreach(opts, (opt) => {
			if (opt.getAttribute("data-value") > 2) hideElement(opt);
		});
		document.querySelector("#select-guests .selection").innerText = "2";
		document.querySelector("#select-guests").dataset.value = 2;
	} else {
		// if something goes wrong...
		console.warn("Identifier in dropdown options not found.");
	}
};

export const openSelector = (e) => {
	e.preventDefault();

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

	// cover ESC press
	if (e.type === "keyup" && e.key !== "Escape") return;

	// cover click of selector option
	if (e.target.closest(".selector-option")) {
		const opt = e.target.closest(".selector-option");
		if (opt.classList.contains("active")) {
			opt.classList.remove("active");
			opt.setAttribute("data-selected", false);
			opt.setAttribute("aria-selected", false);
		} else {
			opt.classList.add("active");
			opt.setAttribute("data-selected", true);
			opt.setAttribute("aria-selected", true);
		}

		const act = root.querySelectorAll(".active .selector-option--text");
		const text = root.querySelector(".selection");
		if (act.length === 0) {
			text.classList.add("faded");
			text.innerText = "keine Extras";
			root.dataset.value = "";
		} else {
			text.classList.remove("faded");
			const sels = Array.from(act)
				.map((e) => e.innerText)
				.join(", ");
			text.innerText = sels;
			root.dataset.value = sels;
		}
		return;
	}

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

export const openGoogleMap = () => {
	const note = document.querySelector(".map .note");
	note.remove();

	const iframe = document.querySelector(".map iframe");
	iframe.src =
		"https://www.google.com/maps/embed/v1/place?key=AIzaSyAPDv1gSmdxeAka2fbuY7oMVUXMnxkTHow&q=place/Buchenweg+4,+18586+Sellin,+Deutschland&zoom=14";
	Fade.in(iframe);
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
	const wrap = e.target.closest(".slider-wrap");
	const ul = wrap.querySelector("ul.thumbnails");
	let active;

	if (e.target.closest("li").classList.contains("next")) {
		active =
			ul.querySelector(".tns-nav-active").nextElementSibling || ul.firstElementChild;
	} else {
		active =
			ul.querySelector(".tns-nav-active").previousElementSibling || ul.lastElementChild;
	}
	active.scrollIntoView({
		behavior: "smooth",
		block: "nearest",
		inline: "start",
	});

	// get title from picture (by data-id) and place in in container below image
	const img = wrap.querySelector(`[data-id="${active.dataset.nav}"] img`);
	const cont = wrap.querySelector(".image-title span");
	cont.innerText = img.title;
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
					items[i].getBoundingClientRect().y - items[i + 1].getBoundingClientRect().y
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
		const padding = (grid.offsetWidth / factor - longest.offsetWidth) * 0.5 + "px";
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

export const openModal = (modal) => {
	if (modal) {
		Fade.in(modal, 500);
		addModalListeners();
	}
};

/**
 * Closes visible modal, if users click outside. Calls reset function for upload modal.
 * @param {MouseEvent} e event object
 * @returns {void}
 */
const closeModal = (e) => {
	e.stopImmediatePropagation();
	if (e.touches) e.preventDefault();

	// cover ESC press
	if (e.type === "keyup" && e.key !== "Escape") return;

	// targets
	if (e.target.closest(".content")) return;

	closeModalManually();
};
export const closeModalManually = (e) => {
	// do nothing, if modal is not even visible
	const modal = document.querySelector(".modal.visible");
	if (!modal) return;

	if (modal.dataset.for == "img-large") {
		Fade.out(modal, 500, true);
		imgNormalize();
	} else {
		Fade.out(modal, 500);
	}

	modal.removeAttribute("title");
	modal.removeAttribute("data-for");
	removeModalListeners();
};

export const imageEnlarge = (e) => {
	e.preventDefault();
	e.stopImmediatePropagation();
	if (e.type !== "click") return;

	const slider = e.target.closest(".slider");
	slider.classList.add("max");
	slider.classList.remove("default");
	slider.title = "Klicken zum Schließen.";

	const modal = document.createElement("div");
	modal.classList.add("hidden", "modal");
	modal.id = "img-bg";
	modal.title = "Klicken zum Schließen.";
	modal.setAttribute("data-for", "img-large");

	const button = document.createElement("div");
	button.classList.add("close-button", "fixed");
	button.id = "temp";
	const div = document.createElement("div");
	div.classList.add("icon", "symbol", "l");
	const img = document.createElement("img");
	img.src = "img/window-close.svg";
	img.alt = "X";
	div.append(img);
	button.appendChild(div);
	document.body.append(button);
	document.body.appendChild(modal);
	openModal(modal);
};
const imgNormalize = () => {
	const slider = document.querySelector(".slider.max");
	slider.classList.remove("max");
	slider.classList.add("default");
	slider.removeAttribute("title");

	Fade.out(document.querySelector("#temp"), 500, true);
};

export const doBooking = (e) => {
	try {
		const modal = document.querySelector(".modal");
		modal.title = "Klicken zum Schließen.";
		openModal(modal, "booking");

		const data = {
			house: {
				from: document.querySelector("#select-house .selection"),
				to: document.querySelector("#data-house .selector"),
				value: document.querySelector("#select-house .selection").innerText,
			},
			guests: {
				from: document.querySelector("#select-guests .selection"),
				to: document.querySelector("#data-guests .selector"),
				value: document.querySelector("#select-guests .selection").innerText,
			},
			extras: {
				from: document.querySelector("#select-extras .selection"),
				dog: document.querySelector("#select-extras [data-name=dog]").dataset.selected,
				sheets: document.querySelector("#select-extras [data-name=sheets]").dataset
					.selected,
				to: document.querySelector("#data-extras .selector"),
			},
			date: {
				arvl: {
					to: document.querySelector("#data-dates .selector"),
					value: calendar.arvl.date,
				},
				dprt: {
					to: document.querySelector("#data-dates .selector"),
					value: calendar.dprt.date,
				},
				stays: {
					value: dateDiff(calendar.arvl.date, calendar.dprt.date),
				},
			},
		};

		bookingFillHouse(data);
		bookingFillGuests(data);
		bookingFillExtras(data);
		bookingFillDate(data);
		bookingPrices(data);
	} catch (err) {
		console.error(err);
		alert("Ein interner Fehler ist aufgetreten. Seite wird neu geladen.");
		location.reload();
	}
};
const bookingFillHouse = (data) => {
	data.guests.to.innerText = data.guests.value;
};
const bookingFillGuests = (data) => {
	data.house.to.innerText = data.house.value;
};
const bookingFillExtras = (data) => {
	if (data.extras.dog || data.extras.sheets) {
		data.extras.to.innerText = data.extras.from.innerText;
	} else {
		data.extras.to.innerText = "Keine.";
	}
};
const bookingFillDate = (data) => {
	const mail = document.querySelector("#mail");
	if (data.date.arvl.value && data.date.dprt.value) {
		const arvlLocale = dt(data.date.arvl.value).toLocaleDateString();
		const dprtLocale = dt(data.date.dprt.value).toLocaleDateString();

		// create subject and body of mail
		const subject = `Buchung ${sanitizeHTML(data.house.value)} vom ${sanitizeHTML(
			arvlLocale
		)} bis ${sanitizeHTML(dprtLocale)}`;
		const body = `Sehr geehrte Familie Wolf,
		
		...

		Buchungszusammenfassung
		 - Unterkunft: ${sanitizeHTML(data.house.value)}
		 - Personen: ${sanitizeHTML(data.guests.value)}
		 - Anreise: ${sanitizeHTML(arvlLocale)}
		 - Abreise: ${sanitizeHTML(dprtLocale)}
		 - Extras: ${sanitizeHTML(data.extras.from.innerText)}
		 

		Mit freundlichen Grüßen
		`;

		// replace href
		mail.href =
			"mailto:Glueck-auf-ruegen@web.de?subject=" +
			encodeURIComponent(subject) +
			"&body=" +
			encodeURIComponent(body);

		data.date.arvl.to.innerText = `${arvlLocale} - ${dprtLocale}`;
	} else {
		mail.href = "mailto:Glueck-auf-ruegen@web.de";
		data.date.arvl.to.innerText = "Nichts ausgewählt.";
	}
};
const bookingPrices = (data) => {
	const title = document.querySelector(".modal .pricing .title");
	const stays = document.querySelector(".pricing [data-id='stays']");
	const cleaning = document.querySelector(".pricing [data-id='cleaning']");
	const extra1 = document.querySelector(".pricing [data-id='extra-1']");
	const extra2 = document.querySelector(".pricing [data-id='extra-2']");
	const sum = document.querySelector(".pricing [data-id='sum']");

	if (!data.date.arvl.value || !data.date.dprt.value) {
		// error message if no date is set
		title.innerText =
			"Preise konnten nicht ermittelt werden, da An- und Abreise nicht festgelegt wurden.";

		// hide all elements for pricing
		hideElement(stays);
		hideElement(cleaning);
		hideElement(extra1);
		hideElement(extra2);
		hideElement(sum);

		// do nothing further
		return;
	}

	// shortcuts
	const house = data.house.value;
	const numStays = data.date.stays.value;

	let price = PRICES[house].cleaning; // final cleaning

	// regular title
	title.innerText = "";

	// add all days to price
	let date = dt(data.date.arvl.value).toDate();
	let priceOfDay,
		priceNights = 0;
	let i;
	for (i = 0; i < numStays; i++) {
		priceOfDay = getPriceOfDate(date, house);
		priceNights += priceOfDay;

		// set date to next day
		date.setDate(date.getDate() + 1);
	}
	price += priceNights;

	// fill in text
	if (numStays == "1") {
		stays.firstElementChild.innerText = `${numStays} Nacht`;
	} else {
		stays.firstElementChild.innerText = `${numStays} Nächte`;
	}
	stays.lastElementChild.innerText = `${priceNights} €`;

	// if (low === 0) {
	// 	stays.lastElementChild.innerText = `${main} x ${
	// 		PRICES[data.house.value].main
	// 	} €`;
	// } else if (main === 0) {
	// 	stays.lastElementChild.innerText = `${low} x ${
	// 		PRICES[data.house.value].low
	// 	} €`;
	// } else {
	// 	stays.lastElementChild.innerText = `${main} x	${
	// 		PRICES[data.house.value].main
	// 	} € + ${low} x	${PRICES[data.house.value].low} €`;
	// }

	showElement(stays);

	// extras
	if (data.extras.dog == "true") {
		extra1.lastElementChild.innerText = `${numStays} x ${PRICES.dog.night} € + ${PRICES.dog.cleaning} €`;
		showElement(extra1);

		// add cost
		price += numStays * PRICES.dog.night;
		price += PRICES.dog.cleaning;
	} else {
		hideElement(extra1);
	}
	if (data.extras.sheets == "true") {
		extra2.lastElementChild.innerText = `${data.guests.value} x ${PRICES.sheets} €`;
		showElement(extra2);

		// add cost
		price += data.guests.value * PRICES.sheets;
	} else {
		hideElement(extra2);
	}

	// cleaning
	cleaning.lastElementChild.innerText = `${PRICES[house].cleaning} €`;
	showElement(cleaning);

	// total price
	sum.lastElementChild.innerText = price + " €";
	showElement(sum);
};

export const showContact = (e) => {
	const text = e.target.querySelector(".text");
	text.style.display = "block";
	const width = window.getComputedStyle(text).getPropertyValue("width");
	text.style.width = 0;
	text.style.transition = "all 500ms ease-in-out";

	setTimeout(() => {
		text.style.opacity = 1;
		text.style.width = width;
		text.style.marginLeft = 10 + "px";
	}, 1);
};

export const hideContact = (e) => {
	const text = e.target.querySelector(".text");

	text.style.width = 0;
	text.style.removeProperty("opacity");
	text.style.removeProperty("margin-left");

	setTimeout(() => {
		text.style.removeProperty("display");
		text.style.removeProperty("width");
		text.style.removeProperty("transition");
	}, 500);
};

export const toggleAccordion = (e) => {
	const el = e.target.closest(".accordion");
	const panel = el.nextElementSibling;
	if (el.classList.contains("active")) {
		el.classList.remove("active");
		panel.style.maxHeight = null;
	} else {
		el.classList.add("active");
		panel.style.maxHeight = panel.scrollHeight + "px";
	}
};

const getPriceOfDate = (date, houseID) => {
	if (!PRICES) throw new ConstMissingException("Price list not defined");

	const arr = PRICES[houseID][dt(date).getUTCFullYear()];
	date = dt(date).toInt();

	let begin, end, i;
	const len = arr.length;
	for (i = 0; i < len; i++) {
		begin = dt(arr[i].begin).toInt();
		end = dt(arr[i].end).toInt();
		if (date >= begin && date <= end) return arr[i].price;
	}

	throw new DateError("Date not found in price list.", date);
};

export function ConstMissingException(message) {
	this.message = message;
	this.name = "ConstMissingException";
}
export function DateError(message, date) {
	this.message = message;
	this.date = date;
	this.dateStr = new Date(date);
	this.name = "DateError";
}
