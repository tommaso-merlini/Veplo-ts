import { Context } from "../../../../../apollo/context";

export const isBusiness = async (_, __, { req, admin }: Context) => {
  //token operations
  const token = await admin.auth().verifyIdToken(req.headers.authorization);
  if (!token.isShop) {
    return false;
  } else {
    return true;
  }
};
