import { MutationEditUserArgs } from "src/graphQL/types/types.js";
import { Context } from "../../../../../apollo/context.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import customError from "../../../../controllers/errors/customError.js";
import User from "../../../../schemas/User.model.js";

export const editUser = async (
  _: any,
  { options }: MutationEditUserArgs,
  { admin, req }: Context
) => {
  let token;

  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  } else {
    token = {
      mongoId: "640c9f3aff10cf6f8c8df3f7",
    };
  }

  //check gender is m or f
  if (
    options.gender != null &&
    options.gender !== "m" &&
    options.gender !== "f"
  ) {
    customError({
      code: "400",
      path: "user gender",
      message: `user gender can only be m or f`,
    });
  }

  await User.updateOne({ _id: token?.mongoId }, { ...options });

  return true;
};
