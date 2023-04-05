import resolvers from "../src/graphQL/resolvers.js";
import { admin, db, FieldValue } from "../firebase/firebase.js";
import s3Client from "../spaces/s3Client.js";
import stripe from "../stripe/stripe.js";

export interface Context {
  req: any;
  resolvers: any;
  admin: typeof admin;
  db: typeof db;
  FieldValue: typeof FieldValue;
  s3Client: typeof s3Client;
  stripe: typeof stripe;
}

export const context = async ({ req }: any) => {
  return {
    req,
    resolvers,
    db,
    admin,
    FieldValue,
    s3Client,
    stripe,
  }; //* context variables for apollo
};
