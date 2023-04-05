import getRequestedFields from "../getRequestedFields.js";
import Shop from "../../schemas/Shop.model.js";
import customError from "../errors/customError.js";

const helperShopByFirebaseId = async (firebaseId: string, info: any) => {
  let requestedFields = {};

  if (info) {
    requestedFields = getRequestedFields(info);
  }

  const shop = await Shop.findOne({ firebaseId }, requestedFields);

  if (!shop) {
    customError({
      code: "404",
      path: "id",
      message: "shop not found",
    });
  }

  return shop;
};

export default helperShopByFirebaseId;
