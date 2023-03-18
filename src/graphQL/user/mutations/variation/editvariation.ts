import { Context } from "../../../../../apollo/context";
import authenticateToken from "../../../../controllers/authenticateToken";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import deleteFromSpaces from "../../../../controllers/deleteFromSpaces";
import customError from "../../../../controllers/errors/customError";
import productById from "../../../../controllers/queries/productById";
import Product from "../../../../schemas/Product.model";
import lodash from "lodash";

export const editVariation = async (
  _,
  { id, options },
  { admin, req }: Context
) => {
  let token;
  let variationIndex;
  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  }

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
  product.variations.forEach((variation, index) => {
    if (variation._id == id) {
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
      token.mongoId,
      product.shopInfo.businessId,
      token.isBusiness
    );

  await Product.updateOne(
    { "variations._id": id },
    {
      $set: {
        "variations.0": mergedVariation, //!variation.0?
      },
    }
  );

  return true;
};
