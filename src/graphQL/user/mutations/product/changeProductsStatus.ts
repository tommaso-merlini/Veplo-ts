import { Context } from "../../../../../apollo/context";
import authenticateToken from "../../../../controllers/authenticateToken";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import productById from "../../../../controllers/queries/productById";
import Product from "../../../../schemas/Product.model";

export const changeProductStatus = async (
  _,
  { id, status },
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
    authenticateToken(token.mongoId, product.shopId, token.isBusiness);

  await Product.updateOne({ _id: id }, { status: status });

  return true;
};
