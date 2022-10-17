import express from "express";

import apolloserver from "../apollo/apolloserver";
import chalk from "chalk";
require("dotenv").config();

const app = express();
const port = process.env.PORT;

async function startServer() {
  await apolloserver.start();
  await apolloserver.applyMiddleware({ app });

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
