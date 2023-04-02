import getRequestedFields from "../getRequestedFields";
import Shop from "../../schemas/Shop.model";
import customError from "../errors/customError";

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
