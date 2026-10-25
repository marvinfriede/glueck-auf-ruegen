import { FileNotFoundError } from "./custom-errors";
import { getPricePeriods, loadJsonData } from "./utils-project";
import { capitalizeFirstLetter } from "./utils-standard";

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
    const periods = getPricePeriods(this.prices[this.nameGer], this.year);
    if (!periods.length) return;

    const formatDate = (value) => {
      const [, month, day] = value.split("/");
      return `${day}.${month}.`;
    };

    const rows = periods.map((period) => {
      const row = document.createElement("div");
      row.className = "panel-row";

      const season = document.createElement("div");
      season.className = "season";
      season.innerText = `${formatDate(period.begin)} - ${formatDate(period.end)}`;

      const price = document.createElement("div");
      price.className = "price large";
      this.style(price, period.price);

      row.append(season, price);
      return row;
    });

    this.root.querySelector(".panel").replaceChildren(...rows);

    const rates = periods.map((period) => period.price);
    const range = this.root.querySelector(".card-main--row.accordion .price > .value");
    range.innerText = `${Math.min(...rates)}€ - ${Math.max(...rates)}€`;
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
