import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import customError from "../../../../controllers/errors/customError.js";
import streamToBlob from "../../../../controllers/streamToBlob.js";
import sharp from "sharp";
import crypto from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { MutationUploadImagesArgs } from "src/graphQL/types/types.js";
import { Context } from "apollo/context.js";

export const uploadImages = async (
  _: any,
  { images, proportion }: MutationUploadImagesArgs,
  { s3Client, admin, req }: Context
) => {
  let token: any = {
    user_id: "prova",
    isBusiness: true,
  };
  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  }

  if (!token.isBusiness) {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "401",
        customPath: "authorization",
        customMessage: "the user is not authorized to uplaod images",
      },
    });
  }

  const promises = [];
  let width: number;
  let height: number;
  if (
    proportion != "product" &&
    proportion != "shopCover" &&
    proportion != "shopPhoto"
  ) {
    customError({
      code: "400",
      path: "image",
      message: "proportion can either be 'product' or 'shop'",
    });
  }

  if (proportion === "ShopCover") {
    width = 720;
    height = 450;
  }

  if (proportion === "ShopPhoto") {
    width = 500;
    height = 500;
  }

  if (proportion === "product") {
    width = 1528;
    height = 2220;
  }

  for (let i = 0; i < images.length; i++) {
    promises.push(
      new Promise(async (resolve) => {
        const { createReadStream } = await images[i];
        const stream = await createReadStream();
        // stream.pipe(stream);
        // await finished(stream);
        let blob: any = await streamToBlob(stream);
        // console.log(`foto numero ${i} convertita`);
        blob = sharp(blob).resize(width, height);

        const newBlob = await streamToBlob(blob);

        const id = crypto.randomUUID();

        const title = `${id}.webp`;

        const params: any = {
          Bucket: "veplo-images", // The path to the directory you want to upload the object to, starting with your Space name.
          Key: title, // Object key, referenced whenever you want to access this file later.
          Body: newBlob, // The object's contents. This variable is an object, not a string.
          ACL: "public-read", // Defines ACL permissions, such as private or public.
          ContentType: "image/webp",
        };
        try {
          await s3Client.send(new PutObjectCommand(params));
        } catch (e) {
          customError({
            code: "500",
            path: "upload image",
            message: "an error occured while uploading the image",
          });
        }

        resolve(title);
        // console.log(`foto numero ${i} risoluta: id ${id}`);
      })
    );
  }

  const ids = await Promise.all(promises);

  return ids;
};
