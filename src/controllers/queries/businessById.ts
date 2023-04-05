import getRequestedFields from "../getRequestedFields.js";
import checkObjectID from "../checkObjectID.js";
import Business from "../../schemas/Business.model.js";
import customError from "../errors/customError.js";

const businessById = async (id: string, info?: any) => {
  let requestedFields = {};
  checkObjectID(id);

  if (info) {
    requestedFields = getRequestedFields(info);
  }

  const business = await Business.findById(id, requestedFields);

  if (!business) {
    customError({
      code: "404",
      path: "id",
      message: `business not found (id: ${id})`,
    });
  }

  return business;
};

export default businessById;
