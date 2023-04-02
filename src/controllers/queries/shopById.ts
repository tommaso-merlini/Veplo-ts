import getRequestedFields from "../getRequestedFields";
import checkObjectID from "../checkObjectID";
import Shop from "../../schemas/Shop.model";
import customError from "../errors/customError";

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
