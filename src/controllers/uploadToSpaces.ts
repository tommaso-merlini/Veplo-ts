import sharp from "sharp";
import streamToBlob from "./streamToBlob.js";
import crypto from "crypto";
import s3Client from "../../spaces/s3Client.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
// import { finished } from "stream/promises";
import dotenv from "dotenv";
dotenv.config();

const uploadToSpaces = async (photos: any, shop: any) => {
  let imageIds = [];
  let resolutionWidth = 1528;
  let resolutionHeight = 2200;
  if (shop !== undefined && shop !== null) {
    resolutionWidth = 720;
    resolutionHeight = 450;
  }

  for (let i = 0; i < photos.length; i++) {
    const { createReadStream, filename, mimetype, encoding } = await photos[i];
    const stream = await createReadStream();
    // stream.pipe(stream);
    // await finished(stream);
    let blob: any = await streamToBlob(stream);
    console.log(`foto numero ${i} convertita`);
    blob = sharp(blob).resize(resolutionWidth, resolutionHeight);

    const newBlob = await streamToBlob(blob);

    const id = crypto.randomUUID();

    imageIds.push(id);

    const params: any = {
      Bucket: process.env.BUCKET_NAME, // The path to the directory you want to upload the object to, starting with your Space name.
      Key: id, // Object key, referenced whenever you want to access this file later.
      Body: newBlob, // The object's contents. This variable is an object, not a string.
      ACL: "public-read", // Defines ACL permissions, such as private or public.
      ContentType: "image/webp",
    };

    await s3Client.send(new PutObjectCommand(params));
    console.log(`foto numero ${i} uploadata`);
  }
  return imageIds;
};

export default uploadToSpaces;
