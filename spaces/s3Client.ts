import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const buckectSecret = process.env.BUCKET_SECRET || "";

// Step 2: The s3Client function validates your request and directs it to your Space's specified endpoint using the AWS SDK.
const s3Client = new S3Client({
  endpoint: "https://fra1.digitaloceanspaces.com", // Find your endpoint in the control panel, under Settings. Prepend "https://".
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  region: "eu-central-1", // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
  credentials: {
    accessKeyId: "DO00XGUBRJU3AVMWD9XX", // Access key pair. You can create access key pairs using the control panel or API.
    secretAccessKey: buckectSecret, // Secret access key defined through an environment variable.
  },
});

export default s3Client;
