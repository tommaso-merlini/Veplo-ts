import customError from "./errors/customError";

export const checkLotQuantity = (variations) => {
  for (let variation of variations) {
    for (let lot of variation.lots) {
      if (lot.quantity < 0) {
        customError({
          code: "400",
          path: `variation color: ${variation.color}, size: ${lot.size}`,
          message: "quantity must be grather than or equal to zero",
        });
      }
    }
  }
};
