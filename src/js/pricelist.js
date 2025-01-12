import { FileNotFoundError } from "./custom-errors";
import { loadJsonData } from "./utils-project";
import { capitalizeFirstLetter, dateDiff, isInt } from "./utils-standard";

export default class Pricelist {
  constructor() {
    this.year = new Date().getFullYear();
  }

  async loadData(path = null) {
    try {
      const p = path || "data/prices.txt";
      this.prices = await loadJsonData(p);
    } catch (xhr) {
      throw new FileNotFoundError(xhr);
    }
  }

  getPrices() {
    return this.prices;
  }

  hookPriceCard(name) {
    this.root = document.querySelector(`#card-${name}`);
    if (!this.root) throw new Error(`Invalid selector: #card-${name}`);

    this.name = name;
    this.nameGer = capitalizeFirstLetter(name.replace("ue", "ü").replace("oe", "ö"));
  }

  run() {
    this.runBed();
    this.runCleaning();
    this.runDog();
    this.runDogCleaning();
    this.runSheets();
    this.runParking();
    this.runList();
  }

  runBed() {
    const price = this.prices[this.nameGer].bed;
    const el = this.root.querySelector(".value.bed");
    this.style(el, price);
  }

  runCleaning() {
    const price = this.prices[this.nameGer].cleaning;
    const el = this.root.querySelector(".value.cleaning");
    this.style(el, price);
  }

  runDog() {
    const price = this.prices.dog.night;
    const el = this.root.querySelector(".value.dog");
    this.style(el, price);
  }

  runDogCleaning() {
    const price = this.prices.dog.cleaning;
    const el = this.root.querySelector(".value.dog-cleaning");
    this.style(el, price, true);
  }

  runSheets() {
    const price = this.prices.sheets;
    const el = this.root.querySelector(".value.sheets");
    this.style(el, price);
  }

  runParking() {
    const price = this.prices.parking;
    const el = this.root.querySelector(".value.parking");
    this.style(el, price);
  }

  runList() {
    const panels = Array.from(this.root.querySelectorAll(".panel .panel-row"));
    const p = this.prices[this.nameGer];
    const listForMinMax = [];

    // iterate all panel in accordion
    for (let i = 0; i < panels.length; i++) {
      const panel = panels[i];
      const textDate = panel.firstElementChild.innerText;
      const textPrice = panel.lastElementChild;

      // date
      const dayMonth = textDate.split(" - ")[0];
      const day = dayMonth.split(".")[0];
      const month = dayMonth.split(".")[1] - 1;
      const currentYear = i == 0 ? this.year - 1 : this.year;
      const date = new Date(currentYear, month, day);

      // iterate over all years in prices
      for (const year in p) {
        if (Object.hasOwnProperty.call(p, year)) {
          if (!isInt(year)) continue;

          // iterate over { start, end, prices }
          for (const times of p[year]) {
            const begin = times.begin;
            if (dateDiff(begin, date) === 0) {
              this.style(textPrice, times.price);
              listForMinMax.push(times.price);
            }
          }
        }
      }
    }

    const el = this.root.querySelector(".card-main--row.accordion .price > .value");
    el.innerText = `${Math.min(...listForMinMax)}€ - ${Math.max(...listForMinMax)}€`;
  }

  style(el, price, plus = false) {
    if (plus) {
      el.innerText = `+ ${price}€`;
    } else if (price == 0) {
      el.innerText = "kostenlos";
    } else {
      el.innerText = `${price}€`;
    }
  }
}
