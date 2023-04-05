import getRequestedFields from "../getRequestedFields.js";
import checkObjectID from "../checkObjectID.js";
import Shop from "../../schemas/Shop.model.js";
import customError from "../errors/customError.js";

const shopById = async (id: string, info?: any) => {
  let requestedFields = {};
  checkObjectID(id);

  if (info) {
    requestedFields = getRequestedFields(info);
  }

  const shop = await Shop.findById(id, requestedFields);

  if (!shop) {
    customError({
      code: "404",
      path: "id",
      message: "shop not found",
    });
  }

  return shop;
};

export default shopById;
