// @ts-nocheck

import express from "express";
import apolloserver from "../apollo/apolloserver";
import chalk from "chalk";
import rateLimit from "express-rate-limit";
import { GraphQLError } from "graphql";
import initMongoose from "../mongoose/initMongoose";
var mongoose = require("mongoose");
import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
require("dotenv").config();
import { graphqlUploadExpress } from "graphql-upload";
import compression from "compression";

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
app.use(
  compression({
    options: ["zlib"],
  })
);
const port = process.env.PORT || 3000;

function startServer() {
  initMongoose();
  mongoose.connection.on("connected", async function (ref) {
    console.log(chalk.bgGreen.black("Mongoose is connected to MongoDB"));
    app.use(graphqlUploadExpress());

    await apolloserver.start();
    await apolloserver.applyMiddleware({ app });

    app.use(limiter);

    app.get("/", (req, res) => {
      res.send("Hello World");
    });

    const blob = fs.readFileSync(__dirname + "/photos/wp6743882.jpeg");
    // Step 3: Define the parameters for the object you want to upload.

    // Step 5: Call the uploadObject function.
    //uploadObject();

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
}

startServer();
