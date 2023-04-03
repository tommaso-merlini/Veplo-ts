import { Context } from "apollo/context";
import orderById from "../../../../controllers/queries/orderById";
import { MutationProductsNotAvailableRefundArgs } from "src/graphQL/types/types";
import Order from "../../../../../src/schemas/Order.model";

export const productsNotAvailableRefund = async (
  _,
  { orderId, productsNotAvailable }: MutationProductsNotAvailableRefundArgs,
  { stripe }: Context
) => {
  const order = await orderById(orderId);
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
