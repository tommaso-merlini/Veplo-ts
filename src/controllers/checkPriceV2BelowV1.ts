export const checkPriceV2BelowV1 = (variations) => {
  variations.forEach((variation) => {
    if (variation.price.v2 != null && variation.price.v2 > variation.price.v1) {
      throw Object.assign(new Error("Error"), {
        extensions: {
          customCode: "400",
          customPath: `price (variationColor: ${variation.color})`,
          customMessage: "pricev2 cannot be greater than pricev1",
        },
      });
    }

    if (variation.price.v2 === variation.price.v1) {
      throw Object.assign(new Error("Error"), {
        extensions: {
          customCode: "400",
          customPath: `price (variationColor: ${variation.color})`,
          customMessage: "pricev2 cannot be the same of pricev1",
        },
      });
    }
  });
};
