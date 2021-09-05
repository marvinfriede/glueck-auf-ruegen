import { Fade } from "./animations.js";
import { BOOKED } from "./data.js";
import { dateDiff, dt, foreach, isInt, isStrEmpty } from "./utils-standard.js";
import { openDropdown } from "./utils-project.js";

export const Calendar = {
	cal: document.querySelector(".cal-wrap"),
	main: document.querySelector(".cal-main"),
	selectMonth: document.querySelector("#select-month"),
	selectYear: document.querySelector("#select-year"),
	arvl: {
		input: document.querySelector("#arrival input"),
		node: null,
		date: null,
	},
	dprt: {
		input: document.querySelector("#departure input"),
		node: null,
		date: null,
	},
	isCalOpen: false,
	activeInp: false,
	date: new Date(), // this date is altered
	today: new Date(), // today's actual date

	init: function (options = { disablePastDays: true, markToday: true }) {
		this.opts = options;
		this.date.setDate(1); // set date to first day of month
		this.createMonth();
		this.createListeners();

		document.querySelector("#select-month .selection").innerText =
			this.getMonthAsString(this.date.getMonth());
		document.querySelector("#select-year .selection").innerText =
			this.date.getFullYear();

		this.arvl.input.value = "";
		this.dprt.input.value = "";
	},

	createListeners: function () {
		const _this = this;

		document
			.querySelector(".cal-header__btn.next")
			.addEventListener("click", (e) => {
				_this.updateCalendar("month", _this.date.getMonth() + 1);
			});
		document
			.querySelector(".cal-header__btn.prev")
			.addEventListener("click", (e) => {
				_this.updateCalendar("month", _this.date.getMonth() - 1);
			});

		document
			.querySelector("#select-month")
			.addEventListener("click", openDropdown);
		document
			.querySelector("#select-year")
			.addEventListener("click", openDropdown);

		// opening and closing the Calendar
		this.arvl.input.addEventListener("click", (e) => {
			_this.showCalendar(e);
		});
		this.dprt.input.addEventListener("click", (e) => {
			_this.showCalendar(e);
		});

		// one listener for all clicks in cal
		this.cal.addEventListener("mousedown", (e) => {
			e.preventDefault(); // prevent loss of focus
			this.handleCalActions(e.target);
		});
	},

	handleCalActions: function (el) {
		// dropdown selection when jumping to year/month
		if (el.classList.contains("dropdown-option")) {
			if (el.closest("#select-year")) {
				this.updateCalendar("year", el.innerText);
			} else if (el.closest("#select-month")) {
				this.updateCalendar("month", el.dataset.id - 1);
			} else {
				console.warn("Identifier not found.");
			}
			return;
		}

		// buttons in footer
		if (el.classList.contains("cal-footer--button")) {
			if (el.id == "cal-clear") {
				this.calDayStyling(this.arvl.node, "cal-main__date--arrival", false);
				this.calDayStyling(this.dprt.node, "cal-main__date--departure", false);
				this.clearInput(this.arvl.input, this.arvl.node);
				this.clearInput(this.dprt.input, this.dprt.node);
			} else if (el.id == "cal-close") {
				this.hideCalendar();
			} else {
				console.warn("Identifier not found.");
			}
			return;
		}

		// date selection
		if (el.dataset.date) {
			// set arrival
			if (this.activeInp === this.arvl.input) {
				// set values and styling after verifying the time span
				if (this.verifySelection(el)) {
					this.arvl.node = el;
					this.setInput(el);
					this.calDayStyling(el, "cal-main__date--arrival");
				}
			}

			// set departure
			else if (this.activeInp === this.dprt.input) {
				if (this.verifySelection(el)) {
					this.dprt.node = el;
					this.setInput(el);
					this.calDayStyling(el, "cal-main__date--departure");
				}
			}

			// "exception"
			else {
				console.warn("Identifier not found.");
			}
		}
	},

	calDayStyling: function (el, targetClass, applyStyling = true) {
		const id1 = targetClass.includes("arrival") ? "departure" : "arrival";
		const id2 = targetClass.includes("arrival") ? "arrival" : "departure";

		foreach(
			this.main.querySelectorAll(".cal-main__date.cal-main__date--active"),
			(div) => {
				// remove arrival/departure style class from all
				div.classList.remove(targetClass);

				// remove arrival/departure date-for attribute from all
				if (div.firstElementChild.getAttribute("data-date-for") !== id1) {
					div.firstElementChild.removeAttribute("data-date-for");
					div.firstElementChild.setAttribute("data-has-type", false);
				}
			}
		);

		// apply styling
		if (!applyStyling) return;
		el.closest(".cal-main__date.cal-main__date--active").classList.add(
			targetClass
		);
		el.setAttribute("data-date-for", id2);
		el.setAttribute("data-has-type", true);
	},

	verifySelection: function (el) {
		if (el == this.dprt.node) {
			this.calDayStyling(this.dprt.node, "cal-main__date--departure", false);
			this.clearInput(this.dprt.input, this.dprt.node);
			return false;
		}
		if (el == this.arvl.node) {
			this.calDayStyling(this.arvl.node, "cal-main__date--arrival", false);
			this.clearInput(this.arvl.input, this.arvl.node);
			return false;
		}

		let other, arvlDate, dprtDate;
		if (this.activeInp == this.arvl.input) {
			other = this.dprt.input;
			dprtDate = other.dataset.value;
			arvlDate = el.dataset.date;
		} else if (this.activeInp == this.dprt.input) {
			other = this.arvl.input;
			arvlDate = other.dataset.value;
			dprtDate = el.dataset.date;
		}

		// both empty: no restriction
		if (isStrEmpty(this.activeInp.value) && isStrEmpty(other.value)) {
			if (this.activeInp == this.arvl.input) {
				this.arvl.date = dt(arvlDate).toISOStringNoTime();
			} else if (this.activeInp == this.dprt.input) {
				this.dprt.date = dt(dprtDate).toISOStringNoTime();
			}
			return true;
		}

		// active set, other empty
		if (!isStrEmpty(this.activeInp.value) && isStrEmpty(other.value)) {
			return true;
		}

		// convert date string to int
		const arvlDayInt = dt(arvlDate).toInt();
		const dprtDayInt = dt(dprtDate).toInt();

		// check if any booked day is between selection
		const daysStayed = dateDiff(arvlDayInt, dprtDayInt);
		let i, day, month, year;

		// start with dprt since selection of arvl is prohibited
		let date = dt(dprtDate).toDate();
		for (i = 0; i < daysStayed; i++) {
			month = date.getMonth() + 1;
			day = date.getDate();
			year = date.getFullYear();

			// if this year/month is not even listed, it's surely not booked
			if (BOOKED.hasOwnProperty(year)) {
				if (BOOKED[year].hasOwnProperty(month)) {
					// check if day is included in list of booked days of month
					if (BOOKED[year][month].includes(day)) return false;
				}
			}

			// set date to previous day
			date.setDate(date.getDate() - 1);
		}

		// check if order is correct
		if (isInt(arvlDayInt) && isInt(dprtDayInt)) {
			if (arvlDayInt < dprtDayInt) {
				this.arvl.date = dt(arvlDate).toISOStringNoTime();
				this.dprt.date = dt(dprtDate).toISOStringNoTime();
				return true;
			}
		}

		return false;
	},

	showCalendar: function (e) {
		if (this.isCalOpen === true) {
			// close if input is clicked again
			if (e.target == this.activeInp) {
				this.hideCalendar(e);
			}

			// if other input is clicked
			else {
				this.clearActiveInput();
				this.activeInp = e.target;
				this.setActiveInput();
			}
			return;
		}

		// set active and show
		this.activeInp = e.target;
		this.setActiveInput();
		this.isCalOpen = true;

		Fade.in(this.cal, 500);

		// center in view
		this.cal.scrollIntoView({
			behavior: "smooth",
			block: "center",
			inline: "center",
		});

		addCalListeners();
	},
	hideCalendar: function () {
		if (this.activeInp) this.clearActiveInput();
		this.isCalOpen = false;

		Fade.out(this.cal, 500);

		removeCalListeners();
	},

	// handles content (value) of content
	setInput: function (el) {
		this.activeInp.value = new Date(el.dataset.date).toLocaleDateString();
		this.activeInp.setAttribute("data-value", el.dataset.date);
		this.activeInp.setAttribute("data-has-value", true);
	},
	clearInput: function (el, day) {
		el.value = "";
		el.setAttribute("data-value", "");
		el.setAttribute("data-has-value", false);

		if (this.arvl.node === day) {
			this.arvl.node = null;
			this.arvl.date = null;
		} else if (this.dprt.node === day) {
			this.dprt.node = null;
			this.dprt.date = null;
		}
	},

	// handle which input is active
	setActiveInput: function () {
		this.activeInp.classList.add("active");
		this.activeInp.setAttribute("data-active", true);
		this.cal.setAttribute("data-date-for", this.activeInp.parentNode.id);
	},
	clearActiveInput: function () {
		this.activeInp.classList.remove("active");
		this.activeInp.setAttribute("data-active", false);
		this.activeInp.blur();
		this.activeInp = false;
		this.cal.removeAttribute("data-date-for");
	},

	updateCalendar: function (type, value) {
		if (type == "month") {
			this.date.setMonth(value);
		} else if (type == "year") {
			this.date.setYear(value);
		}

		this.clearCalendar();
		this.createMonth();
	},

	clearCalendar: function () {
		this.main.innerHTML = "";
	},

	createMonth: function () {
		// nodes are destroyed
		this.arvl.node = null;
		this.dprt.node = null;

		// save current month
		const currMonth = this.date.getMonth();

		// create day and set date to next day; eventually next day will be in different month and loop will be exited
		while (this.date.getMonth() === currMonth) {
			this.createDay(this.date);
			this.date.setDate(this.date.getDate() + 1);
		}

		// reset date
		this.date.setDate(1);
		this.date.setMonth(this.date.getMonth() - 1);

		// print current month and year in header
		document.querySelector("#select-month .selection").innerText =
			this.getMonthAsString(currMonth);
		document.querySelector("#select-year .selection").innerText =
			this.date.getFullYear();
	},

	createDay: function (day) {
		const div = document.createElement("div");
		const span = document.createElement("span");

		const dayNum = day.getDate(); // get day as number (1-31)
		const weekdayNum = day.getDay(); // get weekday as number (0-6)
		const year = this.date.getFullYear();
		const month = this.date.getMonth() + 1;

		span.innerHTML = dayNum;
		div.className = "cal-main__date";

		// employ margin for first day
		if (dayNum === 1) {
			if (weekdayNum === 0) {
				// 0 = sunday
				div.style.marginLeft = 6 * 14.285 + "%";
			} else {
				div.style.marginLeft = (weekdayNum - 1) * 14.285 + "%";
			}
		}

		// additional css for today's date
		if (this.opts.markToday && this.today.getTime() == this.date.getTime())
			div.classList.add("cal-main__date--today");

		if (
			(this.opts.disablePastDays &&
				this.date.getTime() <= this.today.getTime() - 1) ||
			(BOOKED[year] && BOOKED[year][month].indexOf(dayNum) > -1)
		) {
			div.classList.add("cal-main__date--disabled");
			div.title = "Belegt";
		} else {
			div.classList.add("cal-main__date--active");
			div.setAttribute("data-Calendar-status", "active");
			span.setAttribute("data-date", dt(this.date).toISOStringNoTime());
			span.setAttribute("data-has-type", false);
		}

		div.appendChild(span);

		// style arrival or departure when coming from different month
		if (this.arvl.date) {
			if (dt(this.arvl.date).toInt() === dt(this.date).toInt()) {
				this.calDayStyling(span, "cal-main__date--arrival");
				this.arvl.node = span; // old one is destroyed by changing month
			}
		}
		if (this.dprt.date) {
			if (dt(this.dprt.date).toInt() === dt(this.date).toInt()) {
				this.calDayStyling(span, "cal-main__date--departure");
				this.dprt.node = span; // old one is destroyed by changing month
			}
		}

		this.main.appendChild(div);
	},

	getMonthAsString: function (idx) {
		return [
			"Januar",
			"Februar",
			"März",
			"April",
			"Mai",
			"Juni",
			"Juli",
			"August",
			"September",
			"Oktober",
			"November",
			"Dezember",
		][idx];
	},
};

/**
 * Attach listeners for closing the Calendar. "Click event" would be triggered immediately and thereby closing the modal after opening "click event".
 * @returns {void}
 */
const addCalListeners = () => {
	setTimeout(() => {
		document.addEventListener("click", closeCal);
		document.addEventListener("keyup", closeCal);
	}, 10);
};

/**
 * Remove listeners for closing the Calendar.
 * @returns {void}
 */
const removeCalListeners = () => {
	document.removeEventListener("click", closeCal);
	document.removeEventListener("keyup", closeCal);
};

/**
 * Close calendar and remove listeners.
 * @param {Event} e
 * @returns {void}
 */
const closeCal = (e) => {
	// targets
	if (e.target.closest(".cal-wrap")) return;
	if (e.target.classList.contains("date-picker") && e.type !== "keyup") return;

	// cover ESC press
	if (e.type === "keyup" && e.key !== "Escape") return;

	Calendar.hideCalendar();
	removeCalListeners();
};
