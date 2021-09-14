/**
 * Custom foreach function to avoid verbose syntax. Converts to array internally
 * @param {Object[]} list Object to iterate over
 * @param {Function} cb callback function
 * @returns {void}
 */
export const foreach = (list, cb) => Array.prototype.forEach.call(list, cb);

/**
 * Custom foreach key function to avoid verbose syntax.
 * @param {Object[]} list Object to iterate over
 * @param {Function} cb callback function
 * @returns {void}
 */
export const foreachKey = (list, cb) => Object.keys(list).forEach(cb);

/**
 * Checks if argument is an integer.
 * @param {any} value target for check
 * @returns {Boolean}
 */
export const isInt = (value) =>
	!isNaN(value) &&
	parseInt(Number(value)) == value &&
	!isNaN(parseInt(value, 10));

/**
 * Set a timeout.
 * @param {Number} ms length of timeout in milliseconds
 * @returns {Promise}
 */
export const timeout = (ms) =>
	new Promise((resolve) => setTimeout(resolve, ms));

// --------------------------------------------------------
// string manipulation
// --------------------------------------------------------

/**
 * Split a string at the first occurence of a character. Returns string if search string is not matched.
 * @param {string} haystack string that should be split
 * @param {string} needle character at which to split
 * @param {number} [idx=0] first (0, default) or last (1) part
 * @returns {string|null} desired part of string or null on error
 */
export const splitStringAtFirstOcc = (haystack, needle, idx = 0) => {
	const pos = haystack.indexOf(needle);
	if (pos == -1) return haystack;
	if (idx == 0) return haystack.substr(0, pos);
	if (idx == 1) return haystack.substr(pos + 1);
	return null;
};

/**
 * Split a string at the last occurence of a character. Returns string if search string is not matched.
 * @param {string} haystack string that should be split
 * @param {string} needle character at which to split
 * @param {number} [idx=1] first (0) or last (1, default) part
 * @returns {string|null} desired part of string or null on error
 */
export const splitStringAtLastOcc = (haystack, needle, idx = 1) => {
	if (haystack.indexOf(needle) == -1) return haystack;
	if (idx == 0) return haystack.substr(0, haystack.lastIndexOf(needle));
	if (idx == 1) return haystack.substr(haystack.lastIndexOf(needle) + 1);
	return null;
};

/**
 * Split a string between first occurence of character 1 and last occurence of character 2. Returns string if search string is not matched.
 * @param {string} haystack string that should be split
 * @param {string} char1 first character at which to split
 * @param {string} char2 second character at which to split
 * @returns {string} desired substring or null on error
 */
export const splitStringBetweenTwoChars = (haystack, char1, char2) => {
	if (haystack.indexOf(char1) == -1 || haystack.indexOf(char2) == -1)
		return haystack;
	return haystack.substring(
		haystack.indexOf(char1) + char1.length,
		haystack.lastIndexOf(char2)
	);
};

// --------------------------------------------------------
// Check if empty
// --------------------------------------------------------

/**
 * Check if a string is empty or contains nothing (""). 0 will return false; "0" won't.
 * @param {string} str target for test
 * @returns {Boolean}
 */
export const isStrEmpty = (str) => !str || 0 === str.length;

/**
 * Checks if an object is an empty object.
 * @param {object} obj target for test
 * @returns {Boolean}
 */
export const isObjEmpty = (obj) =>
	obj && Object.keys(obj).length === 0 && obj.constructor === Object;

/**
 * Checks if thing is empty. 0 will also return false; "0" won't.
 * @param {object|string} thing target for test
 * @returns {Boolean}
 */
export const isEmpty = (thing) => isStrEmpty(thing) || isObjEmpty(thing);

// --------------------------------------------------------
// DOM manipulation
// --------------------------------------------------------

/**
 * Sanitize and encode HTML.
 * @param {String} str string
 * @returns {String}
 */
export const sanitizeHTML = (str) => {
	const temp = document.createElement("div");
	temp.textContent = str;
	return temp.innerHTML;
};

/**
 * Finding the index of an element within its parentNode's children
 * @param {HTMLElement} el target element
 * @returns {Number} index of element
 */
export const getNodeIndex = (el) => [...el.parentNode.children].indexOf(el);

/**
 * Remove all children of passed element.
 * @param {HTMLElement} el
 * @param {Boolean} removeSelf remove the element itself
 * @returns {void}
 */
export const clearChildren = (el, removeSelf = false) => {
	if (removeSelf === true) el.parentNode.removeChild(el);
	while (el.firstChild) el.removeChild(el.lastChild);
};

/**
 * Move node in DOM. Target will be first child of destination
 * @param {HTMLElement} target object to move
 * @param {HTMLElement} destination
 * @returns {void}
 */
