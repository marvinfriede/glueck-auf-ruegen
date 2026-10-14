const { loadJsonData } = require("./helpers");

const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

describe.each([
  ["DÜNE", "booking-duene.txt"],
  ["MÖWE", "booking-moewe.txt"],
])("Testing booking dates for %s", (_name, file) => {
  let booked;

  beforeAll(async () => {
    booked = await loadJsonData(file);
  });

  it("has at least one year", () => {
    expect(Object.keys(booked).length).toBeGreaterThan(0);
  });

  it("has all 12 months in order for every year", () => {
    for (const year in booked) {
      expect(Object.keys(booked[year])).toEqual(
        Array.from({ length: 12 }, (_, i) => String(i + 1))
      );
    }
  });

  it("only has valid, sorted, unique integer days for each month", () => {
    for (const year in booked) {
      for (const month in booked[year]) {
        const days = booked[year][month];
        expect(Array.isArray(days)).toBe(true);
        days.forEach((d) => {
          expect(Number.isInteger(d)).toBe(true);
          expect(d).toBeGreaterThanOrEqual(1);
          expect(d).toBeLessThanOrEqual(daysInMonth(+year, +month));
        });
        expect(days).toEqual([...new Set(days)].sort((a, b) => a - b));
      }
    }
  });
});
