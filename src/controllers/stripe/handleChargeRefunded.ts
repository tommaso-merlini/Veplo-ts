import Order from "../../schemas/Order.model.js";
import customError from "../errors/customError.js";
import { calculateApplicationFeeAmount } from "./calculateApplicationFeeAmount.js";
import stripe from "../../../stripe/stripe.js";

export const handleChargeRefunded = async (session: any) => {
  const veploFee: number | undefined = +process.env.VEPLO_FEE;
  const fine: number | undefined = +process.env.VEPLO_SHOP_REFUND_FINE;
  if (session.status === "succeeded") {
    const order = await Order.findOne({
      chargeId: session.id,
    });

    switch (order.status) {
      case "CANC01":
        var status = "REF01";
        const fee = veploFee - fine;
        const applicationFeeAmount = calculateApplicationFeeAmount({
          total: order.totalDetails.total,
          fee,
        });
        const feeRefund = await stripe.applicationFees.createRefund(
          session.application_fee,
          {
            amount: applicationFeeAmount,
          }
        );
        break;
      case "CANC02":
        var status = "REF03";
        break;
      case "RET02":
        var status = "REF02";
        break;
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
