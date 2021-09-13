import { Fade, showElement, hideElement } from "./animations.js";
import { Calendar } from "./cal.js";
import { ConstMissingException, DateError } from "./custom-errors.js";
import { PRICES } from "./data.js";
import { dateDiff, dt, sanitizeHTML } from "./utils-standard.js";

// ------------------------------------------------------------------------
// modal
// ------------------------------------------------------------------------

/**
 * Attach listeners for closing modal functions. "Click event" would be triggered immediately and thereby closing the modal after opening "click event".
 * @returns {void}
 */
const addModalListeners = () => {
	setTimeout(() => {
		document.addEventListener("click", closeModal);
		document.addEventListener("keyup", closeModal);
	}, 10);
};

/**
 * Remove listeners for closing modal functions.
 * @returns {void}
 */
const removeModalListeners = () => {
	document.removeEventListener("click", closeModal);
	document.removeEventListener("keyup", closeModal);
};

/**
 * Opens specified modal, disables background scroll and sets listeners for closing events.
 * @param {HTMLElement} modal modal which should be opened
 * @returns {void}
 */
export const openModal = (modal) => {
	if (modal) {
		Fade.in(modal, 500);
		disableBackgroundScrollModal();
		addModalListeners();
	}
};

/**
 * Closes modal, if users click outside. Handles clicks and presses and dispatches to actual closing function.
 * @param {MouseEvent} e event object
 * @returns {void}
 */
const closeModal = (e) => {
	// standard for touch events
	if (e.touches) e.preventDefault();

	// cover ESC press
	if (e.type === "keyup" && e.key !== "Escape") return;

	// targets
	if (e.target.closest(".content") && !e.target.closest(".close-button"))
		return;

	// actual closing function
	closeModalManually();
};

/**
 * Closes modal, reenables background scroll and removes listeners if users click outside. (Actual closing function.)
 * @param {MouseEvent} e event object
 * @returns {void}
 */
export const closeModalManually = () => {
	// do nothing, if modal is not even visible
	const modal = document.querySelector(".modal.visible");
	if (modal) {
		Fade.out(modal, 500);
		enableBackgroundScrollModal();
		removeModalListeners();
	}
};

// ------------------------------------------------------------------------
// booking summary
// ------------------------------------------------------------------------

export const openBookingModal = () => {
	try {
		const modal = document.querySelector(".modal");
		modal.title = "Klicken zum Schließen.";
		openModal(modal);

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
				dog: document.querySelector("#select-extras [data-name=dog]").dataset
					.selected,
				sheets: document.querySelector("#select-extras [data-name=sheets]")
					.dataset.selected,
				bed: document.querySelector("#select-extras [data-name=bed]").dataset
					.selected,
				to: document.querySelector("#data-extras .selector"),
			},
			date: {
				arvl: {
					to: document.querySelector("#data-dates .selector"),
					value: Calendar.arvl.date,
				},
				dprt: {
					to: document.querySelector("#data-dates .selector"),
					value: Calendar.dprt.date,
				},
				stays: {
					value: dateDiff(Calendar.arvl.date, Calendar.dprt.date),
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
	if (data.extras.dog || data.extras.sheets || data.extras.bed) {
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
		const subject = `Buchung ${sanitizeHTML(
			data.house.value
		)} vom ${sanitizeHTML(arvlLocale)} bis ${sanitizeHTML(dprtLocale)}`;
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
	const extra3 = document.querySelector(".pricing [data-id='extra-3']");
	const sum = document.querySelector(".pricing [data-id='sum']");

	// error message if no date is set
	if (!data.date.arvl.value || !data.date.dprt.value) {
		title.innerText =
			"Preise konnten nicht ermittelt werden, da An- und Abreise nicht festgelegt wurden.";

		// hide all elements for pricing
		hideElement(stays);
		hideElement(cleaning);
		hideElement(extra1);
		hideElement(extra2);
		hideElement(extra3);
		hideElement(sum);

		// do nothing further
		return;
	}

	// error message date not in price list
	const house = data.house.value;
	if (
		!PRICES[house].hasOwnProperty(dt(data.date.arvl.value).getUTCFullYear()) ||
		!PRICES[house].hasOwnProperty(dt(data.date.arvl.value).getUTCFullYear())
	) {
		title.innerText =
			"Der Preis konnte nicht ermittelt werden, da wir für das ausgewählte Datum noch keine Preisliste hinterlegt haben. Generell ist davon auszugehen, dass die Preise ähnlich den bereits vorhandenen sein werden. Für Genaueres wenden Sie sich bitte direkt an uns.";

		// hide all elements for pricing
		hideElement(stays);
		hideElement(cleaning);
		hideElement(extra1);
		hideElement(extra2);
		hideElement(extra3);
		hideElement(sum);

		// do nothing further
		return;
	}

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
	if (data.extras.bed == "true") {
		extra3.lastElementChild.innerText = `${numStays} x ${PRICES[house].bed} €`;
		showElement(extra3);

		// add cost
		price += data.guests.value * PRICES[house].bed;
	} else {
		hideElement(extra3);
	}

	// cleaning
	cleaning.lastElementChild.innerText = `${PRICES[house].cleaning} €`;
	showElement(cleaning);

	// total price
	sum.lastElementChild.innerText = price + " €";
	showElement(sum);
};

const getPriceOfDate = (date, houseID) => {
	if (!PRICES) throw new ConstMissingException("Price list not defined");
	if (!PRICES[houseID].hasOwnProperty(dt(date).getUTCFullYear()))
		throw new ConstMissingException("Prices for this year not defined.");

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

// ------------------------------------------------------------------------
// helpers
// ------------------------------------------------------------------------

/**
 * Disables scroll on body by adding the "modal-open" class to the body.
 * @returns {void}
 */
const enableBackgroundScrollModal = () => {
	document.body.classList.remove("modal-open");
};

/**
 * Enables scroll on body by removing the "modal-open" class from the body.
 * @returns {void}
 */
const disableBackgroundScrollModal = () => {
	document.body.classList.add("modal-open");
};
