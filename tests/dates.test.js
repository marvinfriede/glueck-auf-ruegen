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

let counter, i;

describe("Testing booking dates for DÜNE", () => {
  it("async parent", async () => {
    const BOOKED_DUENE = await loadJsonData("../data/booking-duene.txt");

    // loop through years
    for (const year in BOOKED_DUENE) {
      if (Object.hasOwnProperty.call(BOOKED_DUENE, year)) {
        const yearObj = BOOKED_DUENE[year];

        // test each year
        test(`Test year ${year}`, () => {
          // loop through months to get days

          counter = 1;
          for (const month in yearObj) {
            // check if all 12 months present
            expect(parseInt(month)).toBe(counter);

            if (Object.hasOwnProperty.call(yearObj, month)) {
              const days = yearObj[month];
              const numDays = days.length;
              if (numDays !== 0) {
                for (i = 0; i < numDays; i++) {
                  // check if largest day is 31
                  expect(days[i]).toBeLessThan(32);
                }
              }
            }
            counter += 1;
          }
        });
      }
    }
  });
});

describe("Testing booking dates for MÖWE", () => {
  it("async parent", async () => {
    const BOOKED_MOEWE = await loadJsonData("../data/booking-moewe.txt");

    // loop through years
    for (const year in BOOKED_MOEWE) {
      if (Object.hasOwnProperty.call(BOOKED_MOEWE, year)) {
        const yearObj = BOOKED_MOEWE[year];

        // test each year
        test(`Test year ${year}`, () => {
          // loop through months to get days

          counter = 1;
          for (const month in yearObj) {
            // check if all 12 months present
            expect(parseInt(month)).toBe(counter);

            if (Object.hasOwnProperty.call(yearObj, month)) {
              const days = yearObj[month];
              const numDays = days.length;
              if (numDays !== 0) {
                for (i = 0; i < numDays; i++) {
                  // check if largest day is 31
                  expect(days[i]).toBeLessThan(32);
                }
              }
            }
            counter += 1;
          }
        });
      }
    }
  });
});
