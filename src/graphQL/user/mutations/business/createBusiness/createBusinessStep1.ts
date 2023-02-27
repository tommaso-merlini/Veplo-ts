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

  if (!token.isBusiness && process.env.NODE_ENV !== "development") {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "403",
        customPath: "token",
        customMessage: "token's owner is not a business",
      },
    });
  }

  const alreadyExists = await Business.findOne({
    firebaseId: token.uid,
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
    firebaseId: token.uid,
    email: token.email,
    status: "onboarding_required",
    createdAt: new Date(),
  });

  if (token.email === "business@veplo.it") {
    await admin.auth().setCustomUserClaims(token.uid, {
      isBusiness: true,
      isAdmin: true,
      mongoId: newBusiness.id,
    });
  } else {
    if (process.env.NODE_ENV !== "development") {
      await admin.auth().setCustomUserClaims(token.uid, {
        isBusiness: true,
        mongoId: newBusiness.id,
      });
    }
  }

  return newBusiness.id;
};
