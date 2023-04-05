import {
  MutationCreateVariationArgs,
  ProductVariationInput,
} from "src/graphQL/types/types.js";
import { Context } from "../../../../../apollo/context.js";
import authenticateToken from "../../../../controllers/authenticateToken.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import customError from "../../../../controllers/errors/customError.js";
import Product from "../../../../schemas/Product.model.js";

export const createVariation = async (
  _: any,
  { productId, options }: MutationCreateVariationArgs,
  { admin, req }: Context
) => {
  let token;
  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  }

  const product = await Product.findById(productId);

  if (!product) {
    customError({
      code: "404",
      path: "product",
      message: "product not found",
    });
  }

  product.variations.forEach((variation: ProductVariationInput) => {
    if (variation.color === options.color) {
      customError({
        code: "409",
        path: "variation",
        message: "variation already exists",
      });
    }
  });

  if (process.env.NODE_ENV !== "development")
    //token operations
    authenticateToken(
      token?.mongoId,
      [String(product.shopInfo.businessId)],
      token?.isBusiness
    );

  await Product.updateOne(
    { _id: productId },
    { $pull: { variations: options } }
  );

  return true;
};
