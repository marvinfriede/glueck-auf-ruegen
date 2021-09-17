/**
 * Season-dependent prices for both objects.
 * @constant
 */
const PRICES = {
  // ------------------------------------------- //
  // Preise und Zeiträume für FERIEMWOHNUNG DÜNE //
  // ------------------------------------------- //
  Düne: {
    2021: [
      { begin: "2021/01/01", end: "2021/01/03", price: 210 }, // 1. Januar - 3. Januar
      { begin: "2021/01/04", end: "2021/03/31", price: 119 }, // 4. Januar - 31.März
      { begin: "2021/04/01", end: "2021/05/31", price: 155 }, // 1. April - 31. Mai
      { begin: "2021/06/01", end: "2021/09/12", price: 210 }, // 1. Juni - 12. September
      { begin: "2021/09/13", end: "2021/10/31", price: 155 }, // 13. September - 31. Oktober
      { begin: "2021/11/01", end: "2021/12/22", price: 119 }, // 1. November - 22. Dezember
      { begin: "2021/12/23", end: "2021/12/31", price: 210 }, // 23. Dezember - 31. Dezember
    ],
    bed: 0,
    cleaning: 90,
  },

  // -------------------------------------- //
  // Preise und Zeiträume für BUNGALOW MÖWE //
  // -------------------------------------- //
  Möwe: {
    2021: [
      { begin: "2021/01/01", end: "2021/01/03", price: 99 }, // 1. Januar - 3. Januar
      { begin: "2021/01/04", end: "2021/03/31", price: 65 }, // 4. Januar - 31.März
      { begin: "2021/04/01", end: "2021/05/31", price: 75 }, // 1. April - 31. Mai
      { begin: "2021/06/01", end: "2021/09/12", price: 99 }, // 1. Juni - 12. September
      { begin: "2021/09/13", end: "2021/10/31", price: 75 }, // 13. September - 31. Oktober
      { begin: "2021/11/01", end: "2021/12/22", price: 65 }, // 1. November - 22. Dezember
      { begin: "2021/12/23", end: "2021/12/31", price: 99 }, // 23. Dezember - 31. Dezember
    ],
    cleaning: 110,
    bed: 10,
  },

  // ----------------------------------- //
  // Extras mit gleichem Preis für beide //
  // ----------------------------------- //
  dog: { night: 10, cleaning: 20 },
  sheets: 15,
};

export default PRICES;
