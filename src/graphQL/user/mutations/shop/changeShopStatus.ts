import { Context } from "../../../../../apollo/context";
import authenticateToken from "../../../../controllers/authenticateToken";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import shopById from "../../../../controllers/queries/shopById";
import Product from "../../../../schemas/Product.model";
import Shop from "../../../../schemas/Shop.model";

export const changeShopStatus = async (
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

  const shop = await shopById(id);

  //token operations
  if (process.env.NODE_ENV !== "development")
    authenticateToken(token.mongoId, shop.id, token.isBusiness);

  await Shop.updateOne({ _id: id }, { status: status });

  await Product.updateMany(
    { firebaseShopId: shop.firebaseId },
    {
      $set: {
        "shopOptions.status": status,
      },
    }
  );

  return true;
};
