// @ts-nocheck

import express from "express";
import apolloserver from "../apollo/apolloserver";
import chalk from "chalk";
import rateLimit from "express-rate-limit";
import { GraphQLError } from "graphql";
import initMongoose from "../mongoose/initMongoose";
var mongoose = require("mongoose");
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
require("dotenv").config();

process.on("uncaughtException", function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

const limiter = rateLimit({
  windowMs: 10 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();
const port = process.env.PORT || 3000;

function startServer() {
  initMongoose();
  mongoose.connection.on("connected", async function (ref) {
    console.log(chalk.bgGreen.black("Mongoose is connected to MongoDB"));
    await apolloserver.start();
    await apolloserver.applyMiddleware({ app });

    app.use(limiter);

    app.get("/", (req, res) => {
      res.send("Hello World");
    });

    app.listen(port, () => {
      console.log(
        chalk.bgGreen.black(`Express is listening at http://localhost:${port}`)
      );
      console.log(chalk.bgGreen.black(`Environment: ${process.env.NODE_ENV}`));
    });
  });

  // If the connection throws an error
  mongoose.connection.on("error", function (err) {
    console.error(
      chalk.bgRed.black("Failed to connect to MongoDB on startup "),
      err
    );
  });

  // When the connection is disconnected
  mongoose.connection.on("disconnected", function () {
    console.log(
      chalk.bgYellow.black(
        "Mongoose default connection to MongoDB is disconnected"
      )
    );
  });

  var gracefulExit = function () {
    mongoose.connection.close(function () {
      console.log(
        chalk.bgYellow.black(
          "Mongoose default connection to MongoDB is disconnected through app termination"
        )
      );
      process.exit(0);
    });
  };

  // If the Node process ends, close the Mongoose connection
  process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);

  // Step 2: The s3Client function validates your request and directs it to your Space's specified endpoint using the AWS SDK.
  const s3Client = new S3Client({
    endpoint: "htps://spaceprova1.fra1.digitaloceanspaces.com", // Find your endpoint in the control panel, under Settings. Prepend "https://".
    forcePathStyle: false, // Configures to use subdomain/virtual calling format.
    region: "eu-central-1", // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
    credentials: {
      accessKeyId: "DO00ED2V82BGGG2Z37LE", // Access key pair. You can create access key pairs using the control panel or API.
      secretAccessKey: "SsjLGakwxMXh0eEQA8l+XVadKv9tgNyPkFcEkEd+yUg", // Secret access key defined through an environment variable.
    },
  });

  // Step 3: Define the parameters for the object you want to upload.
  const params = {
    Bucket: "spaceprova1", // The path to the directory you want to upload the object to, starting with your Space name.
    Key: "hello-world.txt", // Object key, referenced whenever you want to access this file later.
    Body: "Hello, World!", // The object's contents. This variable is an object, not a string.
    ACL: "private", // Defines ACL permissions, such as private or public.
    Metadata: {
      // Defines metadata tags.
      "x-amz-meta-my-key": "your-value",
    },
  };

  // Step 4: Define a function that uploads your object using SDK's PutObjectCommand object and catches any errors.
  const uploadObject = async () => {
    try {
      const data = await s3Client.send(new PutObjectCommand(params));
      console.log(
        "Successfully uploaded object: " + params.Bucket + "/" + params.Key
      );
      return data;
    } catch (err) {
      console.log("Error", err);
    }
  };

  // Step 5: Call the uploadObject function.
  uploadObject();
}

startServer();
