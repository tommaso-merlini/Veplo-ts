import { Context } from "../../../apollo/context.js";
import authenticateToken from "../../controllers/authenticateToken.js";
import checkConstants from "../../controllers/checkConstants.js";
import checkFirebaseErrors from "../../controllers/checkFirebaseErrors.js";
import customError from "../../controllers/errors/customError.js";
import getDiffs from "../../controllers/getDiffs.js";
import handlePriceEdit from "../../controllers/handlePriceEdit.js";
import handleUpdatedPhotos from "../../controllers/handleUpdatedPhotos.js";
import productById from "../../controllers/queries/productById.js";
import Product from "../../schemas/Product.model.js";

const adminEditProduct = async (
  _,
  { id, options },
  { admin, req }: Context
) => {
  let token;

  if (
    options.status &&
    options.status != "active" &&
    options.status != "not_active"
  ) {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "400",
        customPath: "status",
        customMessage: "status can only be 'active' or 'not_active",
      },
    });
  }

  try {
    token = await admin.auth().verifyIdToken(req.headers.authorization);
  } catch (e) {
    checkFirebaseErrors(e);
  }

  if (!token.isAdmin) {
    customError({
      code: "403",
      path: "admin",
      message: "you must be an admin to access this function",
    });
  }

  const product = await productById(id);

  //if the price is modified
  if (options.price) {
    options.price = handlePriceEdit(options.price);
  }

  //merging product with options (overwrite equal values)
  const { merge, diffs, isDifferent } = getDiffs(product, options);

  //check if the product has been modified
  if (!isDifferent && !options.newPhotos && !options.deletedPhotos) {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "304",
        customPath: "product",
        customMessage: "product not modified",
      },
    });
  }

  // throw new Error("ok");

  //check the validity of the fields based on the constants
  checkConstants(merge, "product");

  //delete the removed photos
  if (options.photos) {
    handleUpdatedPhotos(options.photos);
  }

  await Product.updateOne({ _id: id }, { ...diffs });

  return product.id;
};

export default adminEditProduct;
