import { Context } from "apollo/context.js";
import orderById from "../../../../controllers/queries/orderById.js";
import { MutationProductsNotAvailableRefundArgs } from "src/graphQL/types/types.js";
import Order from "../../../../../src/schemas/Order.model.js";
import checkFirebaseErrors from "../../../../../src/controllers/checkFirebaseErrors.js";
import authenticateToken from "../../../../../src/controllers/authenticateToken.js";
import shopById from "../../../../../src/controllers/queries/shopById.js";
import dotenv from "dotenv";
dotenv.config();

export const productsNotAvailableRefund = async (
  _: any,
  { orderId, productsNotAvailable }: MutationProductsNotAvailableRefundArgs,
  { stripe, admin, req }: Context
) => {
  const status = "CANC01";
  const order = await orderById(orderId);
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

  const shop = await shopById(String(order.shop.id));

  if (process.env.NODE_ENV !== "development" && !token.isAdmin)
    //token operations
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
};
