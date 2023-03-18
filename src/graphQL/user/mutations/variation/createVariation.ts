import { Context } from "../../../../../apollo/context";
import authenticateToken from "../../../../controllers/authenticateToken";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import deleteFromSpaces from "../../../../controllers/deleteFromSpaces";
import customError from "../../../../controllers/errors/customError";
import productById from "../../../../controllers/queries/productById";
import Product from "../../../../schemas/Product.model";

export const deleteVariation = async (
  _,
  { productId, options },
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

  const product = await Product.findOneById(productId);

  if (!product) {
    customError({
      code: "404",
      path: "product",
      message: "product not found",
    });
  }

  product.variations.forEach((variation) => {
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
      token.mongoId,
      product.shopInfo.businessId,
      token.isBusiness
    );

  await Product.updateOne(
    { _id: productId },
    { $pull: { variations: options } }
  );

  return true;
};
