import { PrismaClient } from "@prisma/client";
import chalk from "chalk";

export type Prisma = PrismaClient;

export const prisma = new PrismaClient();

console.log(chalk.bgGreen.black("Prisma client initialized"));
