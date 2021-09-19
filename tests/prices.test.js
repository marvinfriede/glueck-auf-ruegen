const PRICES = require("../src/js/data/prices.js");

describe("Testing structure of PRICES", () => {
  it("Should have property named 'Düne'", () => {
    expect(PRICES).toHaveProperty("Düne");
  });

  it("Should have property named 'Möwe'", () => {
    expect(PRICES).toHaveProperty("Möwe");
  });

  it("Should have property named 'dog'", () => {
    expect(PRICES).toHaveProperty("dog");
  });

  it("Should have property named 'sheets'", () => {
    expect(PRICES).toHaveProperty("sheets");
  });
});
