import resolvers from "../src/graphQL/resolvers";
import { prisma } from "../prisma/prisma";
import { Prisma } from "../prisma/prisma";
import { admin, db, FieldValue } from "../firebase/firebase";

export interface Context {
  prisma: Prisma;
  req: any;
  resolvers: any;
  admin: typeof admin;
  db: typeof db;
  FieldValue: typeof FieldValue;
}

export const context = async ({ req }) => {
  return {
    req,
    resolvers,
    prisma,
    db,
    admin,
    FieldValue,
  }; //* context variables for apollo
};
