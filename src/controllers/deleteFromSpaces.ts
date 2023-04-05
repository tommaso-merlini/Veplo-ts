import s3Client from "../../spaces/s3Client.js";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const deleteFromSpaces = (photos) => {
  const objects = [];

  photos.map((photo) => {
    objects.push({ Key: photo });
  });
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Delete: {
      Objects: objects,
    },
  };

  s3Client.send(new DeleteObjectsCommand(params));
};

export default deleteFromSpaces;
