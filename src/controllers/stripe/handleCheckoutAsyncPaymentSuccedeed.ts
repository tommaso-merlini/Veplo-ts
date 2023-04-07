import Order from "../../schemas/Order.model.js";

export const handleCheckoutAsyncPaymentSuccedeed = async (session: any) => {
  const checkoutSessionId = session.id;
  const status = "PAY01";

  await Order.updateOne(
    {
      checkoutSessionId,
    },
    {
      status,
      $push: {
        history: {
          status,
          date: new Date(),
        },
      },
    }
  );
};
