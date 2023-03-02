import { Context } from "../../../../../apollo/context";
import checkConstants from "../../../../controllers/checkConstants";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import { checkPostCode } from "../../../../controllers/checkPostCode";
import { createPostCode } from "../../../../controllers/createPostCode";
import { reverseGeocoding } from "../../../../controllers/reverseGeocoding";
import uploadToSpaces from "../../../../controllers/uploadToSpaces";
import Shop from "../../../../schemas/Shop.model";

export const createShop = async (_, { options }, { req, admin }: Context) => {
  //token operations
  let token: any = {
    uid: "prova",
    isBusiness: true,
    mongoId: "63fcea8f60c595a4975d71dc",
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

  checkConstants(options, "shop");
  let { center, city, postCode }: any = await reverseGeocoding(
    options.address.location.coordinates[0],
    options.address.location.coordinates[1]
  );

  const postCodeExists = await checkPostCode(postCode);
  if (!postCodeExists) {
    createPostCode(postCode, city, center);
  }

  options.address.postcode = postCode;
  const newShop = await Shop.create({
    ...options,
    status: "not_active",
    createdAt: new Date(),
    businessId: token.mongoId,
  });

  return newShop.id;
};
