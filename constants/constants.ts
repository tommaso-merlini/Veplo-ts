import { brands } from "../brands.js";

const woman_clothes_sizes = [
  "xxs (36)",
  "xs (38)",
  "s (40)",
  "m (42)",
  "l (44)",
  "xl (46)",
  "xxl (48)",
  "3xl (50/52/54)",
];

const man_top_clothes_sizes = [
  "xs (44)",
  "s (46)",
  "m (48)",
  "l (50)",
  "xl (52)",
  "xxl (54)",
  "3xl (56/58)",
];

const man_bottom_clothes_sizes = [
  "xxs (40)",
  "xs (42)",
  "s (44)",
  "m (46/48)",
  "l (50)",
  "xl (52)",
  "xxl (54)",
  "3xl (56/58)",
];

export const constants = {
  brands: brands,

  colors: [
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
    "multicolor",
  ],
  genders: {
    donna: {
      abbigliamento: [
        { name: "Tutto l'abbigliamento" },
        {
          name: "Vestiti",
          url: "vestiti",
          types: [
            "casual",
            "eleganti",
            "per occasioni speciali",
            "caftani e camicia",
            "maglina",
            "tubini",
            "lunghi",
            "di jeans",
            "di maglia",
            "dirndl",
          ],
          sizes: woman_clothes_sizes,
        },
        {
          name: "Camicie & Bluse",
          url: "camicie-e-bluse",
          types: ["camicie", "camiciette", "bluse"],
          sizes: woman_clothes_sizes,
        },
        {
          name: "T-Shirt & Top",
          url: "t-shirt-e-top",
          types: ["top", "t-shirt", "polo", "a maniche lunghe"],
          sizes: woman_clothes_sizes,
        },
        {
          name: "Pullover & Cardigan",
          url: "pullover-e-cardigan",
          types: ["pullover", "cardigan"],
          sizes: woman_clothes_sizes,
        },
        {
          name: "Giacche & Blazer",
          url: "giacche-e-blazer",
          types: [
            "leggere",
            "impermeabili",
            "di pelle",
            "di jeans",
            "blazer",
            "mantelle",
            "smanicati",
            "giacche a vento",
            "sportive",
            "invernali",
            "piumini corti",
            "bomber",
          ],
          sizes: woman_clothes_sizes,
        },
        {
          name: "Cappotti",
          url: "cappotti",
          types: [
            "parka",
            "trench",
            "corti",
            "classici",
            "invernali",
            "piumini lunghi",
          ],
          sizes: woman_clothes_sizes,
        },
        {
          name: "Felpe",
          url: "felpe",
          types: ["felpe", "con il cappuccio", "con la zip", "pile"],
          sizes: woman_clothes_sizes,
        },
        {
          name: "Jeans",
          url: "jeans",
          types: [
            "skinny",
            "slim",
            "a palazzo",
            "larghi",
            "a zampa d'elefante",
          ],
          sizes: woman_clothes_sizes,
        },
        {
          name: "Shorts",
          url: "shorts",
          types: ["jeans", "sportivi"],
          sizes: woman_clothes_sizes,
        },
        {
          name: "Pantaloni",
          url: "pantaloni",
          types: [
            "chino",
            "di stoffa",
            "leggins",
            "di pelle",
            "cargo",
            "salopette",
            "tuta",
          ],
          sizes: woman_clothes_sizes,
        },
        {
          name: "Gonne",
          url: "gonne",
          types: [
            "jeans",
            "lunghe",
            "a pieghe",
            "a trapezio",
            "minigonne",
            "a tubino",
            " di pelle",
            "a portafoglio",
          ],
          sizes: woman_clothes_sizes,
        },
      ],
      //accessori: ["accessori"],
      //costumi: ["costumi"],
    },
    uomo: {
      abbigliamento: [
        { name: "Tutto l'abbigliamento" },
        {
          name: "T-shirt & Polo",
          url: "t-shirt-e-polo",
          types: ["basic", "stampate", "canotte", "polo", "a maniche lunghe"],
          sizes: man_top_clothes_sizes,
        },
        {
          name: "Camicie",
          url: "camicie",
          types: ["casual", "eleganti"],
          sizes: man_top_clothes_sizes,
        },
        {
          name: "Felpe & Maglieria",
          url: "felpe-e-maglieria",
          types: ["con il cappuccio", "felpe", "con la zip", "di pile"],
          sizes: man_top_clothes_sizes,
        },
        {
          name: "Giacche",
          url: "giacche",
          types: [
            "leggere",
            "di pelle",
            "di jeans",
            "invernali",
            "piumini",
            "giacche a vento",
            "di pile",
            "gilet",
          ],
          sizes: man_top_clothes_sizes,
        },
        {
          name: "Cappotti",
          url: "cappotti",
          types: [
            "trench",
            "parka",
            "corti",
            "invernali",
            "classici",
            "piumini",
          ],
          sizes: man_top_clothes_sizes,
        },
        {
          name: "Jeans",
          url: "jeans",
          types: [
            "skinny",
            "slim",
            "a palazzo",
            "affusolati",
            "larghi",
            "a zampa d'elefente",
          ],
          sizes: man_bottom_clothes_sizes,
        },
        {
          name: "Pantaloni",
          url: "pantaloni",
          types: ["chino", "classici", "tuta", "cargo", "salopette"],
          sizes: man_bottom_clothes_sizes,
        },
        {
          name: "Bermuda",
          url: "bermuda",
          types: ["casual", "sportivi", "cargo"],
          sizes: man_bottom_clothes_sizes,
        },
      ],
      //costumi: ["costumi"],
      //accessori: ["accessori"],
    },
  },
};
