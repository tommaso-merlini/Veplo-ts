// @ts-nocheck

import express from "express";
import apolloserver from "../apollo/apolloserver";
import chalk from "chalk";
import rateLimit from "express-rate-limit";
import { GraphQLError } from "graphql";
import initMongoose from "../mongoose/initMongoose";
var mongoose = require("mongoose");
import bodyParser from "body-parser";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
require("dotenv").config();
require("events").EventEmitter.defaultMaxListeners = 100;
import { graphqlUploadExpress } from "graphql-upload";
import cluster from "cluster";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import stripe from "../stripe/stripe";
import { handleAccountUpdated } from "./controllers/stripe/handleAccountUpdated";

process.on("uncaughtException", function (err) {
  const errorId = uuidv4();
  console.log("================================================");
  console.log(`message: ${err.message}`);
  console.log(`errorId: ${errorId}`);
  console.log(`date: ${new Date()}`);
  console.log("===============================================");
});

// const limiter = rateLimit({
//   windowMs: 10 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

const app = express();
const port = process.env.PORT || 3000;
const numCpus = os.cpus().length;
let endpointSecret;

if (process.env.NODE_ENV === "development") {
  endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_TESTING_DEVELOPMENT;
}

if (process.env.NODE_ENV === "testing") {
  endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_TESTING;
}

async function startServer() {
  // if (cluster.isPrimary) {
  //   for (let i = 0; i < numCpus; i++) {
  //     cluster.fork();
  //   }
  // } else {
  await initMongoose();
  mongoose.connection.on("connected", async function (ref) {
    console.log(chalk.bgGreen.black("Mongoose is connected to MongoDB"));
    app.use(graphqlUploadExpress());

    await apolloserver.start();
    await apolloserver.applyMiddleware({ app });

    // app.use(limiter);

    app.get("/", (req, res) => {
      res.send({ status: "ok" });
    });

    // app.use(express.json());

    app.post(
      "/webhook",
      express.raw({ type: "application/json" }),
      (request, response) => {
        console.log("arriva");
        const sig = request.headers["stripe-signature"];

        console.log(request.body);
        console.log(sig);

        let event;

        try {
          event = stripe.webhooks.constructEvent(
            request.body,
            sig,
            endpointSecret
          );
        } catch (err) {
          console.log(err.message);
          response.status(400).send(`Webhook Error: ${err.message}`);
          return;
        }

        switch (event.type) {
          case "account.updated":
            handleAccountUpdated(event.data.object);
            console.log("ok");
            // Then define and call a function to handle the event payment_intent.succeeded
            break;

          default:
            if (process.env.NODE_ENV !== "production") {
              console.log(`event.type not handled`);
            }
        }

        // Return a 200 response to acknowledge receipt of the event
        response.send();
      }
    );

    app.listen(port, () => {
      console.log(chalk.bgGreen.black(`process ID: ${process.pid}`));
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
  // }
}

startServer();
