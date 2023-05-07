import Order from "../../schemas/Order.model.js";
import { sendOrderReceived } from "../email/sendOrderReceived.js";

export const handleCheckoutAsyncPaymentSuccedeed = async (session: any) => {
  const checkoutSessionId = session.id;
  const status = "PAY01";

  const order: any = await Order.findOneAndUpdate(
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

  sendOrderReceived(order);
};
