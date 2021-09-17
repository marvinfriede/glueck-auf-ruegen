import { Fade } from "./animations";

/**
 * Fades out loading mask on ".mask".
 * @returns {void}
 * @see Fade
 */
export const removeLoadingMask = () => {
  Fade.out(document.querySelector(".mask"), 1500, true, true);
};
