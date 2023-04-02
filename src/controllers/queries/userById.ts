import getRequestedFields from "../getRequestedFields";
import checkObjectID from "../checkObjectID";
import customError from "../errors/customError";
import User from "../../schemas/User.model";

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
