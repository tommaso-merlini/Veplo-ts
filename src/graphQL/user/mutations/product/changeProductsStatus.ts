import { MutationChangeProductStatusArgs } from "src/graphQL/types/types.js";
import { Context } from "../../../../../apollo/context.js";
import authenticateToken from "../../../../controllers/authenticateToken.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import productById from "../../../../controllers/queries/productById.js";
import Product from "../../../../schemas/Product.model.js";

export const changeProductStatus = async (
  _: any,
  { id, status }: MutationChangeProductStatusArgs,
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

  const product = await productById(id);

  //token operations
  if (process.env.NODE_ENV !== "development")
    authenticateToken({
      tokenId: token?.mongoId,
      ids: [String((product as any).shopId)],
      isBusiness: token?.isBusiness,
    });

  await Product.updateOne({ _id: id }, { status: status });

  return true;
};
