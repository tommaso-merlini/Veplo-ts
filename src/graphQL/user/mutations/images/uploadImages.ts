import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import customError from "../../../../controllers/errors/customError";
import streamToBlob from "../../../../controllers/streamToBlob";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const uploadImages = async (
  _,
  { images, proportion },
  { s3Client, admin, req }
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
  let width = 1528;
  let height = 2220;
  if (proportion != "product" && proportion != "shop") {
    customError({
      code: "400",
      path: "image",
      message: "proportion can either be 'product' or 'shop'",
    });
  }

  if (proportion === "shop") {
    width = 720;
    height = 450;
  }
  for (let i = 0; i < images.length; i++) {
    promises.push(
      new Promise(async (resolve, reject) => {
        const { createReadStream } = await images[i];
        const stream = await createReadStream();
        // stream.pipe(stream);
        // await finished(stream);
        let blob: any = await streamToBlob(stream);
        // console.log(`foto numero ${i} convertita`);
        blob = sharp(blob).resize(width, height);

        const newBlob = await streamToBlob(blob);

        const id = uuidv4();

        const params: any = {
          Bucket: "veplo-images", // The path to the directory you want to upload the object to, starting with your Space name.
          Key: id, // Object key, referenced whenever you want to access this file later.
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

        resolve(id);
      })
    );
  }

  const Ids = await Promise.all(promises);

  return Ids;
};
