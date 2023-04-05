import { Context } from "../../../apollo/context.js";
import checkFirebaseErrors from "../../controllers/checkFirebaseErrors.js";
import deleteFromSpaces from "../../controllers/deleteFromSpaces.js";
import productById from "../../controllers/queries/productById.js";
import customError from "../../controllers/errors/customError.js";
import Product from "../../schemas/Product.model.js";

export const adminDeleteProduct = async (
  _,
  { id },
  { admin, req, s3Client }: Context
) => {
  let token;

  try {
    token = await admin.auth().verifyIdToken(req.headers.authorization);
  } catch (e) {
    checkFirebaseErrors(e);
  }

  if (!token.isAdmin || token.isAdmin === null) {
    customError({
      code: "403",
      path: "admin",
      message: "you must be an admin to access this function",
    });
  }

  const product = await productById(id);

  deleteFromSpaces((product as any).photos);

  await Product.findByIdAndRemove(id);

  return product.id;
};
