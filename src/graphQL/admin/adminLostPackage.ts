import orderById from "../../controllers/queries/orderById.js";
import Order from "../../schemas/Order.model.js";
import { MutationAdminLostPackageArgs } from "../types/types.js";
import customError from "../../controllers/errors/customError.js";
import { Context } from "../../../apollo/context.js";
import checkFirebaseErrors from "../../controllers/checkFirebaseErrors.js";

export const adminLostPackage = async (
  _,
  { orderId }: MutationAdminLostPackageArgs,
  { admin, req, stripe }: Context
) => {
  const status = "CANC02";

  let token;

  try {
    token = await admin.auth().verifyIdToken(req.headers.authorization);
  } catch (e) {
    checkFirebaseErrors(e);
  }

  if (!token.isAdmin || token.isAdmin === null) {
    customError({
      code: "403",
      path: "admin",
      message: "you must be an admin to access this function",
    });
  }

  const order = await orderById(orderId);

  const session = await stripe.checkout.sessions.retrieve(
    order.checkoutSessionId
  );
  const paymentIntent = session.payment_intent;
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntent.toString(),
  });

  if (order.status != "SHIP02") {
    customError({
      code: "400",
      path: "order status",
      message: "order status must be CANC02 in order to cancel it",
    });
  }
  await Order.updateOne(
    {
      _id: orderId,
    },
    {
      status,
      chargeId: refund.charge,
      $push: {
        history: {
          status,
          date: new Date(),
        },
      },
    }
  );

  return true;

  //TODO mandare email all'utente
};
