import { Context } from "../../../../../apollo/context";
import authenticateToken from "../../../../controllers/authenticateToken";
import checkConstants from "../../../../controllers/checkConstants";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import getDiffs from "../../../../controllers/getDiffs";
import handlePriceEdit from "../../../../controllers/handlePriceEdit";
import handleUpdatedPhotos from "../../../../controllers/handleUpdatedPhotos";
import productById from "../../../../controllers/queries/productById";
import Product from "../../../../schemas/Product.model";

export const editProduct = async (
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

  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  }

  const product = await productById(id);

  //token operations
  if (process.env.NODE_ENV !== "development")
    authenticateToken(token.uid, product.firebaseShopId, token.isShop);

  //if the price is modified
  if (options.price) {
    options.price = handlePriceEdit(options, product);
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
    handleUpdatedPhotos(product.photos, options.photos);
  }

  await Product.updateOne({ _id: id }, { ...diffs });

  return product.id;
};
