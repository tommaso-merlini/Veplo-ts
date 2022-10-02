import resolvers from "../src/graphQL/resolvers";
import { prisma } from "../prisma/prisma";
import { Prisma } from "../prisma/prisma";

export interface Context {
  prisma: Prisma;
  req: Request;
  resolvers: any;
}

export const context = async ({ req }) => {
  return {
    req,
    resolvers,
    prisma,
  }; //* context variables for apollo
};
