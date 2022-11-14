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
          product.macroCategory === constants.genders.uomo.abbigliamento[i].name
        ) {
          macroCategoryIndex = i;
        }
      }

      macroCategory = constants.genders.uomo.abbigliamento[macroCategoryIndex];
      if (macroCategoryIndex === null || macroCategoryIndex === undefined) {
        throw new Error(
          `la category ${product.macroCategory} non e' una category accetata`
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
          `la category ${product.macroCategory} non e' una category accetata`
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
        `micro-category ${product.microCategory} non e' accetata per macro-category ${macroCategory.name}, micro-categories accetate per ${macroCategory.name}: ${macroCategory.types}`
      );
    }
  } else {
    //   const shop = obj;
    //   //---CHECK GENDER
    //   if (
    //     shop.gender[0] !== "M" &&
    //     shop.gender[0] !== "F" &&
    //     shop.gender[1] !== "M" &&
    //     shop.gender[1] !== "F"
    //   ) {
    //     throw new Error(`gender deve essere 'M' o 'F'`);
    //   }
    //   for (let l = 0; l < shop.gender.length; l++) {
    //     if (shop.gender[l] === "M") {
    //       //cycles trough the shop macrocategories
    //       for (
    //         let macroCategoryIndex = 0;
    //         macroCategoryIndex < shop.macroCategories.length;
    //         macroCategoryIndex++
    //       ) {
    //         let macroCategory = shop.macroCategories[macroCategoryIndex];
    //         let ok = false;
    //         for (
    //           let i = 0;
    //           i < constants.genders.uomo.abbigliamento.length;
    //           i++
    //         ) {
    //           console.log(constants.genders.uomo.abbigliamento[i].name);
    //           if (
    //             macroCategory === constants.genders.uomo.abbigliamento[i].name
    //           ) {
    //             ok = true;
    //           }
    //         }
    //         if (!ok) {
    //           throw new Error(
    //             `la category ${macroCategory} non e' una category accetata`
    //           );
    //         }
    //       }
    //     }
    //     if (shop.gender[l] === "F") {
    //       //cycles trough the shop macrocategories
    //       for (
    //         let macroCategoryIndex = 0;
    //         macroCategoryIndex < shop.macroCategories.length;
    //         macroCategoryIndex++
    //       ) {
    //         let macroCategory = shop.macroCategories[macroCategoryIndex];
    //         let ok = false;
    //         for (
    //           let i = 0;
    //           i < constants.genders.donna.abbigliamento.length;
    //           i++
    //         ) {
    //           console.log(constants.genders.donna.abbigliamento[i].name);
    //           if (
    //             macroCategory === constants.genders.donna.abbigliamento[i].name
    //           ) {
    //             ok = true;
    //           }
    //         }
    //         if (!ok) {
    //           throw new Error(
    //             `la category ${macroCategory} non e' una category accetata`
    //           );
    //         }
    //       }
    //     }
    //   }
  }
};

export default checkConstants;
