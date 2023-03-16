import { Context } from "../../../../../apollo/context";
import authenticateToken from "../../../../controllers/authenticateToken";
import checkConstants from "../../../../controllers/checkConstants";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import getDiffs from "../../../../controllers/getDiffs";
import handlePriceEdit from "../../../../controllers/handlePriceEdit";
import handleUpdatedPhotos from "../../../../controllers/handleUpdatedPhotos";
import mergeDeep from "../../../../controllers/mergeDeep";
import productById from "../../../../controllers/queries/productById";
import Product from "../../../../schemas/Product.model";
import lodash from "lodash";

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
    authenticateToken(
      token.mongoId,
      product.shopInfo.businessId,
      token.isBusiness
    );

  //if the price is modified
  if (options.price) {
    options.price = handlePriceEdit(options, product);
  }

  const mergedProduct = lodash.merge(product, options);

  console.log("==================================");
  console.log(mergedProduct);
  console.log("==================================");

  //check the validity of the fields based on the constants
  checkConstants(mergedProduct, "product");

  //delete the removed photos
  if (options.photos) {
    handleUpdatedPhotos(product.photos, options.photos);
  }

  await Product.updateOne({ _id: id }, mergedProduct);

  return product.id;
};
