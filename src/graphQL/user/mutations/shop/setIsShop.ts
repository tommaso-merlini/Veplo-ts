import { Context } from "../../../../../apollo/context";

export const setIsShop = async (_, { isShop }, { req, admin }: Context) => {
  const token = await admin.auth().verifyIdToken(req.headers.authorization);
  if (isShop === token.isShop) {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "304",
        customPath: "shop",
        customMessage: "shop not modified",
      },
    });
  }
  if (token.email === "business@veplo.it") {
    await admin
      .auth()
      .setCustomUserClaims(token.uid, { isShop, isAdmin: true });
  } else {
    await admin.auth().setCustomUserClaims(token.uid, { isShop });
  }

  return true;
};
