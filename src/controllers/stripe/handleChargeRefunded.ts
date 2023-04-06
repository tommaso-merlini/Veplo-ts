import Order from "../../schemas/Order.model.js";

export const handleChargeRefunded = async (session: any) => {
  console.log("arriva");
  const status = "REF01";
  if (session.status === "succedeed") {
    await Order.updateOne(
      {
        chargeId: session.id,
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
  }
};
