import { ProductVariationsOrder } from "src/graphQL/types/types";
import Product from "../schemas/Product.model";

export const removeBoughtQuantityFromVariation = async (
  variations: ProductVariationsOrder[]
) => {
  console.log(variations);
  for (let variation of variations) {
    const ciao = await Product.updateOne(
      {
        _id: variation.productId,
      },
      {
        $inc: {
          "variations.$[v].lots.$[l].quantity": -variation.quantity,
        },
      },
      {
        arrayFilters: [
          {
            "v._id": variation.variationId,
          },
          {
            "l.size": variation.size,
          },
        ],
      }
    );

    console.log(ciao);
  }
  return;
};
