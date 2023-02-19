import getRequestedFields from "../getRequestedFields";
import checkObjectID from "../checkObjectID";
import Shop from "../../schemas/Shop.model";
import customError from "../errors/customError";

const helperShopByFirebaseId = async (firebaseId, info?) => {
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
