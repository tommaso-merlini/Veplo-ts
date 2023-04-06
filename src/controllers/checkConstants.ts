import {
  EditLotsInput,
  ProductVariationInput,
} from "src/graphQL/types/types.js";
import {
  clothes_sizes,
  constants,
  shoes_sizes,
} from "../../constants/constants.js";

const checkConstants = (obj: any, is: String) => {
  if (is !== "product" && is !== "shop") {
    throw new Error("is can only be 'shop' or 'product");
  }

  if (is === "product") {
    const product = obj;

    let macroCategoryIndex: number = 0;
    let macroCategory;

    //---CHECK GENDER
    if (product.info.gender !== "m" && product.info.gender !== "f") {
      throw new Error(`gender deve essere 'm' o 'f'`);
    }

    //---CHECK MACRO-iCATEGORY
    if (product.info.gender === "m") {
      for (let i = 0; i < constants.genders.uomo.abbigliamento.length; i++) {
        if (
          product.info.macroCategory ===
          constants.genders.uomo.abbigliamento[i]?.name
        ) {
          macroCategoryIndex = i;
        }
      }

      macroCategory = constants.genders.uomo.abbigliamento[macroCategoryIndex];
      if (macroCategoryIndex === null || macroCategoryIndex === undefined) {
        throw new Error(
          `la category ${product.info.macroCategory} non e' una category accetata`
        );
      }
    }

    if (product.info.gender === "f") {
      for (let i = 0; i < constants.genders.donna.abbigliamento.length; i++) {
        if (
          product.info.macroCategory ===
          constants.genders.donna.abbigliamento[i]?.name
        ) {
          macroCategoryIndex = i;
        }
      }

      macroCategory = constants.genders.donna.abbigliamento[macroCategoryIndex];
      if (macroCategoryIndex === null || macroCategoryIndex === undefined) {
        throw new Error(
          `la category ${product.info.macroCategory} non e' una category accetata`
        );
      }
    }

    //---CHECK COLORS
    const areColorsOk = product.variations.every(
      (variation: ProductVariationInput) =>
        constants.colors.includes(variation.color)
    );

    if (!areColorsOk)
      throw new Error(
        `i colori che hai scelto non vanno bene, ecco la lista dei colori accettati: ${constants.colors}`
      );

    //---CHECK SIZES
    product.variations.forEach((variation: ProductVariationInput) => {
      variation.lots.forEach((lot: EditLotsInput) => {
        if (
          !clothes_sizes.includes(lot.size) &&
          !shoes_sizes.includes(lot.size)
        ) {
          throw new Error(
            `la taglia ${lot.size}, del prodotto di colore ${variation.color}, non e' una taglia accettata`
          );
        }
      });
    });

    //---CHECK BRAND
    const isBrandOk = constants.brands.includes(product.info.brand);
    if (!isBrandOk)
      throw new Error(
        `il brand che hai scelto non e' supportato, lista dei brand supportati: ${constants.brands}`
      );

    //---CHECK MICRO-CATEGORY
    const isMicroCategoryOk = macroCategory?.types.includes(
      product.info.microCategory
    );

    if (!isMicroCategoryOk) {
      throw new Error(
        `micro-category ${product.microCategory} non e' accetata per macro-category ${macroCategory?.name}, micro-categories accetate per ${macroCategory?.name}: ${macroCategory?.types}`
      );
    }

    //---CHECK Fit
    const isFitOk = constants.fits.includes(product.info.fit);
    if (!isFitOk) throw new Error(`il fit che hai scelto non e' supportato`);
  } else {
    //   const shop = obj;
    //   //---CHECK GENDER
    //   if (
    //     shop.gender[0] !== "m" &&
    //     shop.gender[0] !== "f" &&
    //     shop.gender[1] !== "m" &&
    //     shop.gender[1] !== "f"
    //   ) {
    //     throw new Error(`gender deve essere 'm' o 'f'`);
    //   }
    //   for (let l = 0; l < shop.gender.length; l++) {
    //     if (shop.gender[l] === "mM") {
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
