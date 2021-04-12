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

/**
 * Check if a string is contains nothing ("").
 * @param {string} str target for test
 * @returns {Boolean}
 */
export const isStrEmpty = (str) => !str || 0 === str.length;

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
