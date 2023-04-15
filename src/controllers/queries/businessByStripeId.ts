import getRequestedFields from "../getRequestedFields.js";
import customError from "../errors/customError.js";
import Business from "../../schemas/Business.model.js";

const businessByStripeId = async (stripeId: string, info?: any) => {
  let requestedFields = {};

  if (info) {
    requestedFields = getRequestedFields(info);
  }

  const business = await Business.findOne(
    { "stripe.id": stripeId },
    requestedFields
  );

  if (!business) {
    customError({
      code: "404",
      path: "id",
      message: "bsuiness not found",
    });
  }

  return business;
};

export default businessByStripeId;
