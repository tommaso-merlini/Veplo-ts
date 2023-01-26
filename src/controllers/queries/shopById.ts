import getRequestedFields from "../getRequestedFields";
import checkObjectID from "../checkObjectID";
import Shop from "../../schemas/Shop.model";

const shopById = async (id, info?) => {
  let requestedFields = {};
  checkObjectID(id);

  if (info) {
    requestedFields = getRequestedFields(info);
  }

  const shop = await Shop.findById(id, requestedFields);

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

export default shopById;
