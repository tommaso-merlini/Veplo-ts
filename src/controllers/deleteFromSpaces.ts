import s3Client from "../../spaces/s3Client";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";

const deleteFromSpaces = (photos) => {
  const objects = [];

  photos.map((photo) => {
    objects.push({ Key: photo });
  });
  const params = {
    Bucket: "spaceprova1",
    Delete: {
      Objects: objects,
    },
  };

  s3Client.send(new DeleteObjectsCommand(params));
};

export default deleteFromSpaces;
