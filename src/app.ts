import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const port = 3000;
const prisma = new PrismaClient();

prisma.post.create({
  data: {
    title: "2",
    body: "2",
  },
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
