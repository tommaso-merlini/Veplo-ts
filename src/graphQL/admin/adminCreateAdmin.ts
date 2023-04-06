import checkFirebaseErrors from "../../controllers/checkFirebaseErrors.js";
import { Context } from "../../../apollo/context.js";
import customError from "../../controllers/errors/customError.js";

export const adminCreateAdmin = async (_, __, { admin, req }: Context) => {
  let token;
  try {
    token = await admin.auth().verifyIdToken(req.headers.authorization);
  } catch (e) {
    checkFirebaseErrors(e);
  }

  //   if (!token?.isAdmin) {
  //     customError({
  //       code: "403",
  //       path: "admin",
  //       message: "you must be an admin to access this function",
  //     });
  //   }

  await admin.auth().setCustomUserClaims(token.user_id, {
    isAdmin: true,
  });

  return true;
};
