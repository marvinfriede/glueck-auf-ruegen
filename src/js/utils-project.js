import { foreach } from "./utils-standard.js";
import { Fade, hideElement, showElement } from "./animations.js";
import { Calendar } from "./cal.js";
import stripJsonComments from "strip-json-comments";

export const loadJsonData = (url) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        try {
          const json = JSON.parse(stripJsonComments(xhr.responseText));
          return resolve(json);
        } catch (err) {
          return reject(err);
        }
      }
    };
  });

// ---------------------------------------------------
// drowdowns
// ---------------------------------------------------

export const openDropdown = async (e) => {
  const drop = e.target.closest(".drop-root").querySelector(".dropdown");
  const caret = e.target.closest(".drop-root").querySelector(".caret img");
  if (window.getComputedStyle(drop).display === "none") {
    if (caret) {
      caret.classList.remove("rotate90deg");
      caret.classList.add("rotate270deg");
    }
    addDropdownListeners();
    await Fade.in(drop, 500);
  }
};
const closeDropdown = async (e) => {
  if (e.touches) e.preventDefault();

  const drop = document.querySelector(".dropdown.is-open");
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
  removeDropdownListeners();
  await Fade.out(drop, 500);

  // do extra stuff for certain targets (dropdown options)
  if (e.target.classList.contains("dropdown-option")) {
    // display selection
    const name = e.target.getAttribute("data-value");
    root.querySelector(".selection").innerText = name;
    root.dataset.value = name;

    // change available options
    if (root.id === "select-house") {
      updateDropdownGuests(name);
      Calendar.refresh("month");
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

/**
 * Attach listeners for closing dropdown. Without timeout, "click event" would be triggered immediately and thereby closing after opening "click event".
 * @returns {void}
 */
const addDropdownListeners = () => {
  setTimeout(() => {
    document.addEventListener("click", closeDropdown);
    document.addEventListener("keyup", closeDropdown);
  }, 10);
};

/**
 * Remove listeners for closing drowdown.
 * @returns {void}
 */
const removeDropdownListeners = () => {
  document.removeEventListener("click", closeDropdown);
  document.removeEventListener("keyup", closeDropdown);
};

// ---------------------------------------------------
// selectors
// ---------------------------------------------------

export const openSelector = (e) => {
  if (e.touches) e.preventDefault();

  const select = e.target.closest(".selector-root").querySelector(".selector");
  const caret = e.target.closest(".selector-root").querySelector(".caret img");

  if (window.getComputedStyle(select).display === "none") {
    if (caret) {
      caret.classList.remove("rotate90deg");
      caret.classList.add("rotate270deg");
    }
    Fade.in(select, 500);
    addSelectorListeners();
  }
};
const closeSelector = (e) => {
  if (e.touches) e.preventDefault();

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
  removeSelectorListeners();
};

/**
 * Attach listeners for closing selector. Without timeout, "click event" would be triggered immediately and thereby closing after opening "click event".
 * @returns {void}
 */
const addSelectorListeners = () => {
  setTimeout(() => {
    document.addEventListener("click", closeSelector);
    document.addEventListener("keyup", closeSelector);
  }, 10);
};

/**
 * Remove listeners for closing selector.
 * @returns {void}
 */
const removeSelectorListeners = () => {
  document.removeEventListener("click", closeSelector);
  document.removeEventListener("keyup", closeSelector);
};

// ---------------------------------------------------
// map
// ---------------------------------------------------

export const openGoogleMap = () => {
  const note = document.querySelector(".map .note");
  note.remove();

  const iframe = document.querySelector(".map iframe");
  iframe.src =
    "https://www.google.com/maps/embed/v1/place?key=AIzaSyAPDv1gSmdxeAka2fbuY7oMVUXMnxkTHow&q=place/Buchenweg+4,+18586+Sellin,+Deutschland&zoom=14";
  Fade.in(iframe);
};

// ---------------------------------------------------
// booking
// ---------------------------------------------------

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

// ---------------------------------------------------
// dynamic styling
// ---------------------------------------------------

export const scaleGrids = () => {
  const grids = document.querySelectorAll(".info-grid");
  foreach(grids, (grid) => {
    const items = Array.from(grid.querySelectorAll(".grid-item, .info-grid a"));

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
