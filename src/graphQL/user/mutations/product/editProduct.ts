import { MutationEditProductArgs } from "src/graphQL/types/types.js";
import { Context } from "../../../../../apollo/context.js";
import authenticateToken from "../../../../controllers/authenticateToken.js";
import checkConstants from "../../../../controllers/checkConstants.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import handlePriceEdit from "../../../../controllers/handlePriceEdit.js";
import productById from "../../../../controllers/queries/productById.js";
import Product from "../../../../schemas/Product.model.js";
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
    authenticateToken({
      tokenId: token?.mongoId,
      ids: [(product as any).shopInfo.businessId],
      isBusiness: token?.isBusiness,
    });

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
