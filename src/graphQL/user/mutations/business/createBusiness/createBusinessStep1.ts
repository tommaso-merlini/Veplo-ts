import { Context } from "../../../../../../apollo/context";
import checkFirebaseErrors from "../../../../../controllers/checkFirebaseErrors";
import Business from "../../../../../schemas/Business.model";

export const createBusinessStep1 = async (_, {}, { req, admin }: Context) => {
  //token operations
  let token: any = {
    uid: "prova",
    isBusiness: true,
    email: "prova@prova.com",
  };
  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  }

  const alreadyExists = await Business.findOne({
    firebaseId: token.user_id,
  });

  if (alreadyExists) {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "409",
        customPath: "business",
        customMessage: "already exists",
      },
    });
  }

  const newBusiness = await Business.create({
    firebaseId: token.user_id,
    email: token.email,
    status: "stripe_id_requested",
    createdAt: new Date(),
  });

  if (token.email === "business@veplo.it") {
    await admin.auth().setCustomUserClaims(token.user_id, {
      isBusiness: true,
      isAdmin: true,
      mongoId: newBusiness.id,
    });
  } else {
    if (process.env.NODE_ENV !== "development") {
      await admin.auth().setCustomUserClaims(token.user_id, {
        isBusiness: true,
        mongoId: newBusiness.id,
      });
    }
  }

  return newBusiness.id;
};
