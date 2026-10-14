const { loadJsonData } = require("./helpers");

const toDate = (s) => {
  const [y, m, d] = s.split("/").map(Number);
  return new Date(y, m - 1, d);
};

describe("Testing structure of PRICES", () => {
  let PRICES;

  beforeAll(async () => {
    PRICES = await loadJsonData("prices.txt");
  });

  it.each(["Düne", "Möwe", "dog", "sheets"])(
    "should have property named '%s'",
    (key) => {
      expect(PRICES).toHaveProperty(key);
    }
  );

  describe.each(["Düne", "Möwe"])("price periods for %s", (house) => {
    it("have valid dates, positive prices and no gaps or overlaps", () => {
      for (const year of Object.keys(PRICES[house]).filter((k) => /^\d{4}$/.test(k))) {
        const periods = PRICES[house][year];
        expect(periods.length).toBeGreaterThan(0);

        periods.forEach((p, i) => {
          expect(p.begin).toMatch(/^\d{4}\/\d{2}\/\d{2}$/);
          expect(p.end).toMatch(/^\d{4}\/\d{2}\/\d{2}$/);
          expect(p.price).toBeGreaterThan(0);
          expect(toDate(p.begin) <= toDate(p.end)).toBe(true);

          if (i > 0) {
            const next = new Date(toDate(periods[i - 1].end));
            next.setDate(next.getDate() + 1);
            expect(toDate(p.begin).getTime()).toBe(next.getTime());
          }
        });

        expect(periods[0].begin).toBe(`${year}/01/01`);
        expect(periods[periods.length - 1].end).toBe(`${year}/12/31`);
      }
    });
  });
});
