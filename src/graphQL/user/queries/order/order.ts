import { QueryOrderArgs } from "src/graphQL/types/types.js";
import { Context } from "../../../../../apollo/context.js";
import authenticateToken from "../../../../controllers/authenticateToken.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import orderById from "../../../../controllers/queries/orderById.js";

export const order = async (
  _: any,
  { id }: QueryOrderArgs,
  { admin, req }: Context
) => {
  let token;
  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  } else {
    token = {
      mongoId: "641f212bca22d34c3ca1ec30",
      isBusiness: false,
      isAdmin: false,
    };
  }
  const order = await orderById(id);

  //token operations
  if (process.env.NODE_ENV !== "development")
    authenticateToken(
      token?.mongoId,
      [String(order.shop.id), String(order.user.id)],
      token?.isBusiness,
      false
    );

  return order;
};
