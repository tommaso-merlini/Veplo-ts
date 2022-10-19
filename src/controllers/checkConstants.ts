import { constants } from "../../constants/constants";

const checkConstants = (obj, is: String) => {
  if (is !== "product" && is !== "shop") {
    throw new Error("is can only be 'shop' or 'product");
  }

  if (is === "product") {
    const product = obj;

    let macroCategoryIndex;
    let macroCategory;

    //---CHECK GENDER
    if (product.gender !== "M" && product.gender !== "F") {
      throw new Error(`gender deve essere 'M' o 'F'`);
    }

    //---CHECK MACRO-iCATEGORY
    if (product.gender === "M") {
      for (let i = 0; i < constants.genders.uomo.abbigliamento.length; i++) {
        if (
          product.macroCoategory ===
          constants.genders.uomo.abbigliamento[i].name
        ) {
          macroCategoryIndex = i;
        }
      }

      macroCategory = constants.genders.donna.abbigliamento[macroCategoryIndex];
      if (macroCategoryIndex === null || macroCategoryIndex === undefined) {
        throw new Error(
          `la category ${
            product.macroCategory
          } non e' una category accetata, lista di categories accettate: ${constants.genders.uomo.abbigliamento.map(
            (obj) => {
              return obj.name;
            }
          )}`
        );
      }
    } else {
      for (let i = 0; i < constants.genders.donna.abbigliamento.length; i++) {
        if (
          product.macroCategory ===
          constants.genders.donna.abbigliamento[i].name
        ) {
          macroCategoryIndex = i;
        }
      }

      macroCategory = constants.genders.donna.abbigliamento[macroCategoryIndex];
      if (macroCategoryIndex === null || macroCategoryIndex === undefined) {
        throw new Error(
          `la category ${
            product.macroCategory
          } non e' una category accetata, lista di categories accettate: ${constants.genders.donna.abbigliamento.map(
            (obj) => {
              return obj.name;
            }
          )}`
        );
      }
    }

    //---CHECK COLORS
    const areColorsOk = product.colors.every((color) =>
      constants.colors.includes(color)
    );

    if (!areColorsOk)
      throw new Error(
        `i colori che hai scelto non vanno bene, ecco la lista dei colori accettati: ${constants.colors}`
      );

    //---CHECK BRAND
    const isBrandOk = constants.brands.includes(product.brand);
    if (!isBrandOk)
      throw new Error(
        `il brand che hai scelto non e' supportato, lista dei brand supportati: ${constants.brands}`
      );

    //---CHECK SIZES
    const areSizesOk = product.sizes.every((size) =>
      macroCategory.sizes.includes(size)
    );

    if (!areSizesOk) {
      throw new Error(
        `sizes ${product.sizes} non sono accetate per category ${macroCategory.name}, taglie accettati per ${macroCategory.name}: ${macroCategory.sizes}`
      );
    }

    //---CHECK MICRO-CATEGORY
    const isMicroCategoryOk = macroCategory.types.includes(
      product.microCategory
    );

    if (!isMicroCategoryOk) {
      throw new Error(
        `micro-category ${product.microCategory} non sono accetate per category ${macroCategory.name}, types accetati per ${macroCategory.name}: ${macroCategory.types}`
      );
    }
  }
};

export default checkConstants;
