export const BP = {
  xs: 376,
  s: 576,
  n: 768,
  l: 992,
  xl: 1200,
  xxl: 1400,
  xxxl: 1700,
};

export const sliderLabels = {
  prev: "Vorheriges Bild",
  next: "Nächstes Bild",
  first: "Erstes Bild",
  last: "Letztes Bild",
  slideX: "Bild %s",
  pageX: "Seite %s",
  slideLabel: "%s von %s",
  play: "Diashow starten",
  pause: "Diashow pausieren",
  carousel: "Bildergalerie",
  select: "Bild auswählen",
};

export const optionsFull = {
  i18n: sliderLabels,
  cover: false,
  lazyLoad: "nearby",
  pagination: false,
  perPage: 1,
  preloadPages: 0,
  rewind: true,
  type: "fade",
};

export const optionsCover = Object.assign({}, optionsFull, { cover: true });

export const optionsThumb = {
  i18n: sliderLabels,
  breakpoints: {
    700: {
      fixedHeight: 50,
      fixedWidth: 70,
    },
  },
  cover: true,
  classes: {
    arrow: "splide__arrow transparent",
    next: "splide__arrow--next outside",
    prev: "splide__arrow--prev outside",
  },
  focus: "center",
  fixedHeight: 64,
  fixedWidth: 100,
  gap: 10,
  isNavigation: true,
  lazyLoad: "sequential",
  pagination: false,
  rewind: true,
  width: "calc(100% - 5em)",
};
