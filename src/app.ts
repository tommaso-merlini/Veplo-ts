import express, { Response } from "express";
import chalk from "chalk";
// import { GraphQLError } from "graphql";
import initMongoose from "../mongoose/initMongoose.js";
import apolloserver from "../apollo/apolloserver.js";
//@ts-ignore
import { expressMiddleware } from "@apollo/server/express4";

import { context } from "../apollo/context.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
// import bodyParser from "body-parser";
// import { PutObjectCommand } from "@aws-sdk/client-s3";
// import fs from "fs";
// import cluster from "cluster";
// import os from "os";
import crypto from "crypto";
import stripe from "../stripe/stripe.js";
import { handleAccountUpdated } from "./controllers/stripe/handleAccountUpdated.js";
import { constants } from "../constants/constants.js";
import { handleCheckoutCompleted } from "./controllers/stripe/handleCheckoutCompleted.js";
import { handleCheckoutAsyncPaymentSuccedeed } from "./controllers/stripe/handleCheckoutAsyncPaymentSuccedeed.js";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import dotenv from "dotenv";
import { handleChargeRefunded } from "./controllers/stripe/handleChargeRefunded.js";
dotenv.config();
process.on("uncaughtException", function (err) {
  const errorId = crypto.randomUUID();
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
// const numCpus = os.cpus().length;
let endpointSecretCheckout: string;
let endpointSecretAccount: string;

if (process.env.NODE_ENV === "development") {
  endpointSecretAccount = process.env.STRIPE_WEBHOOK_SECRET_DEV || "";
  endpointSecretCheckout = process.env.STRIPE_WEBHOOK_SECRET_DEV || "";
}

if (process.env.NODE_ENV === "testing") {
  endpointSecretAccount = process.env.STRIPE_WEBHOOK_ACCOUNT_SECRET_TEST || "";
  endpointSecretCheckout =
    process.env.STRIPE_WEBHOOK_CHECKOUT_SECRET_TEST || "";
}

if (process.env.NODE_ENV === "production") {
  endpointSecretAccount = process.env.STRIPE_WEBHOOK_ACCOUNT_SECRET_PROD || "";
  endpointSecretCheckout =
    process.env.STRIPE_WEBHOOK_CHECKOUT_SECRET_PROD || "";
}

async function startServer() {
  // if (cluster.isPrimary) {
  //   for (let i = 0; i < numCpus; i++) {
  //     cluster.fork();
  //   }
  // } else {
  await initMongoose();
  mongoose.connection.on("connected", async function () {
    console.log(chalk.bgGreen.black("Mongoose is connected to MongoDB"));
    app.use(graphqlUploadExpress());

    await apolloserver.start();
    app.use(
      "/graphql",
      cors<cors.CorsRequest>(),
      bodyParser.json(),
      expressMiddleware(apolloserver, {
        context,
      })
    );
    // await apolloserver.applyMiddleware({ app });

    // app.use(limiter);

    app.get("/", (req, res: Response) => {
      res.send({ status: "ok" });
    });

    app.get("/brands", (req, res: Response) => {
      const brands = constants.brands;

      res.send(brands);
    });

    app.get("/categories", (req, res: Response) => {
      const categories = constants.genders;

      res.send(categories);
    });

    // app.use(express.json());

    app.post(
      "/webhook/account",
      express.raw({ type: "application/json" }),
      async (request, response) => {
        const sig: any = request.headers["stripe-signature"];

        let event;

        try {
          event = stripe.webhooks.constructEvent(
            request.body,
            sig,
            endpointSecretAccount
          );
        } catch (err) {
          console.log(err.message);
          response.status(400).send(`Webhook Error: ${err.message}`);
          return;
        }

        try {
          switch (event.type) {
            case "account.updated":
              handleAccountUpdated(event.data.object);
              break;

            default:
              if (process.env.NODE_ENV !== "production") {
                console.log(`event.type not handled`);
              }
          }
        } catch (e) {
          console.log(e.message);
          response.status(400).send(`Error: ${e.message}`);
          return;
        }

        // Return a 200 response to acknowledge receipt of the event
        response.send();
      }
    );

    app.post(
      "/webhook/checkout",
      express.raw({ type: "application/json" }),
      async (request, response) => {
        const sig: any = request.headers["stripe-signature"];

        let event;

        try {
          event = stripe.webhooks.constructEvent(
            request.body,
            sig,
            endpointSecretCheckout
          );
        } catch (err) {
          // console.log(err.message);
          response.status(400).send(`Webhook Error: ${err.message}`);
          return;
        }

        try {
          switch (event.type) {
            case "checkout.session.completed":
              await handleCheckoutCompleted(event.data.object);
              break;
            case "checkout.session.async_payment_succeeded":
              await handleCheckoutAsyncPaymentSuccedeed(event.data.object);
              break;
            case "checkout.session.async_payment_failed":
              console.log("bisogna mandare la mail");
            case "charge.refunded":
              handleChargeRefunded(event.data.object);
              break;

            default:
              if (process.env.NODE_ENV !== "production") {
                console.log(`event.type not handled`);
              }
          }
        } catch (e) {
          console.log("ciao");
          console.log(e.message);
          response.status(400).send(`Error: ${e.message}`);
          return;
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
  mongoose.connection.on("error", function (err: Error) {
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
