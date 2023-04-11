import resolvers from "../src/graphQL/resolvers.js";
import { admin } from "../firebase/firebase.js";
import s3Client from "../spaces/s3Client.js";
import stripe from "../stripe/stripe.js";
import { prisma } from "../prisma/initPrisma.js";

export interface Context {
  req: any;
  resolvers: any;
  admin: typeof admin;
  s3Client: typeof s3Client;
  stripe: typeof stripe;
  prisma: typeof prisma;
}

export const context = async ({ req }: any) => {
  return {
    req,
    resolvers,
    admin,
    s3Client,
    stripe,
    prisma,
  }; //* context variables for apollo
};
