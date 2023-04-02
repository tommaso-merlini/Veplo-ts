import { ShopOrdersArgs } from "src/graphQL/types/types";
import { Context } from "../../../../../apollo/context";
import authenticateToken from "../../../../controllers/authenticateToken";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import shopById from "../../../../controllers/queries/shopById";
import Order from "../../../../schemas/Order.model";

export const orders = async (
  account: any,
  { statuses }: ShopOrdersArgs,
  { admin, req }: Context,
  queryInfo: any
) => {
  let orders;

  let token;

  let checkStatuses;
  if (statuses != null) {
    checkStatuses = { $in: statuses };
  } else {
    checkStatuses = { $exists: true };
  }

  if (queryInfo.path.prev.key === "user") {
    orders = await Order.find({
      "user.id": account.id,
      status: checkStatuses,
    });
  }

  if (queryInfo.path.prev.key === "shop") {
    //check account token
    if (process.env.NODE_ENV !== "development") {
      try {
        token = await admin.auth().verifyIdToken(req.headers.authorization);
      } catch (e) {
        checkFirebaseErrors(e);
      }
    } else {
      token = {
        mongoId: "6421b881ca22d34c3ca1fc52",
        isBusiness: true,
      };
    }

    const shop = await shopById(account.id);

    if (process.env.NODE_ENV !== "development")
      //token operations
      authenticateToken(token?.mongoId, [shop.businessId], token?.isBusiness);

    orders = await Order.find({
      "shop.id": account.id,
      status: checkStatuses,
    });
  }

  const reversedOrders = orders.reverse();

  return reversedOrders;
};
