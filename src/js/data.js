export const BOOKED = {
	2021: {
		1: [],
		2: [],
		3: [5, 6, 7, 8, 15],
		4: [1, 5, 7, 9, 20],
		5: [4, 5, 17, 18, 19],
		6: [],
		7: [],
		8: [],
		9: [21,22,23,24,25,26,27,28],
		10: [1, 6, 7, 8],
		11: [11, 12, 13, 14, 15],
		12: [],
	},
	2022: {
		1: [],
		2: [],
		3: [],
		4: [],
		5: [],
		6: [],
		7: [],
		8: [],
		9: [],
		10: [],
		11: [],
		12: [],
	},
	2023: {
		1: [],
		2: [],
		3: [],
		4: [],
		5: [],
		6: [],
		7: [],
		8: [],
		9: [],
		10: [],
		11: [],
		12: [],
	},
};

export const PRICES = {
	// fewo duene
	Düne: {
		2021: [
			{ begin: "2021/01/01", end: "2021/01/03", price: 210 },
			{ begin: "2021/01/04", end: "2021/03/31", price: 119 },
			{ begin: "2021/04/01", end: "2021/05/31", price: 155 },
			{ begin: "2021/06/01", end: "2021/09/12", price: 210 },
			{ begin: "2021/09/13", end: "2021/10/31", price: 155 },
			{ begin: "2021/11/01", end: "2021/12/22", price: 119 },
			{ begin: "2021/12/23", end: "2021/12/31", price: 210 },
		],
		bed: 0,
		cleaning: 90,
	},
	// bungalow moewe
	Möwe: {
		2021: [
			{ begin: "2021/01/01", end: "2021/01/03", price: 99 },
			{ begin: "2021/01/04", end: "2021/03/31", price: 65 },
			{ begin: "2021/04/01", end: "2021/05/31", price: 75 },
			{ begin: "2021/06/01", end: "2021/09/12", price: 99 },
			{ begin: "2021/09/13", end: "2021/10/31", price: 75 },
			{ begin: "2021/11/01", end: "2021/12/22", price: 65 },
			{ begin: "2021/12/23", end: "2021/12/31", price: 99 },
		],
		cleaning: 110,
		bed: 10,
	},
	// gleich
	dog: { night: 10, cleaning: 20 },
	sheets: 15,
};
