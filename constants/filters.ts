import { brands } from "./brands.js";

export const clothesSizes = [
  "xxs",
  "xs",
  "s",
  "m",
  "l",
  "xl",
  "xxl",
  "3xl",
  "4xl",
  "5xl",
];

export const shoesSizes = [
  "35",
  "35.5",
  "36",
  "36.5",
  "37",
  "37.5",
  "38",
  "38.5",
  "39",
  "39.5",
  "40",
  "40.5",
  "41",
  "41.5",
  "42",
  "42.5",
  "43",
  "43.5",
  "44",
  "44.5",
  "45",
  "45.5",
  "46",
  "46.5",
  "47",
  "47.5",
  "48",
  "48.5",
  "49",
  "49.5",
  "50",
];

export const colors = [
  "Nero",
  "Marrone",
  "Beige",
  "Grigio",
  "Bianco",
  "Blu",
  "Petrolio",
  "Azzurro",
  "Verde",
  "Oliva",
  "Giallo",
  "Arancione",
  "Rosso",
  "Rosa",
  "Lilla",
  "Oro",
  "Argento",
  "Multicolore",
];

export const occasions = ["casual", "elegante", "serio", "festa", "mare"];
export const materials = [
  //   "alpaca",
  //   "angora",
  //   "cammello",
  "cashmere",
  "lana",
  "lambswool",
  "mohair",
  "pelle",
  "seta",
  "cotone",
  "canapa",
  "juta",
  "lino",
  "flanella",
  //   "ramiè",
  //   "viscosa",
  //   "rayon",
  //   "acrilico",
  //   "elastan",
  //   "poliestere",
  //   "poliammide",
  //   "alcantara",
  //   "lurex",
  "gomma",
  //   "tencel",
  //   "modal",
  //   "polipropilene",
  //   "poliuretano",
  //   "lycra",
  "nylon",
  "gore-Tex",
  "microfibra",
  "pile",
  "stoffa",
  "chino",
  "jeans",
];

export const genders = ["m", "f"];

export const lengths = ["corto", "lungo", "normale"];

export const makings = ["basic", "stampato", "ricamato"];

export const fits = ["skinny", "slim", "regular", "oversize", "baggy"];

export const traits = ["vegan", "vintage", "handmade", "eco-friendly"];

export const shirtCollars = [
  "italiano",
  "francese",
  "button down",
  "coreana",
  "cerimonia",
];

export const sweaterCollars = ["girocollo", "dolcevita"];

interface macroCategory {
  macroCategory: string;
  occasions?: string[];
  materials?: string[];
  genders: string[];
  lengths?: string[];
  making?: string[];
  fits: string[];
  collars?: string[];
  microCategories: string[];
  sizes: string[];
}

const vestitiMicroCategories = [
  "caftani",
  "camicia",
  "maglina",
  "tubini",
  "lunghi",
];
const tshirtMicroCategories = [
  "maniche lunghe",
  "maniche corte",
  "mezze maniche",
  "senza maniche",
  "jeans",
];

const topMicroCategories = [
  "maniche lunghe",
  "maniche corte",
  "mezze maniche",
  "senza maniche",
];

const camicieMicroCategories = [
  "casual",
  "hawaiana",
  "jeans",
  "lino",
  "eleganti",
];

const bluseMicroCategories = ["basic", "senza maniche", "trapezio"];

const pantaloniMicroCategories = [
  "basic",
  "leggins",
  "cargo",
  "salopette",
  "tuta",
  "palazzo",
  "zampa d'elefante",
  "chino",
];

const jeansMicroCategories = [
  "basic",
  "palazzo",
  "zampa d'elefante",
  "affusolati",
];

const felpeMicroCategories = ["cappuccio", "zip", "senza cappuccio"];

const giaccheMicroCategories = [
  "leggere",
  "impermeabili",
  "smanicate",
  "vento",
  "sportive",
  "invernali",
  "piumini",
  "bomber",
  "jeans",
  "gilet",
];

const blazerMicroCategories = [
  "leggeri",
  "impermeabili",
  "smanicati",
  "vento",
  "sportivi",
  "invernali",
  "jeans",
];

const cappottiMicroCategories = [
  "basic",
  "parka",
  "trench",
  "invernali",
  "piumini",
];

