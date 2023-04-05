import { Context } from "apollo/context.js";
import orderById from "../../../../controllers/queries/orderById.js";
import { MutationProductsNotAvailableRefundArgs } from "src/graphQL/types/types.js";
import Order from "../../../../../src/schemas/Order.model.js";
import customError from "../../../../../src/controllers/errors/customError.js";
import checkFirebaseErrors from "../../../../../src/controllers/checkFirebaseErrors.js";
import authenticateToken from "../../../../../src/controllers/authenticateToken.js";
import shopById from "../../../../../src/controllers/queries/shopById.js";

export const productsNotAvailableRefund = async (
  _,
  { orderId, productsNotAvailable }: MutationProductsNotAvailableRefundArgs,
  { stripe, admin, req }: Context
) => {
  const order = await orderById(orderId);
  if (order.status !== "CANC01") {
    customError({
      code: "400",
      path: "order status",
      message: "in order to refund a checkout, the order status must be CANC01",
    });
  }
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
      isBusiness: true,
      email: "prova@prova.it",
      user_id: "firebaseId",
    };
  }

  const shop = await shopById(String(order.shop.id));

  if (process.env.NODE_ENV !== "development")
    //token operations
    authenticateToken(
      token?.mongoId,
      [String(shop.businessId)],
      token?.isBusiness
    );

  const session = await stripe.checkout.sessions.retrieve(
    order.checkoutSessionId
  );
  const paymentIntent = session.payment_intent;
  await stripe.refunds.create({
    payment_intent: paymentIntent.toString(),
  });
  await Order.updateOne(
    {
      _id: orderId,
    },
    {
      status: "REF01",
    }
  );
  return true;
};