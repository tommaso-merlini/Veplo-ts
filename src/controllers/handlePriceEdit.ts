import { PriceInput } from "src/graphQL/types/types.js";

interface Price extends PriceInput {
  discountPercentage?: number;
}

const handlePriceEdit = (price: Price) => {
  if (price.v1 <= 0) {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "400",
        customPath: "price",
        customMessage: "pricev1 must be grather than 0",
      },
    });
  }
  if (price.v2) {
    if (price.v2 <= 0) {
      throw Object.assign(new Error("Error"), {
        extensions: {
          customCode: "400",
          customPath: "price",
          customMessage: "pricev2 must be grather than 0",
        },
      });
    }
    if (price.v1 < price.v2) {
      throw Object.assign(new Error("Error"), {
        extensions: {
          customCode: "400",
          customPath: "price",
          customMessage: "pricev1 must be grather than pricev2",
        },
      });
    }
    let discountPercentage = +(100 - (100 * price.v2) / price.v1).toFixed(2);
    price = {
      v1: price.v1,
      v2: price.v2,
      discountPercentage: discountPercentage,
    };
  } else {
    price = {
      v1: price.v1,
    };
  }

  console.log(price);

  return price;
};

export default handlePriceEdit;
