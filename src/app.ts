import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const port = 3000;
const prisma = new PrismaClient();

async function main() {
  // Connect the client
  await prisma.$connect();
  // ... you will write your Prisma Client queries here
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
