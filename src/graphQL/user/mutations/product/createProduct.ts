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
import { createVariations } from "../../../../controllers/mutations/createVariations";
import { forEach } from "lodash";

export const createProduct = async (
  _,
  { shopId, options },
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
    };
  }

  //TODO check status

  checkConstants(options, "product");

  checkPriceV2BelowV1(options);

  const shop = await shopById(shopId);

  //token operations
  if (process.env.NODE_ENV !== "development")
    authenticateToken(token.mongoId, shop.businessId, token.isBusiness);

  //calculate discount
  let discountPercentage = +(
    100 -
    (100 * options.price.v2) / options.price.v1
  ).toFixed(2);

  if (Number.isNaN(discountPercentage)) {
    discountPercentage = null;
  }

  options.price.discountPercentage = discountPercentage;

  const newProduct = await Product.create({
    ...options,
    location: {
      type: "Point",
      coordinates: shop.address.location.coordinates,
    },
    shopInfo: {
      id: shop.id,
      businessId: token.mongoId,
      name: shop.name,
      city: shop.address.city,
      status: shop.status,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // await createVariations(newProduct);

  return { id: newProduct.id };
};
