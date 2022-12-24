import { PrismaClient } from "@prisma/client";
import chalk from "chalk";
require("dotenv").config();

let database_url;

if(process.env.NODE_ENV === "production") {
  database_url = process.env.PROD_DATABSE_URL
} else {
  database_url = process.env.DEV_DATABSE_URL
}

export type Prisma = PrismaClient;

export const prisma = new PrismaClient({
    datasources: {
        db: {
          url: database_url,
        },
      },
});

console.log(chalk.bgGreen.black("Prisma client initialized"));
