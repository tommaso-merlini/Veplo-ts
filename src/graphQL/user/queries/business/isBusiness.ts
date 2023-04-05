import { Context } from "../../../../../apollo/context.js";

export const isBusiness = async (_: any, __: any, { req, admin }: Context) => {
  //token operations
  const token = await admin.auth().verifyIdToken(req.headers.authorization);
  if (!token.isShop) {
    return false;
  } else {
    return true;
  }
};
