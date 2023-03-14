import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import userById from "../../../../controllers/queries/userById";

export const user = async (_, ___, { admin, req }, info) => {
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
  const id = token.mongoId;
  const user = await userById(id, info);

  return user;
};
