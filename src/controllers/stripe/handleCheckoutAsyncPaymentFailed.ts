import Order from "../../schemas/Order.model.js";

export const handleCheckoutAsyncPaymentFailed = async (session: any) => {
  //TODO mandare la mail
  console.log("bisogna mandare la mail");
  const checkoutSessionId = session.id;
  const status = "CANC04";

  await Order.updateOne(
    {
      checkoutSessionId,
    },
    {
      status,
      $push: {
        history: {
          status,
          date: Date.now(),
        },
      },
    }
  );
  return;
};
