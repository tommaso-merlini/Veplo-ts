import { Context } from "../../../../../apollo/context.js";
import authenticateToken from "../../../../controllers/authenticateToken.js";
import checkConstants from "../../../../controllers/checkConstants.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import shopById from "../../../../controllers/queries/shopById.js";
import { checkPriceV2BelowV1 } from "../../../../controllers/checkPriceV2BelowV1.js";
import Product from "../../../../schemas/Product.model.js";
import { checkLotQuantity } from "../../../../controllers/checkLotQuantity.js";
import { MutationCreateProductArgs } from "src/graphQL/types/types.js";
import customError from "../../../../controllers/errors/customError.js";

export const createProduct = async (
  _: any,
  { shopId, options }: MutationCreateProductArgs,
  { admin, req }: Context
) => {
  let token;
  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  } else {
    token = {
      firebaseId: "prova",
      mongoId: "",
      isBusiness: true,
    };
  }

  //TODO check status

  if (options.info.keywords != null && options.info.keywords.length > 5) {
    customError({
      code: "422",
      path: "keywords",
      message: "maximum amount of weywords exedeed",
    });
  }

  //check price > 2
  if (options.price.v1 < 2 || options.price.v2 < 2) {
    //!minimum price
    customError({
      code: "400",
      path: `price`,
      message: "price cannot be < 2",
    });
  }

  checkPriceV2BelowV1(options);

  checkLotQuantity(options.variations);

  checkConstants(options, "product");

  throw new Error();

  const shop = await shopById(shopId);

  //token operations
  if (process.env.NODE_ENV !== "development")
    authenticateToken({
      tokenId: token?.mongoId,
      ids: [String(shop.businessId)],
      isBusiness: token?.isBusiness,
    });

  //calculate discount
  let discountPercentage: number | null = +(
    100 -
    (100 * options.price.v2) / options.price.v1
  ).toFixed(2);

  if (Number.isNaN(discountPercentage)) {
    discountPercentage = null;
  }

  (options.price as any).discountPercentage = discountPercentage;

  const newProduct = await Product.create({
    ...options,
    location: {
      type: "Point",
      coordinates: (shop as any).address.location.coordinates,
    },
    shopInfo: {
      id: shop.id,
      businessId: shop.businessId,
      name: shop.name,
      city: shop.address.city,
      status: shop.status,
      businessStatus: shop.businessStatus,
      profilePhoto: shop.profilePhoto,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { id: newProduct.id };
};
