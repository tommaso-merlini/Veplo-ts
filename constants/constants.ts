import { brands } from "../brands.js";

export const clothes_sizes = [
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

export const shoes_sizes = [
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

export const constants = {
  brands: brands,
  fits: ["skinny", "slim", "regular", "oversize", "baggy"],
  traits: ["vegan", "vintage", "handmade", "eco-friendly"],
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
    "Multicolore",
  ],
  genders: {
    donna: {
      abbigliamento: [
        // { name: "Tutto l'abbigliamento" },
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
          ],
          sizes: clothes_sizes,
        },
        {
          name: "T-Shirt e Top",
          url: "t-shirt-e-top",
          types: ["top", "t-shirt", "polo", "a maniche lunghe"],
          sizes: clothes_sizes,
        },
        {
          name: "Camicie e Bluse", //Camicie & Bluse
          url: "camicie-e-bluse",
          types: ["camicie", "camiciette", "bluse"],
          sizes: clothes_sizes,
        },
        {
          name: "Pantaloni",
          url: "pantaloni",
          types: [
            "chino",
            "di stoffa",
            "leggins",
            "pantaloni di pelle",
            "pantaloni cargo",
            "salopette",
            "tuta",
          ],
          sizes: clothes_sizes,
        },
        {
          name: "Jeans",
          url: "jeans",
          types: [
            "skinny",
            "slim",
            "a palazzo",
            "shorts",
            "larghi",
            "diritti",
            "jeans a zampa d'elefante",
          ],
          sizes: clothes_sizes,
        },
        {
          name: "Felpe",
          url: "felpe",
          types: ["felpe", "con il cappuccio", "con la zip", "pile"],
          sizes: clothes_sizes,
        },
        {
          name: "Giacche & Blazer",
          url: "giacche-e-blazer",
          types: [
            "giacche leggere",
            "giacche impermeabili",
            "di pelle",
            "di jeans",
            "blazer",
            "mantelle",
            "smanicati",
            "giacche a vento",
            "sportive",
            "invernali",
            "piumini corti",
            "giacche bomber",
          ],
          sizes: clothes_sizes,
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
          sizes: clothes_sizes,
        },
        {
          name: "Maglieria",
          url: "pullover-e-cardigan",
          types: ["pullover", "cardigan"],
          sizes: clothes_sizes,
        },
        //!aggiunto costumi: ["costumi"],
        {
          name: "Costumi",
          url: "costumi",
          types: ["costumi interi", "bikini"],
          sizes: clothes_sizes,
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
            "di pelle",
            "a portafoglio",
          ],
          sizes: clothes_sizes,
        },
        {
          name: "Shorts",
          url: "shorts",
          types: ["jeans", "sportivi"],
          sizes: clothes_sizes,
        },
        // {
        //   name: "Abbigliamento sportivo",
        //   url: "abbigliamento-sportivo",
        //   types: [
        //     "t-shirt & polo",
        //     "pantaloni",
        //     "reggiseni",
        //     "giacche & coprispalla",
        //     "felpe",
        //     "tute sportive",
        //     "moda mare",
        //     "vestiti & gonne",
        //     "calzini",
        //     "intimo e strati base",
        //     "merchandising ufficiale",
        //   ],
        //   sizes: clothes_sizes,
        // },
        {
          //!aggiunte scarpe donna
          name: "Scarpe",
          url: "scarpe",
          types: [
            "sneakers",
            "sandali",
            "scarpe piatte",
            "ciabatte e zoccoli",
            "scarpe con tacco",
            "tacchi alti",
            "ballerine",
            "stivaletti",
            "stivali",
            "scarpe sportive",
            "per il mare",
            "da sposa",
            "pantofole",
            "scarpe da trekking",
            "cura delle scarpe",
          ],
          sizes: shoes_sizes,
        },
      ],
    },
    uomo: {
      abbigliamento: [
        {
          name: "T-shirt e Polo",
          url: "t-shirt-e-polo",
          types: ["basic", "stampate", "canotte", "polo", "a maniche lunghe"],
          sizes: clothes_sizes,
        },
        {
          name: "Camicie",
          url: "camicie",
          types: ["casual", "eleganti"],
          sizes: clothes_sizes,
        },
        {
          name: "Felpe",
          url: "felpe",
          types: ["con il cappuccio", "felpe", "con la zip", "di pile"],
          sizes: clothes_sizes,
        },
        {
          name: "Maglieria",
          url: "maglieria",
          types: ["cardigan", "pullover"],
          sizes: clothes_sizes,
        },
        {
          name: "Jeans",
          url: "jeans",
          types: [
            "skinny",
            "slim fit",
            "a palazzo",
            "a gamba dritta",
            "jeans affusolati",
            "taglio largo",
            "a zampa d'elefente",
            "jeans shorts",
          ],
          sizes: clothes_sizes,
        },
        {
          name: "Pantaloni",
          url: "pantaloni",
          types: ["chino", "classici", "pantaloni tuta", "cargo", "salopette"],
          sizes: "man_clothes_sizes",
        },
        {
          name: "Bermuda",
          url: "bermuda",
          types: ["short casual", "jeans corti", "pantaloncini sportivi"],
          sizes: clothes_sizes,
        },
        // {
        //   name: "Abbigliamento sportivo",
        //   url: "abbigliamento-sportivo",
        //   types: [
        //     "magliette",
        //     "pantaloni sportivi",
        //     "giacche & Gilet",
        //     "completi da allenamento",
        //     "felpe",
        //     "merchandising ufficiale",
        //     "calze & calzini",
        //     "moda mare & surf",
        //     "intimo e strati base",
        //   ],
        //   sizes: clothes_sizes,
        // },
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
          sizes: clothes_sizes,
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
          sizes: clothes_sizes,
        },
        {
          name: "Scarpe",
          url: "scarpe",
          types: [
            "sneaker",
            "scarpe sportive",
            "scarpe aperte",
            "scarpe con i lacci",
            "scarpe basse",
            "scarpe eleganti",
            "scarpe per outdoor",
            "stivaletti/stivali",
            "pantofole",
            // "Accessori per le scarpe",
          ],
          sizes: shoes_sizes,
        },
        //!aggiunto costumi: ["costumi"],
        {
          name: "Costumi",
          url: "costumi",
          types: ["Bermuda & Pantaloncini", "Boxer mare", "Slip"],
          sizes: clothes_sizes,
        },
      ],
    },
  },
};
