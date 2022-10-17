import { constants } from "../../constants/constants";

const checkConstants = (obj, is: String) => {
  if (is !== "product" && is !== "shop") {
    throw new Error("is can only be 'shop' or 'product");
  }

  if (is === "product") {
    const product = obj;

    let categoryIndex;
    let category;

    //---CHECK GENDER
    if (product.gender !== "M" && product.gender !== "F") {
      throw new Error(`gender deve essere 'M' o 'F'`);
    }

    //---CHECK CATEGORY
    if (product.gender === "M") {
      for (let i = 0; i < constants.genders.uomo.abbigliamento.length; i++) {
        if (product.category === constants.genders.uomo.abbigliamento[i].name) {
          categoryIndex = i;
        }
      }

      category = constants.genders.donna.abbigliamento[categoryIndex];
      if (categoryIndex === null || categoryIndex === undefined) {
        throw new Error(
          `la category ${
            product.category
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
          product.category === constants.genders.donna.abbigliamento[i].name
        ) {
          categoryIndex = i;
        }
      }

      category = constants.genders.donna.abbigliamento[categoryIndex];
      if (categoryIndex === null || categoryIndex === undefined) {
        throw new Error(
          `la category ${
            product.category
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
      category.sizes.includes(size)
    );

    if (!areSizesOk) {
      throw new Error(
        `sizes ${product.sizes} non sono accetate per category ${category.name}, taglie accettati per ${category.name}: ${category.sizes}`
      );
    }

    //---CHECK TYPE
    const areTypesOk = product.types.every((type) =>
      category.types.includes(type)
    );

    if (!areTypesOk) {
      throw new Error(
        `types ${product.types} non sono accetate per category ${category.name}, types accetati per ${category.name}: ${category.types}`
      );
    }
  }
};

export default checkConstants;
