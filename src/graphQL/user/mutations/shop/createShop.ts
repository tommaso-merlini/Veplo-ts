import { MutationCreateShopArgs } from "src/graphQL/types/types.js";
import { Context } from "../../../../../apollo/context.js";
import checkConstants from "../../../../controllers/checkConstants.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import { checkPostCode } from "../../../../controllers/checkPostCode.js";
import { createPostCode } from "../../../../controllers/createPostCode.js";
import { reverseGeocoding } from "../../../../controllers/reverseGeocoding.js";
import Shop from "../../../../schemas/Shop.model.js";
import businessById from "../../../../../src/controllers/queries/businessById.js";

export const createShop = async (
  _: any,
  { options }: MutationCreateShopArgs,
  { req, admin }: Context
) => {
  //token operations
  let token: any = {
    user_id: "prova",
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
    (options.address.location as any).coordinates[0],
    (options.address.location as any).coordinates[1]
  );

  throw new Error("ok");

  const postCodeExists = await checkPostCode(postCode);
  if (!postCodeExists) {
    createPostCode(postCode, city, center);
  }

  const business = await businessById(token.mongoId);

  (options.address as any).postcode = postCode;
  const newShop = await Shop.create({
    ...options,
    status: "not_active",
    businessStatus: business.status,
    createdAt: new Date(),
    businessId: token.mongoId,
  });

  return newShop.id;
};
