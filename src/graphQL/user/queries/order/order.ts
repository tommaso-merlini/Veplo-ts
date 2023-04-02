import { QueryOrderArgs } from "src/graphQL/types/types";
import { Context } from "../../../../../apollo/context";
import authenticateToken from "../../../../controllers/authenticateToken";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import orderById from "../../../../controllers/queries/orderById";

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
      [order.shop.id, order.user.id],
      token?.isBusiness
    );

  return order;
};
