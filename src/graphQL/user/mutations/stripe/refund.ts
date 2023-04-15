import { Context } from "apollo/context.js";
import { MutationRefundArgs } from "src/graphQL/types/types.js";

export const refund = async (
  _: any,
  { checkoutSessionId }: MutationRefundArgs,
  { stripe }: Context
) => {
  const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
  const paymentIntent = session.payment_intent;
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntent.toString(),
  });
  console.log(refund);
  return true;
};
