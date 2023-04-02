import getRequestedFields from "../getRequestedFields";
import checkObjectID from "../checkObjectID";
import customError from "../errors/customError";
import Cart from "../../schemas/Cart.model";

const cartById = async (id: string, info: any) => {
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
