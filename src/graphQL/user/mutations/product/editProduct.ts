import { MutationEditProductArgs } from "src/graphQL/types/types.js";
import { Context } from "../../../../../apollo/context.js";
import authenticateToken from "../../../../controllers/authenticateToken.js";
import checkConstants from "../../../../controllers/checkConstants.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import handlePriceEdit from "../../../../controllers/handlePriceEdit.js";
import productById from "../../../../controllers/queries/productById.js";
import Product from "../../../../schemas/Product.model.js";
import lodash from "lodash";
import { removeDuplicates } from "../../../../controllers/removeDuplicates.js";

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

  //check the validity of the fields based on the constants
  checkConstants(options, "product");

  function customizer(objValue: any, srcValue: any) {
    if (lodash.isArray(objValue)) {
      return srcValue;
    }
  }

  const mergedProduct = lodash.mergeWith(product, options, customizer);

  //if the price is modified
  if (options.price) {
    mergedProduct.price = handlePriceEdit(options.price);
  }

  //if the traits are modified
  if (options?.info?.traits) {
    mergedProduct.info.traits = removeDuplicates(options.info.traits);
  }

  //if the materials are modified
  if (options?.info?.materials) {
    mergedProduct.info.materials = removeDuplicates(options.info.materials);
  }

  // console.log("==================================");
  // console.log(mergedProduct.info);
  // console.log("==================================");

  await Product.updateOne({ _id: id }, mergedProduct);

  return product.id;
};
