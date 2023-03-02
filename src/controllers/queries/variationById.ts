import getRequestedFields from "../getRequestedFields";
import checkObjectID from "../checkObjectID";
import customError from "../errors/customError";
import Variation from "../../schemas/Variation.model";

const variationById = async (id, info?) => {
  let requestedFields = {};
  checkObjectID(id);

  if (info) {
    requestedFields = getRequestedFields(info);
  }

  const variation = await Variation.findById(id, requestedFields);

  if (!variation) {
    customError({
      code: "404",
      path: "id",
      message: `variation not found (id: ${id})`,
    });
  }

  return variation;
};

export default variationById;
