import { MutationChangeShopStatusArgs } from "src/graphQL/types/types.js";
import { Context } from "../../../../../apollo/context.js";
import authenticateToken from "../../../../controllers/authenticateToken.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import shopById from "../../../../controllers/queries/shopById.js";
import Product from "../../../../schemas/Product.model.js";
import Shop from "../../../../schemas/Shop.model.js";

export const changeShopStatus = async (
  _: any,
  { id, status }: MutationChangeShopStatusArgs,
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

  const shop = await shopById(id);

  //token operations
  if (process.env.NODE_ENV !== "development")
    authenticateToken(token?.mongoId, [shop.id], token?.isBusiness);

  await Shop.updateOne({ _id: id }, { status: status });

  await Product.updateMany(
    { "shopInfo.id": token?.mongoId },
    {
      $set: {
        "shopInfo.status": status,
      },
    }
  );

  return true;
};