export const moveHtml = (target, destination) => {
	if (!target || !destination) return;

	destination.insertBefore(target, destination.firstElementChild);
};

// --------------------------------------------------------
// time and dates
// --------------------------------------------------------

/**
 * Converts ISO date string to integer date.
 * @param {String} timeStr date string in ISO format
 * @returns {Number} date as integer
 */
export const getTime = (timeStr) => new Date(timeStr).getTime();

/**
 * Calculates number of days between two dates.
 * @param {String|Number} first first date
 * @param {String|Number} second second date
 * @returns {Number} date as integer
 */
export const dateDiff = (first, second) => {
	if (!isInt(first)) first = dt(first).toInt();
	if (!isInt(second)) second = dt(second).toInt();
	return Math.round((second - first) / (1000 * 60 * 60 * 24));
};

/**
 * Formats a Date Object to midnight independent of local settings. Makes comparison of dates only possible
 * @param {String|Date} initDate first date
 */
export const dt = (initDate) => {
	// source: https://stackoverflow.com/questions/2698725/comparing-date-part-only-without-comparing-time-in-javascript

	let utcMidnightDateObj = null;
	// if no date supplied, use Now.
	if (!initDate) initDate = new Date();

	// if initDate specifies a timezone offset, or is already UTC,
	// just keep the date part, reflecting the date _in that timezone_
	if (
		typeof initDate === "string" &&
		initDate.match(/((\+|-)\d{2}:\d{2}|Z)$/gm)
	) {
		utcMidnightDateObj = new Date(initDate.substring(0, 10) + "T00:00:00Z");
	} else {
		// if initDate is no date object, feed it to the date constructor.
		if (!(initDate instanceof Date)) initDate = new Date(initDate);
		// Vital Step! Strip time part. Create UTC midnight dateObj according to local timezone.
		utcMidnightDateObj = new Date(
			Date.UTC(initDate.getFullYear(), initDate.getMonth(), initDate.getDate())
		);
	}

	return {
		toDate: () => utcMidnightDateObj,
		toInt: () => utcMidnightDateObj.getTime(),
		toISOString: () => utcMidnightDateObj.toISOString(),
		toISOStringNoTime: () => utcMidnightDateObj.toISOString().substring(0, 10),
		getUTCDate: () => utcMidnightDateObj.getUTCDate(),
		getUTCDay: () => utcMidnightDateObj.getUTCDay(),
		getUTCFullYear: () => utcMidnightDateObj.getUTCFullYear(),
		getUTCMonth: () => utcMidnightDateObj.getUTCMonth(),
		setUTCDate: (arg) => utcMidnightDateObj.setUTCDate(arg),
		setUTCFullYear: (arg) => utcMidnightDateObj.setUTCFullYear(arg),
		setUTCMonth: (arg) => utcMidnightDateObj.setUTCMonth(arg),
		addDays: (days) => {
			utcMidnightDateObj.setUTCDate(utcMidnightDateObj.getUTCDate + days);
		},
		toString: () => utcMidnightDateObj.toString(),
		toLocaleDateString: (locale, options) => {
			options = options || {};
			options.timeZone = "Europe/Berlin";
			locale = locale || "de-DE";
			return utcMidnightDateObj.toLocaleDateString(locale, options);
		},
	};
};

// --------------------------------------------------------
// performance
// --------------------------------------------------------

/**
 * Create a new function that limits calls to func to once every given timeframe.
 * @param {Function} func target for debounce
 * @param {Number} timeFrame collection time in ms
 * @returns {Function}
 */
export function throttle(func, timeFrame) {
	var lastTime = 0;
	return function (...args) {
		var now = new Date();
		if (now - lastTime >= timeFrame) {
			func(...args);
			lastTime = now;
		}
	};
}

/**
 * Create a new function that calls func with thisArg and args. Debouncing groups multiple sequential calls in a single one.
 * @param {Function} func target for debounce
 * @param {Number} wait collection time in ms
 * @param {Boolean} immediate leading trigger
 * @returns {Function}
 */
export function debounce(func, wait, immediate = false) {
	var timeout;
	return function () {
		var context = this,
			args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		}, wait);
		if (immediate && !timeout) func.apply(context, args);
	};
}

// --------------------------------------------------------
// CSS and Styling
// --------------------------------------------------------

export const getScrollbarWidth = (unit) => {
	// Create the measurement node
	const scrollDiv = document.createElement("div");
	scrollDiv.style.position = "absolute";
	scrollDiv.style.top = "-9999px";
	scrollDiv.style.width = "100px";
	scrollDiv.style.height = "100px";
	scrollDiv.style.overflow = "scroll";
	document.body.appendChild(scrollDiv);

	// Get the scrollbar width
	const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

	// Delete the DIV
	document.body.removeChild(scrollDiv);

	return scrollbarWidth + unit;
};
