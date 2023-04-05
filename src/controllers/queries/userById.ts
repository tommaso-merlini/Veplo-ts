import getRequestedFields from "../getRequestedFields.js";
import checkObjectID from "../checkObjectID.js";
import customError from "../errors/customError.js";
import User from "../../schemas/User.model.js";

const userById = async (id: string, info?: any) => {
  let requestedFields = {};
  checkObjectID(id);

  if (info) {
    requestedFields = getRequestedFields(info);
  }

  const user = await User.findById(id, requestedFields);

  if (!user) {
    customError({
      code: "404",
      path: "id",
      message: "user not found",
    });
  }

  return user;
};

export default userById;
