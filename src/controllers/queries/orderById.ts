import getRequestedFields from "../getRequestedFields";
import checkObjectID from "../checkObjectID";
import customError from "../errors/customError";
import Order from "../../schemas/Order.model";

const orderById = async (id, info?) => {
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
