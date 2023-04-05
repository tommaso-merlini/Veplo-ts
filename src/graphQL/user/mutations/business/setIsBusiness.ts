import { Context } from "../../../../../apollo/context.js";

export const setIsBusiness = async (
  _: any,
  { isBusiness }: { isBusiness: Boolean },
  { req, admin }: Context
) => {
  const token = await admin.auth().verifyIdToken(req.headers.authorization);
  if (isBusiness === token.isBusiness) {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "304",
        customPath: "shop",
        customMessage: "business not modified",
      },
    });
  }
  if (token.email === "business@veplo.it") {
    await admin
      .auth()
      .setCustomUserClaims(token.user_id, { isBusiness, isAdmin: true });
  } else {
    await admin.auth().setCustomUserClaims(token.user_id, { isBusiness });
  }

  return true;
};
