import Order from "../../schemas/Order.model.js";
import customError from "../errors/customError.js";

export const handleChargeRefunded = async (session: any) => {
  if (session.status === "succeeded") {
    const order = await Order.findOne({
      chargeId: session.id,
    });

    switch (order.status) {
      case "CANC01":
        var status = "REF01";
        break;
      case "CANC02":
        var status = "REF03";
      case "RET02":
        var status = "REF02";
      default: //TODO vedere bene come gestire meglio questo errore
        throw new Error("can't refund");
        break;
    }

    if (order)
      await Order.updateOne(
        {
          chargeId: session.id,
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
  }
};
