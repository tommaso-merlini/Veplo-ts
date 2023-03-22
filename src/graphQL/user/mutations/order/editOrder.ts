import { Context } from "../../../../../apollo/context";
import authenticateToken from "../../../../controllers/authenticateToken";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import orderById from "../../../../controllers/queries/orderById";
import lodash from "lodash";
import Order from "../../../../schemas/Order.model";

export const editOrder = async (
  _,
  { id, options },
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
      mongoId: "6410a5686c8721c863f3d1d9",
      isBusiness: "true",
    };
  }

  const order = await orderById(id);

  //token operations
  if (process.env.NODE_ENV !== "development")
    authenticateToken(token.mongoId, order.shop.id, token.isBusiness);

  const orderShipping = order.shipping;

  const mergedShipping = lodash.merge(orderShipping, options);

  await Order.updateOne(
    { _id: id },
    {
      shipping: mergedShipping,
    }
  );

  return true;
};
