import { Context } from "../../../../../apollo/context";
import authenticateToken from "../../../../controllers/authenticateToken";
import checkConstants from "../../../../controllers/checkConstants";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import shopById from "../../../../controllers/queries/shopById";
import streamToBlob from "../../../../controllers/streamToBlob";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { checkPriceV2BelowV1 } from "../../../../controllers/checkPriceV2BelowV1";
import Product from "../../../../schemas/Product.model";

export const createProduct = async (
  _,
  { shopId, options },
  { admin, req }: Context
) => {
  let token;
  console.log("foto arrivate");
  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  }

  //TODO check status

  // TODO checkConstants(options, "product");

  checkPriceV2BelowV1(options.variations);

  const shop = await shopById(shopId);

  //token operations
  if (process.env.NODE_ENV !== "development")
    authenticateToken(token.mongoId, shop.id, token.isBusiness);

  options.variations.map((variation) => {
    let discountPercentage = +(
      100 -
      (100 * variation.price.v2) / variation.price.v1
    ).toFixed(2);

    if (Number.isNaN(discountPercentage)) {
      discountPercentage = null;
    }

    variation.price.discountPercentage = discountPercentage;
  });

  const newProduct = await Product.create({
    ...options,
    location: {
      type: "Point",
      coordinates: shop.address.location.coordinates,
    },
    shopId: shopId,
    firebaseShopId: shop.firebaseId,
    shopInfo: {
      id: shop.id,
      firebaseId: shop.firebaseId,
      name: shop.name,
      city: shop.address.city,
      status: shop.status,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { id: newProduct.id };
};
