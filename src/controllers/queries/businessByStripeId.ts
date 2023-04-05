import getRequestedFields from "../getRequestedFields.js";
import Shop from "../../schemas/Shop.model.js";
import customError from "../errors/customError.js";

const businessByStripeId = async (stripeId: string, info: any) => {
  let requestedFields = {};

  if (info) {
    requestedFields = getRequestedFields(info);
  }

  const business = await Shop.findOne({ stripeId }, requestedFields);

  if (!business) {
    customError({
      code: "404",
      path: "id",
      message: "shop not found",
    });
  }

  return business;
};

export default businessByStripeId;
