import { Context } from "../../../../../apollo/context.js";
import authenticateToken from "../../../../controllers/authenticateToken.js";
import checkConstants from "../../../../controllers/checkConstants.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import shopById from "../../../../controllers/queries/shopById.js";
import { checkPriceV2BelowV1 } from "../../../../controllers/checkPriceV2BelowV1.js";
import Product from "../../../../schemas/Product.model.js";
import { checkLotQuantity } from "../../../../controllers/checkLotQuantity.js";
import { MutationCreateProductArgs } from "src/graphQL/types/types.js";

export const createProduct = async (
  _,
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

  checkConstants(options, "product");

  checkPriceV2BelowV1(options);

  checkLotQuantity(options.variations);

  const shop = await shopById(shopId);

  //token operations
  if (process.env.NODE_ENV !== "development")
    authenticateToken(
      token?.mongoId,
      [String(shop.businessId)],
      token?.isBusiness
    );

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
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { id: newProduct.id };
};
