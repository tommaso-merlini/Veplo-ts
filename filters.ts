// // @ts-nocheck

// /***
// size:
//     - m, s, l ->
//     - 30-31 (pantaloni) -> bottom
//     - 30-50 (scarpe) -> shoes
// ***/

// import { brands } from "./brands";

// /*SITO:
//   https://www.blitzresults.com/it/abbigliamento-donna/
//   https://www.zalando-prive.it/sizehelper/women/measure/#/
// */

// const woman_clothes_sizes = [
//   "xxs (36)",
//   "xs (38)",
//   "s (40)",
//   "m (42)",
//   "l (44)",
//   "xl (46)",
//   "xxl (48)",
//   "3xl (50/52/54)",
// ];

// const man_top_clothes_sizes = [
//   "xs (44)",
//   "s (46)",
//   "m (48)",
//   "l (50)",
//   "xl (52)",
//   "xxl (54)",
//   "3xl (56/58)",
// ];

// const man_bottom_clothes_sizes = [
//   "xxs (40)",
//   "xs (42)",
//   "s (44)",
//   "m (46/48)",
//   "l (50)",
//   "xl (52)",
//   "xxl (54)",
//   "3xl (56/58)",
// ];

// const tags = {
//   donna: {
//     abbigliamento: [
//       { name: "Tutto l'abbigliamento" },
//       {
//         name: "Vestiti",
//         url: "vestiti",
//         types: [
//           "casual",
//           "eleganti",
//           "per occasioni speciali",
//           "caftani e camicia",
//           "maglina",
//           "tubini",
//           "lunghi",
//           "di jeans",
//           "di maglia",
//           "dirndl",
//         ],
//         sizes: woman_clothes_sizes,
//       },
//       {
//         name: "Camicie",
//         url: "camicie",
//         types: ["corte", "lunghe"],
//         sizes: woman_clothes_sizes,
//       },
//       {
//         name: "Bluse",
//         url: "bluse",
//         types: ["corto", "lungo"],
//         sizes: woman_clothes_sizes,
//       },
//       {
//         name: "T-Shirt",
//         url: "t-shirt",
//         types: ["basic", "stampate", "a maniche lunghe"],
//         sizes: woman_clothes_sizes,
//       },
//       {
//         name: "Top",
//         url: "top",
//         types: ["a maniche lunghe", "a maniche corte"],
//         sizes: woman_clothes_sizes,
//       },
//       {
//         name: "Pullover",
//         url: "pullover",
//         types: ["corto", "lungo"],
//         sizes: woman_clothes_sizes,
//       },
//       {
//         name: "Cardigan",
//         url: "cardigan",
//         types: ["corto", "lungo"],
//         sizes: woman_clothes_sizes,
//       },
//       {
//         name: "Giacche",
//         url: "giacche",
//         types: [
//           "leggere",
//           "impermeabili",
//           "di pelle",
//           "di jeans",
//           "smanicate",
//           "a vento",
//           "sportive",
//           "invernali",
//           "piumini corti",
//           "bomber",
//         ],
//         sizes: woman_clothes_sizes,
//       },
//       {
//         name: "Mantelle",
//         url: "mantelle",
//         types: ["corte", "lunghe"],
//         sizes: woman_clothes_sizes,
//       },
//       {
//         name: "Blazer",
//         url: "blazer",
//         types: [
//           "leggeri",
//           "impermeabili",
//           "di pelle",
//           "di jeans",
//           "smanicati",
//           "a vento",
//           "sportivi",
//           "invernali",
//         ],
//         sizes: woman_clothes_sizes,
//       },
//       {
//         name: "Cappotti",
//         url: "cappotti",
//         types: [
//           "parka",
//           "trench",
//           "corti",
//           "classici",
//           "invernali",
//           "piumini lunghi",
//         ],
//         sizes: woman_clothes_sizes,
//       },
//       {
//         name: "Felpe",
//         url: "felpe",
//         types: ["felpe", "con il cappuccio", "con la zip", "pile"],
//         sizes: woman_clothes_sizes,
//       },
//       {
//         name: "Jeans",
//         url: "jeans",
//         types: ["skinny", "slim", "a palazzo", "larghi", "a zampa d'elefante"],
//         sizes: woman_clothes_sizes,
//       },
//       {
//         name: "Shorts",
//         url: "shorts",
//         types: ["jeans", "sportivi"],
//         sizes: woman_clothes_sizes,
//       },
//       {
//         name: "Pantaloni",
//         url: "pantaloni",
//         types: [
//           "chino",
//           "di stoffa",
//           "leggins",
//           "di pelle",
//           "cargo",
//           "salopette",
//           "tuta",
//         ],
//         sizes: woman_clothes_sizes,
//       },
//       {
//         name: "Gonne",
//         url: "gonne",
//         types: [
//           "jeans",
//           "lunghe",
//           "a pieghe",
//           "a trapezio",
//           "minigonne",
//           "a tubino",
//           " di pelle",
//           "a portafoglio",
//         ],
//         sizes: woman_clothes_sizes,
//       },
//     ],
//     //accessori: ["accessori"],
//     //costumi: ["costumi"],
//   },
//   uomo: {
//     abbigliamento: [
//       "Tutto l'abbigliamento",
//       //"Completi",
//       {
//         name: "T-shirt",
//         url: "t-shirt",
//         types: ["basic", "stampate", "canotte", "a maniche lunghe"],
//         sizes: man_top_clothes_sizes,
//       },
//       {
//         name: "Polo",
//         url: "polo",
//         types: ["basic", "stampate", "a maniche lunghe"],
//         sizes: man_top_clothes_sizes,
//       },
//       {
//         name: "Camicie",
//         url: "camicie",
//         types: ["casual", "eleganti"],
//         sizes: man_top_clothes_sizes,
//       },
//       {
//         name: "Felpe",
//         url: "felpe",
//         types: ["con il cappuccio", "con la zip", "di pile"],
//         sizes: man_top_clothes_sizes,
//       },
//       {
//         name: "Giacche",
//         url: "giacche",
//         types: [
//           "leggere",
//           "di pelle",
//           "di jeans",
//           "invernali",
//           "piumini",
//           "giacche a vento",
//           "di pile",
//           "gilet",
//         ],
//         sizes: man_top_clothes_sizes,
//       },
//       {
//         name: "Cappotti",
//         url: "cappotti",
//         types: ["trench", "parka", "corti", "invernali", "classici", "piumini"],
//         sizes: man_top_clothes_sizes,
//       },
//       {
//         name: "Jeans",
//         url: "jeans",
//         types: ["a palazzo", "affusolati", "a zampa d'elefente"],
//         sizes: man_bottom_clothes_sizes,
//       },
//       {
//         name: "Pantaloni",
//         url: "pantaloni",
//         types: ["chino", "classici", "tuta", "cargo", "salopette"],
//         sizes: man_bottom_clothes_sizes,
//       },
//       {
//         name: "Bermuda",
//         url: "bermuda",
//         types: ["casual", "sportivi", "cargo"],
//         sizes: man_bottom_clothes_sizes,
//       },
//     ],
//     //costumi: ["costumi"],
//     //accessori: ["accessori"],
//   },
// };

// const brand = brands;

// const prezzo = "variabile";
