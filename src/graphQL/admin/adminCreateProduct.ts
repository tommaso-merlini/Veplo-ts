import { Context } from "../../../apollo/context";
import checkConstants from "../../controllers/checkConstants";
import checkFirebaseErrors from "../../controllers/checkFirebaseErrors";
import shopById from "../../controllers/queries/shopById";
import streamToBlob from "../../controllers/streamToBlob";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import Product from "../../schemas/Product.model";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import customError from "../../controllers/errors/customError";

export const adminCreateProduct = async (
  _,
  { shopId, options },
  { admin, req, s3Client }: Context
) => {
  let token = {};
  const promises = [];
  console.log("foto arrivate");
  try {
    token = await admin.auth().verifyIdToken(req.headers.authorization);
  } catch (e) {
    checkFirebaseErrors(e);
  }

  if (!token.isAdmin) {
    customError({
      code: "403",
      path: "admin",
      message: "you must be an admin to access this function",
    });
  }

  checkConstants(options, "product");

  if (options.price.v2 != null && options.price.v2 > options.price.v1) {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "400",
        customPath: "price",
        customMessage: "pricev2 cannot be greater than pricev1",
      },
    });
  }

  if (options.price.v2 === options.price.v1) {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "400",
        customPath: "price",
        customMessage: "pricev2 cannot be the same of pricev1",
      },
    });
  }

  const shop = await shopById(shopId);

  //TODO handling the macroCategories => insert macroCategory into shop

  let discountPercentage = +(
    100 -
    (100 * options.price.v2) / options.price.v1
  ).toFixed(2);

  if (Number.isNaN(discountPercentage)) {
    discountPercentage = null;
  }

  options.price.discountPercentage = discountPercentage;

  for (let i = 0; i < options.photos.length; i++) {
    promises.push(
      new Promise(async (resolve, reject) => {
        const { createReadStream } = await options.photos[i];
        const stream = await createReadStream();
        // stream.pipe(stream);
        // await finished(stream);
        let blob: any = await streamToBlob(stream);
        console.log(`foto numero ${i} convertita`);
        blob = sharp(blob).resize(1528, 2200);

        const newBlob = await streamToBlob(blob);

        const id = uuidv4();

        const params: any = {
          Bucket: process.env.BUCKET_NAME, // The path to the directory you want to upload the object to, starting with your Space name.
          Key: id, // Object key, referenced whenever you want to access this file later.
          Body: newBlob, // The object's contents. This variable is an object, not a string.
          ACL: "public-read", // Defines ACL permissions, such as private or public.
          ContentType: "image/webp",
        };

        s3Client.send(new PutObjectCommand(params));
        resolve(id);
      })
    );
  }

  const photosId = await Promise.all(promises);

  const newProduct = await Product.create({
    ...options,
    location: {
      type: "Point",
      coordinates: shop.address.location.coordinates,
    },
    shopId: shopId,
    firebaseShopId: shop.firebaseId,
    shopOptions: {
      city: shop.address.city,
      name: shop.name,
      status: shop.status,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    photos: photosId,
    status: "active",
  });

  return { id: newProduct.id, photos: photosId };
};
