const PRICES = require("../src/js/data/prices.js");

describe("Testing prices", () => {
  test("Structure of Object", () => {
    expect(PRICES).toHaveProperty("Möwe");
    expect(PRICES).toHaveProperty("Düne");
    expect(PRICES).toHaveProperty("dog");
    expect(PRICES).toHaveProperty("sheets");
  });
});
