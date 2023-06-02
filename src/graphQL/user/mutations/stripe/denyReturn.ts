import { Context } from "apollo/context.js";
import orderById from "../../../../controllers/queries/orderById.js";
import { MutationDenyReturnArgs } from "src/graphQL/types/types.js";
import Order from "../../../../../src/schemas/Order.model.js";
import customError from "../../../../../src/controllers/errors/customError.js";
import checkFirebaseErrors from "../../../../../src/controllers/checkFirebaseErrors.js";
import authenticateToken from "../../../../../src/controllers/authenticateToken.js";
import shopById from "../../../../../src/controllers/queries/shopById.js";

export const denyReturn = async (
  _: any,
  { orderId }: MutationDenyReturnArgs,
  { admin, req }: Context
) => {
  const newStatus = "RET03";
  let token;

  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  } else {
    token = {
      mongoId: "641f178dca22d34c3ca1ec01",
      isBusiness: false,
      email: "prova@prova.it",
      user_id: "firebaseId",
      isAdmin: true,
    };
  }

  const order = await orderById(orderId);
  const oldStatus = order.status;

  if (oldStatus != "RET01") {
    customError({
      code: "400",
      path: "order status",
      message: `order status must be ${oldStatus} in order to make it ${status}`,
    });
  }

  const shop = await shopById(String(order.shop.id));

  if (process.env.NODE_ENV !== "development" && !token.isAdmin)
    //token operations
    authenticateToken({
      tokenId: token?.mongoId,
      ids: [String(shop.businessId)],
      isBusiness: token?.isBusiness,
    });

  await Order.updateOne(
    {
      _id: orderId,
    },
    {
      status: newStatus,
      $push: {
        history: {
          status: newStatus,
          date: new Date(),
        },
      },
    }
  );
  return true;
};
