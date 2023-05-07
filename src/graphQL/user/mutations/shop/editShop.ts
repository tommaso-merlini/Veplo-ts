import {
  MutationCreateShopArgs,
  MutationEditShopArgs,
} from "src/graphQL/types/types.js";
import { Context } from "../../../../../apollo/context.js";
import checkConstants from "../../../../controllers/checkConstants.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import { checkPostCode } from "../../../../controllers/checkPostCode.js";
import { createPostCode } from "../../../../controllers/createPostCode.js";
import { reverseGeocoding } from "../../../../controllers/reverseGeocoding.js";
import Shop from "../../../../schemas/Shop.model.js";
import Product from "../../../../schemas/Product.model.js";
import businessById from "../../../../../src/controllers/queries/businessById.js";
import lodash from "lodash";
import customError from "../../../../../src/controllers/errors/customError.js";
import Business from "src/schemas/Business.model.js";

export const editShop = async (
  _: any,
  { id, options }: MutationEditShopArgs,
  { req, admin }: Context
) => {
  //token operations
  let token: any = {
    user_id: "prova",
    isBusiness: true,
    mongoId: "641f209eca22d34c3ca1ec1f",
  };
  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  }

  //check if token is business
  if (!token.isBusiness && process.env.NODE_ENV !== "development") {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "403",
        customPath: "token",
        customMessage: "token's owner is not a business",
      },
    });
  }

  //get the business
  const business = await businessById(token.mongoId);

  console.log(options);

  //get the shop
  const shop = await Shop.findByIdAndUpdate(id, options);

  if (!shop) {
    customError({
      code: "404",
      path: "id",
      message: "shop not found",
    });
  }

  //get the new address if inputted
  if (options.address != null) {
    let { center, city, postCode }: any = await reverseGeocoding(
      (options.address.location as any).coordinates[0],
      (options.address.location as any).coordinates[1]
    );

    const postCodeExists = await checkPostCode(postCode);
    if (!postCodeExists) {
      createPostCode(postCode, city, center);
    }

    (options.address as any).postcode = postCode;
  }

  //edit all products of the shop
  const shopInfoProduct = lodash.merge(
    {
      profilePhoto: shop.profilePhoto,
      name: shop.name,
      city: shop.address.city,
      status: shop.status,
      id: shop.id,
      businessId: shop.businessId,
      businessStatus: shop.businessStatus,
    },
    {
      ...(options.name != null && { name: options.name }),
      ...(options.profilePhoto != null && {
        profilePhoto: options.profilePhoto,
      }),
      ...(options.address != null && { city: options.address.city }),
      ...(options.status != null && { status: options.status }),
    }
  );

  //todo execute this only if teh ShopInfo changed
  await Product.updateMany(
    {
      "shopInfo.id": id,
    },
    {
      shopInfo: shopInfoProduct,
    }
  );

  return true;
};
