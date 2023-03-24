import Product from "../schemas/Product.model";

export const removeBoughtQuantityFromVariation = (variations) => {
  console.log(variations);
  // for (let variation of variations) {
  //   Product.updateOne(
  //     {
  //       _id: variation.productId,
  //       "variations._id": variation.variationId,
  //       "variations.lots.size": variation.size,
  //     },
  //     { $inc: { "variations.lots.$.quantity": -variation.quantity } }
  //   );
  // }
  return;
};
