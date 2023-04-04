import { MutationEditProductArgs } from "src/graphQL/types/types";
import { Context } from "../../../../../apollo/context";
import authenticateToken from "../../../../controllers/authenticateToken";
import checkConstants from "../../../../controllers/checkConstants";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import handlePriceEdit from "../../../../controllers/handlePriceEdit";
import productById from "../../../../controllers/queries/productById";
import Product from "../../../../schemas/Product.model";
import lodash from "lodash";

export const editProduct = async (
  _: any,
  { id, options }: MutationEditProductArgs,
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
      token?.mongoId,
      [product.shopInfo.businessId],
      token?.isBusiness
    );

  const mergedProduct = lodash.merge(product, options);

  //if the price is modified
  if (options.price) {
    mergedProduct.price = handlePriceEdit(options.price);
  }

  console.log("==================================");
  console.log(mergedProduct);
  console.log("==================================");

  //check the validity of the fields based on the constants
  checkConstants(mergedProduct, "product");

  await Product.updateOne({ _id: id }, mergedProduct);

  return product.id;
};
