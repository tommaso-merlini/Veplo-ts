import getRequestedFields from "../getRequestedFields.js";
import checkObjectID from "../checkObjectID.js";
import customError from "../errors/customError.js";
import Cart from "../../schemas/Cart.model.js";

const cartById = async (id: string, info?: any) => {
  let requestedFields = {};
  checkObjectID(id);

  if (info) {
    requestedFields = getRequestedFields(info);
  }

  const cart = await Cart.findById(id, requestedFields);

  if (!cart) {
    customError({
      code: "404",
      path: "id",
      message: "cart not found",
    });
  }

  return cart;
};

export default cartById;
