const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const loadJsonData = (url) =>
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
      } else if (xhr.status == 404) {
        return reject(xhr);
      }
    };
  });

describe("Testing structure of PRICES", () => {
  it("async parent", async () => {
    const PRICES = await loadJsonData("../data/prices.txt");
    console.log("AFTER\n\n");

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
});
