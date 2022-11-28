// @ts-nocheck

import express from "express";

import apolloserver from "../apollo/apolloserver";
import chalk from "chalk";
import rateLimit from "express-rate-limit";
import { GraphQLError } from "graphql";
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

async function startServer() {
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
  });
}

startServer();
