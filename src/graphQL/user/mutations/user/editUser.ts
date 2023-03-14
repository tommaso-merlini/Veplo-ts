import { Context } from "../../../../../apollo/context";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import customError from "../../../../controllers/errors/customError";
import User from "../../../../schemas/User.model";

export const editUser = async (_, { options }, { admin, req }: Context) => {
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

  //check gender is M or F
  if (
    options.gender != null &&
    options.gender !== "M" &&
    options.gender !== "F"
  ) {
    customError({
      code: "400",
      path: "user gender",
      message: `user gender can only be M or F`,
    });
  }

  await User.updateOne({ _id: token.mongoId }, { ...options });

  return true;
};
