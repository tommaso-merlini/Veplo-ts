import { Context } from "../../../../../apollo/context.js";
import authenticateToken from "../../../../controllers/authenticateToken.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import customError from "../../../../controllers/errors/customError.js";
import Product from "../../../../schemas/Product.model.js";
import lodash from "lodash";
import { checkLotQuantity } from "../../../../controllers/checkLotQuantity.js";
import {
  MutationEditVariationArgs,
  ProductVariation,
} from "src/graphQL/types/types.js";

export const editVariation = async (
  _: any,
  { id, options }: MutationEditVariationArgs,
  { admin, req }: Context
) => {
  let token;
  let variationIndex = 0;
  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  }

  checkLotQuantity([options]);

  const product = await Product.findOne({
    "variations._id": id,
  });

  if (!product) {
    customError({
      code: "404",
      path: "variation and product",
      message: "there is no product with this variation",
    });
  }

  //get the variation index
  product.variations.forEach((variation: ProductVariation, index: number) => {
    if (variation.id == id) {
      variationIndex = index;
    }
  });

  const mergedVariation = lodash.merge(
    product.variations[variationIndex],
    options
  );

  mergedVariation.lots = options.lots;
  mergedVariation.photos = options.photos;

  console.log(mergedVariation);

  //TODO check dei gender dei prodotti prodotti => se non ci sono piu' prodotti con quel gender eliminare il gender

  if (process.env.NODE_ENV !== "development")
    //token operations
    authenticateToken(
      token?.mongoId,
      [String(product.shopInfo.businessId)],
      token?.isBusiness
    );

  await Product.updateOne(
    { "variations._id": id },
    {
      $set: {
        "variations.$": mergedVariation,
      },
    }
  );

  return true;
};
