const featureLabelMap: Record<string, string> = {
  restaurant: "Restaurant",
  bar: "Bar",
  beachbar: "Strandbar",
  cafe: "Cafe",
  bakery: "Baeckerei",
  supermarket: "Supermarkt",
  pool: "Pool",
  "indoor pool": "Hallenbad",
  sauna: "Sauna",
  wellness: "Wellness",
  fitness: "Fitness",
  lake: "See",
  sea: "Meer",
  river: "Fluss",
  beach: "Strand",
  "dog beach": "Hundestrand",
  sup: "SUP",
  kayak: "Kajak",
  "boat rental": "Bootsverleih",
  "bike rental": "Fahrradverleih",
  "e-bike rental": "E-Bike-Verleih",
  playground: "Spielplatz",
  animation: "Animation",
  "live music": "Live-Musik",
  events: "Events",
  wifi: "WLAN",
  "washing machine": "Waschmaschine",
  dryer: "Trockner",
  electricity: "Strom",
  "fresh water": "Frischwasser",
  "waste water": "Abwasser",
  "chemical toilet disposal": "Chemie-WC-Entsorgung",
  "motorhome service": "Wohnmobil-Service",
};

const placeTypeTagMap: Record<string, string> = {
  camping: "Camping",
  motorhome_pitch: "Wohnmobilstellplatz",
  vanlife_camp: "Vanlife-Camp",
  nature_camp: "Naturcamp",
  farm: "Hof",
  winery: "Weingut",
  glamping: "Glamping",
  marina: "Marina",
  beach_camp: "Strandcamp",
  festival_camp: "Festivalcamp",
  other: "Sonstiges",
};

const nearbyCategoryMap: Record<string, string> = {
  bar: "Bar",
  beach_bar: "Strandbar",
  restaurant: "Restaurant",
  cafe: "Cafe",
  bakery: "Baeckerei",
  supermarket: "Supermarkt",
  beach: "Strand",
  lake: "See",
  spa: "Spa",
  sauna: "Sauna",
  bike_rental: "Fahrradverleih",
  sup_kayak: "SUP / Kajak",
  boat_rental: "Bootsverleih",
  town: "Ort",
  nightlife: "Nachtleben",
  winery: "Weingut",
  hiking: "Wandern",
  mountain_lift: "Bergbahn",
  attraction: "Attraktion",
  sight: "Sehenswuerdigkeit",
  other: "Sonstiges",
};

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

export function getFeatureLabel(value: string) {
  const normalized = normalizeKey(value);
  return featureLabelMap[normalized] ?? value;
}

export function getPlaceTypeTagLabel(value: string) {
  const normalized = normalizeKey(value);
  return placeTypeTagMap[normalized] ?? value;
}

export function getNearbyCategoryLabel(value: string) {
  const normalized = normalizeKey(value);
  return nearbyCategoryMap[normalized] ?? value;
}
