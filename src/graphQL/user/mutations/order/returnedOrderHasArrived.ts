import orderById from "../../../../controllers/queries/orderById.js";
import { Context } from "../../../../../apollo/context.js";
import { MutationReturnedOrderHasArrivedArgs } from "src/graphQL/types/types.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import shopById from "../../../../controllers/queries/shopById.js";
import authenticateToken from "../../../../controllers/authenticateToken.js";
import Order from "../../../../schemas/Order.model.js";

export const returnedOrderHasArrived = async (
  _: any,
  { id }: MutationReturnedOrderHasArrivedArgs,
  { admin, req, stripe }: Context
) => {
  const status = "RET02";
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
      isAdmin: false,
    };
  }

  const order = await orderById(id);
  const shop = await shopById(String(order.shop.id));
  if (process.env.NODE_ENV !== "development" && !token.isAdmin)
    authenticateToken({
      tokenId: token?.mongoId,
      ids: [String(shop.businessId)],
      isBusiness: token?.isBusiness,
    });

  const paymentIntentId = order.paymentIntentId;
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  const chargeId = paymentIntent.latest_charge;
  const refund = await stripe.refunds.create({
    charge: chargeId.toString(),
    reverse_transfer: true,
    refund_application_fee: false,
  });

  //update order
  await Order.updateOne(
    {
      _id: id,
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
};
