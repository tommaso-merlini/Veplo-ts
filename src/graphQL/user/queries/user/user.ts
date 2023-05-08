import { Context } from "apollo/context.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import userById from "../../../../controllers/queries/userById.js";

export const user = async (
  _: any,
  ___: any,
  { admin, req }: Context,
  info: any
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
      mongoId: "6410ace3850a8aeb92bcbc9e",
    };
  }
  const id = token?.mongoId;
  const user = await userById(id, info);

  return user;
};
