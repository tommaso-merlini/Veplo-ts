import { ShopOrdersArgs } from "src/graphQL/types/types.js";
import { Context } from "../../../../../apollo/context.js";
import authenticateToken from "../../../../controllers/authenticateToken.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import shopById from "../../../../controllers/queries/shopById.js";
import Order from "../../../../schemas/Order.model.js";

export const orders = async (
  account: any,
  { statuses, limit, offset }: ShopOrdersArgs,
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
      authenticateToken({
        tokenId: token?.mongoId,
        ids: [String(shop.businessId)],
        isBusiness: token?.isBusiness,
      });

    orders = await Order.find({
      "shop.id": account.id,
      status: checkStatuses,
    })
      .limit(limit)
      .skip(offset);
  }

  const reversedOrders = orders.reverse();

  return reversedOrders;
};