const maglieriaMicroCategories = [
  "liscio",
  "trecce",
  "coste",
  "pullover",
  "cardigan",
  "maglioni",
];

const costumiMicroCategories = ["interi", "bikini", "bermuda", "boxer", "slip"];

const gonneMicroCategories = [
  "pieghe",
  "trapezio",
  "tubino",
  "portafoglio",
  "jeans",
];

const shortsMicroCategories = ["basic", "sportivi"];

const scarpeMicroCategories = [
  "sneakers",
  "sandali",
  "piatte",
  "ciabatte",
  "tacco",
  "ballerine",
  "stivaletti",
  "stivali",
  "sportive",
  "sposa",
  "pantofole",
  "trekking",
  "mocassini",
  "polacchine",
  "basse",
  "décolletè",
  "zoccoli",
  "aperte",
  "mocassini",
  "stringate",
  "slip-on",
  "eleganti",
];

const poloMicroCategories = [
  "maniche lunghe",
  "maniche corte",
  "mezze maniche",
  "senza maniche",
];

const bermudaMicroCategories = ["cargo", "jeans", "tuta", "basic"];

const macroCategoriesRaw = [
  "vestiti",
  "t-shirt",
  "top",
  "camicie",
  "bluse",
  "pantaloni",
  "jeans",
  "felpe",
  "giacche",
  "blazer",
  "cappotti",
  "maglioni",
  "costumi",
  "gonne",
  "shorts",
  "scarpe",
  "polo",
  "bermuda",
];

export const allFiltersRaw = [
  //microCategories
  ...vestitiMicroCategories,
  ...tshirtMicroCategories,
  ...topMicroCategories,
  ...camicieMicroCategories,
  ...bluseMicroCategories,
  ...pantaloniMicroCategories,
  ...jeansMicroCategories,
  ...felpeMicroCategories,
  ...giaccheMicroCategories,
  ...blazerMicroCategories,
  ...cappottiMicroCategories,
  ...maglieriaMicroCategories,
  ...costumiMicroCategories,
  ...gonneMicroCategories,
  ...shortsMicroCategories,
  ...scarpeMicroCategories,
  ...poloMicroCategories,
  ...bermudaMicroCategories,
  //occasions
  ...occasions,
  //materials
  ...materials,
  //genders
  ...genders,
  //lenghts
  ...lengths,
  //making
  ...makings,
  //fits
  ...fits,
  //traits
  ...traits,
  //collars
  ...shirtCollars,
  ...sweaterCollars,
  //colors
  ...colors,
  //brands
  ...brands,
  //macroCategories
  ...macroCategoriesRaw,
];

const allMicroCategoriesRaw = [
  ...vestitiMicroCategories,
  ...tshirtMicroCategories,
  ...topMicroCategories,
  ...camicieMicroCategories,
  ...bluseMicroCategories,
  ...pantaloniMicroCategories,
  ...jeansMicroCategories,
  ...felpeMicroCategories,
  ...giaccheMicroCategories,
  ...blazerMicroCategories,
  ...cappottiMicroCategories,
  ...maglieriaMicroCategories,
  ...costumiMicroCategories,
  ...gonneMicroCategories,
  ...shortsMicroCategories,
  ...scarpeMicroCategories,
  ...poloMicroCategories,
  ...bermudaMicroCategories,
];

export const allFilters = [
  //microCategories
  { microCategory: allMicroCategoriesRaw },
  //occasions
  { occasion: occasions },
  //materials
  { material: materials },
  //genders
  { gender: genders },
  //lenghts
  { length: lengths },
  //making
  { making: makings },
  //fits
  { fit: fits },
  //traits
  { traits },
  //collars
  { collar: [...shirtCollars, ...sweaterCollars] },
  //colors
  { colors },
  //brands
  { brand: brands },
  //macroCategories
  { macroCategory: macroCategoriesRaw },
];

