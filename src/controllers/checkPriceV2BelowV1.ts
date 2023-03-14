export const checkPriceV2BelowV1 = (product) => {
  if (product.price.v2 != null && product.price.v2 > product.price.v1) {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "400",
        customPath: `price`,
        customMessage: "pricev2 cannot be greater than pricev1",
      },
    });
  }

  if (product.price.v2 === product.price.v1) {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "400",
        customPath: `price`,
        customMessage: "pricev2 cannot be the same of pricev1",
      },
    });
  }
};
