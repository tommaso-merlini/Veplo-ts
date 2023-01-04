import sharp from "sharp";
import streamToBlob from "./streamToBlob";
import { uuidv4 } from "@firebase/util";
import s3Client from "../../spaces/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const uploadToSpaces = async (photos, metadata) => {
  let imageIds = [];
  for (let i = 0; i < photos.length; i++) {
    const { createReadStream, filename, mimetype, encoding } = await photos[i];
    const stream = await createReadStream();
    let blob: any = await streamToBlob(stream);

    //TODO resize based on type (shop or product)
    //TODO this resize is too much heavy
    blob = sharp(blob).resize(1801, 2600);

    const newBlob = await streamToBlob(blob);

    const id = uuidv4();

    imageIds.push(id);

    const params: any = {
      Bucket: "spaceprova1", // The path to the directory you want to upload the object to, starting with your Space name.
      Key: id, // Object key, referenced whenever you want to access this file later.
      Body: newBlob, // The object's contents. This variable is an object, not a string.
      ACL: "public-read", // Defines ACL permissions, such as private or public.
      Metadata: metadata,
      ContentType: "image/webp",
    };

    await s3Client.send(new PutObjectCommand(params));
  }
  return imageIds;
};

export default uploadToSpaces;
