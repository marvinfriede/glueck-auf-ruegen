export const toggleAccordion = (e) => {
  const el = e.target.closest(".accordion");
  const panel = el.nextElementSibling;
  const caret = el.querySelector(".icon.caret img");

  if (el.classList.contains("active")) {
    el.classList.remove("active");
    el.setAttribute("aria-expanded", "false");
    panel.style.maxHeight = null;
    caret.classList.add("rotate90deg");
    caret.classList.remove("rotate270deg");
  } else {
    el.classList.add("active");
    el.setAttribute("aria-expanded", "true");
    panel.style.maxHeight = panel.scrollHeight + "px";
    caret.classList.remove("rotate90deg");
    caret.classList.add("rotate270deg");
  }
};
