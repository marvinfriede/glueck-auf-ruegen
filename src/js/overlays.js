import { Fade } from "./animations.js";

// ------------------------------------------------------------------------
// modal
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
	e.stopImmediatePropagation();
	if (e.touches) e.preventDefault();

	// cover ESC press
	if (e.type === "keyup" && e.key !== "Escape") return;

	// targets
	if (e.target.closest(".content")) return;

	// actual closing function
	closeModalManually(e);
};

/**
 * Closes modal, reenables background scroll and removes listeners if users click outside. (Actual closing function.)
 * @param {MouseEvent} e event object
 * @returns {void}
 */
export const closeModalManually = (e) => {
	// do nothing, if modal is not even visible
	const modal = document.querySelector(".modal.visible");
	if (!modal) return;

	Fade.out(modal, 500);
	enableBackgroundScrollModal();
	removeModalListeners();
};

// ------------------------------------------------------------------------
// image fullscreen
// ------------------------------------------------------------------------

/**
 * Opens fullscreen view, disables background scroll and sets listeners for closing fullscreen mode.
 * @returns {void}
 */
export const openImgFullscreen = (e) => {
	if (e.type !== "click") return;

	const slider = e.target.closest(".slider");
	if (slider.classList.contains("max")) return;

	addStyleSliderFullscreen(slider);
	createTempCloseButton();
	addImgFullscreenListeners();
};

/**
 * Closes fullscreen view and resets to initial state.
 * @returns {void}
 */
const closeImgFullscreen = (e) => {
	if (e.touches) e.preventDefault();

	// cover ESC press
	if (e.type === "keyup" && e.key !== "Escape") return;

	// targets
	if (e.target.classList.contains("tns-lazy")) return;

	removeStyleSliderFullscreen();
	destroyTempCloseButton();
	removeImgFullscreenListeners();
};

/**
 * Attach listeners for closing image fullscreen view.
 * @returns {void}
 */
const addImgFullscreenListeners = () => {
	document.addEventListener("mousedown", closeImgFullscreen);
	document.addEventListener("touchstart", closeImgFullscreen);
	document.addEventListener("keyup", closeImgFullscreen);
};

/**
 * Remove listeners for closing fullscreen view of images.
 * @returns {void}
 */
const removeImgFullscreenListeners = () => {
	document.removeEventListener("mousedown", closeImgFullscreen);
	document.removeEventListener("touchstart", closeImgFullscreen);
	document.removeEventListener("keyup", closeImgFullscreen);
};

/**
 * Adds classes to slider to give container modal character.
 * @param {HTMLDivElement} slider closest to clicked image
 * @returns {void}
 */
const addStyleSliderFullscreen = (slider) => {
	slider.classList.add("max");
	slider.classList.remove("default");
	slider.title = "Klicken zum Schließen.";
	slider.removeEventListener("click", openImgFullscreen);
};

/**
 * Removes class from slider that gives modal character.
 * @returns {void}
 */
const removeStyleSliderFullscreen = () => {
	const slider = document.querySelector(".slider.max");
	slider.classList.remove("max");
	slider.classList.add("default");
	slider.removeAttribute("title");
	slider.addEventListener("click", openImgFullscreen);
};

/**
 * Create the temporary close button in top right corner.
 * @returns {void}
 */
const createTempCloseButton = () => {
	// create all the elements and style them
	const button = document.createElement("div");
	button.classList.add("close-button", "fixed");

	const div = document.createElement("div");
	div.classList.add("icon", "symbol", "l");

	const img = document.createElement("img");
	img.src = "img/window-close.svg";
	img.alt = "";

	// append everything to each other
	// body > div.close-button.fixed > div.icon.symbol.l > img
	div.append(img);
	button.appendChild(div);
	document.body.append(button);
};

/**
 * Fade out and remove the temporary close button.
 * @returns {void}
 */
const destroyTempCloseButton = () => {
	const btn = document.querySelector("body > div.close-button");
	if (btn) Fade.out(btn, 500, true);
};

// ------------------------------------------------------------------------
// helpers
// ------------------------------------------------------------------------

/**
 * Disables scroll on body by adding the "modal-open" class to the body.
 * @returns {void}
 */
const enableBackgroundScrollModal = () => {
	document.body.classList.add("modal-open");
};

/**
 * Enables scroll on body by removing the "modal-open" class from the body.
 * @returns {void}
 */
const disableBackgroundScrollModal = () => {
	document.body.classList.remove("modal-open");
};
