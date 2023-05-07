import express, { Response } from "express";
import chalk from "chalk";
// import { GraphQLError } from "graphql";
import initMongoose from "../mongoose/initMongoose.js";
//@ts-ignore
import { expressMiddleware } from "@apollo/server/express4";

import { context } from "../apollo/context.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
// import bodyParser from "body-parser";
// import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
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
import { handleCheckoutAsyncPaymentFailed } from "./controllers/stripe/handleCheckoutAsyncPaymentFailed.js";
import { generateProducts } from "../mongoose/scripts/generateProducts.js";
import path from "path";
import { generateCode } from "./controllers/generateCode.js";
import { migration2 } from "../migration/2.js";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";
import depthLimit from "graphql-depth-limit";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "../src/graphQL/typeDefs.js";
import resolvers from "../src/graphQL/resolvers.js";
import { formatError } from "../apollo/formatError.js";
import plugins from "../apollo/plugins.js";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import sgMail from "@sendgrid/mail";
import { getOrderReceived } from "./controllers/html/getOrderReceived.js";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const port = Number(process.env.PORT) || 3000;
const appId = generateCode();

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

//========/REST API/========/
app.get("/", (req, res: Response) => {
  res.send({ status: "ok", process_id: appId });
});

app.get("/brands", (req, res: Response) => {
  const brands = constants.brands;

  res.send(brands);
});

app.get("/categories", (req, res: Response) => {
  const categories = constants.genders;

  res.send(categories);
});

app.get("/loaderio-04cbc2e6e8994582817d57faa8742ee5", function (req, res) {
  res.sendFile(
    path.resolve("./loaderio-04cbc2e6e8994582817d57faa8742ee5.html")
  );
});

//========/WEBHOOKS/========/
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
      console.log(e);
      response.status(400).send(`{
          defaultError: ${e.message},
          customError: {
            code: ${e.extensions.customCode},
            path: ${e.extensions.customPath},
            message: ${e.extensions.customMessage},
          }
        }`);
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
          handleCheckoutAsyncPaymentFailed(event.data.object);
          break;
        case "charge.refunded":
          handleChargeRefunded(event.data.object);
          break;

        default:
          if (process.env.NODE_ENV !== "production") {
            console.log(`event.type not handled`);
          }
      }
    } catch (e) {
      console.log(e);
      response.status(400).send(`{
          defaultError: ${e.message},
          customError: {
            code: ${e.extensions.customCode},
            path: ${e.extensions.customPath},
            message: ${e.extensions.customMessage},
          }
        }`);
      return;
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

async function startServer() {
  //========/MONGODB/========/
  await initMongoose();

  //========/APOLLO SERVER/========/
  app.use(graphqlUploadExpress());

  const apolloserver = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: process.env.NODE_ENV !== "development",
    // introspection: process.env.NODE_ENV !== "production",
    introspection: true,
    cache: new InMemoryLRUCache({
      // ~100MiB
      maxSize: Math.pow(2, 20) * 100,
      // 5 minutes (in milliseconds)
      ttl: 300_000,
    }),
    // cache: "bounded",

    //TODO uncomment below when in production
    plugins: [...plugins, ApolloServerPluginDrainHttpServer({ httpServer })],
    validationRules: [depthLimit(7)],
    formatError,
  });

  await apolloserver.start();
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(apolloserver, {
      context,
    })
  );

  //========/START APP/========/
  httpServer.listen({ port: port }, async () => {
    console.log(chalk.bgGreen.black(`process ID: ${process.pid}`));
    console.log(
      chalk.bgGreen.black(`server is listening at http://localhost:${port}`)
    );
    console.log(chalk.bgGreen.black(`Environment: ${process.env.NODE_ENV}`));
    // await generateProducts();
  });
}

startServer();

const gracefulExit = () => {
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

process.on("uncaughtException", function (err) {
  const errorId = crypto.randomUUID();
  console.log("================================================");
  console.log(`message: ${err.message}`);
  console.log(`errorId: ${errorId}`);
  console.log(`date: ${new Date()}`);
  console.log("===============================================");
});
