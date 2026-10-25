/**
 * Reveal the site without modifying the modal scroll state.
 * The inline CSS also has a 3-second fail-safe in case JavaScript fails.
 */
export const removeLoadingMask = () => {
  const mask = document.querySelector(".mask");
  if (!mask || mask.classList.contains("is-hidden")) return;

  const remove = () => mask.remove();
  mask.addEventListener("transitionend", (event) => {
    if (event.target === mask && event.propertyName === "opacity") remove();
  }, { once: true });

  mask.classList.add("is-hidden");
  setTimeout(remove, 350); // Also covers reduced-motion browsers.
};
