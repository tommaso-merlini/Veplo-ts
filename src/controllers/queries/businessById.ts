import getRequestedFields from "../getRequestedFields";
import checkObjectID from "../checkObjectID";
import Business from "../../schemas/Business.model";
import customError from "../errors/customError";

const businessById = async (id, info?) => {
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
