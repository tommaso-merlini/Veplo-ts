import getRequestedFields from "../getRequestedFields.js";
import checkObjectID from "../checkObjectID.js";
import customError from "../errors/customError.js";
import Order from "../../schemas/Order.model.js";

const orderById = async (id: string, info?: any) => {
  let requestedFields = {};
  checkObjectID(id);

  if (info) {
    requestedFields = getRequestedFields(info);
  }

  const order = await Order.findById(id, requestedFields);

  if (!order) {
    customError({
      code: "404",
      path: "id",
      message: "order not found",
    });
  }

  return order;
};

export default orderById;