export const macroCategories: macroCategory[] = [
  {
    macroCategory: "vestiti",
    occasions: occasions,
    materials: materials,
    genders: genders,
    lengths: lengths,
    making: makings,
    fits: fits,
    microCategories: vestitiMicroCategories,
    sizes: clothesSizes,
  },
  {
    macroCategory: "t-shirt",
    occasions: occasions,
    materials: materials,
    genders: genders,
    lengths: lengths,
    making: makings,
    fits: fits,
    microCategories: tshirtMicroCategories,
    sizes: clothesSizes,
  },
  {
    macroCategory: "top",
    occasions: occasions,
    materials: materials,
    genders: genders,
    lengths: lengths,
    making: makings,
    fits: fits,
    microCategories: topMicroCategories,
    sizes: clothesSizes,
  },
  {
    macroCategory: "camicie",
    occasions: occasions, //TODO FATTO
    materials: materials, //TODO FATTO
    genders: genders,
    lengths: lengths, //TODO FATTO
    making: makings, //TODO FATTO
    collars: shirtCollars, //TODO
    fits: fits,
    microCategories: camicieMicroCategories,
    sizes: clothesSizes,
  },
  {
    macroCategory: "bluse",
    occasions: occasions,
    materials: materials,
    genders: genders,
    lengths: lengths,
    making: makings,
    fits: fits,
    microCategories: bluseMicroCategories,
    sizes: clothesSizes,
  },
  {
    macroCategory: "pantaloni",
    occasions: occasions,
    materials: materials,
    genders: genders,
    making: makings,
    //non ha lenghts perche la lunghezza sarebbe la taglia
    fits: fits,
    microCategories: pantaloniMicroCategories,
    sizes: clothesSizes,
  },
  {
    macroCategory: "jeans",
    occasions: occasions,
    materials: materials,
    genders: genders,
    making: makings,
    //non ha lenghts perche la lunghezza sarebbe la taglia
    fits: fits,
    microCategories: jeansMicroCategories,
    sizes: clothesSizes,
  },
  {
    macroCategory: "felpe",
    occasions: occasions,
    materials: materials,
    genders: genders,
    lengths: lengths,
    making: makings,
    fits: fits,
    microCategories: felpeMicroCategories,
    sizes: clothesSizes,
  },
  {
    macroCategory: "giacche",
    occasions: occasions,
    materials: materials,
    genders: genders,
    lengths: lengths,
    making: makings,
    fits: fits,
    microCategories: giaccheMicroCategories,
    sizes: clothesSizes,
  },
  {
    macroCategory: "blazer",
    occasions: occasions,
    materials: materials,
    genders: genders,
    lengths: lengths,
    making: makings,
    fits: fits,
    microCategories: blazerMicroCategories,
    sizes: clothesSizes,
  },
  {
    macroCategory: "cappotti",
    occasions: occasions,
    materials: materials,
    genders: genders,
    lengths: lengths,
    making: makings,
    fits: fits,
    microCategories: cappottiMicroCategories,
    sizes: clothesSizes,
  },
  {
    macroCategory: "maglieria",
    occasions: occasions,
    materials: materials,
    genders: genders,
    lengths: lengths,
    making: makings,
    fits: fits,
    collars: sweaterCollars,
    microCategories: maglieriaMicroCategories,
    sizes: clothesSizes,
  },
  {
    macroCategory: "costumi",
    materials: materials,
    genders: genders,
    lengths: lengths,
    making: makings,
    fits: fits,
    microCategories: costumiMicroCategories,
    sizes: clothesSizes,
  },
  {
    macroCategory: "gonne",
    occasions: occasions,
    materials: materials,
    genders: genders,
    lengths: lengths,
    making: makings,
    fits: fits,
    microCategories: gonneMicroCategories,
    sizes: clothesSizes,
  },
  {
    macroCategory: "shorts",
    occasions: occasions,
    materials: materials,
    genders: genders,
    lengths: lengths,
    making: makings,
    fits: fits,
    microCategories: shortsMicroCategories,
    sizes: clothesSizes,
  },
  {
    macroCategory: "scarpe",
    occasions: occasions,
    materials: materials,
    genders: genders,
    fits: fits,
    microCategories: scarpeMicroCategories,
    sizes: shoesSizes,
  },
  {
    macroCategory: "polo",
    occasions: occasions,
    materials: materials,
    genders: genders,
    lengths: lengths,
    making: makings,
    fits: fits,
    microCategories: poloMicroCategories,
    sizes: clothesSizes,
  },
  {
    macroCategory: "bermuda",
    occasions: occasions,
    materials: materials,
    genders: genders,
    lengths: lengths,
    making: makings,
    fits: fits,
    microCategories: bermudaMicroCategories,
    sizes: clothesSizes,
  },
];
