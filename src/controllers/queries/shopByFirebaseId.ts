import getRequestedFields from "../getRequestedFields";
import checkObjectID from "../checkObjectID";
import Shop from "../../schemas/Shop.model";

const shopByFirebaseId = async (firebaseId, info?) => {
  let requestedFields = {};

  if (info) {
    requestedFields = getRequestedFields(info);
  }

  const shop = await Shop.findOne({ firebaseId }, requestedFields);

  if (!shop) {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "404",
        customPath: "id",
        customMessage: "shop not found",
      },
    });
  }

  return shop;
};

export default shopByFirebaseId;
