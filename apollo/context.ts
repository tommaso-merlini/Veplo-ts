import resolvers from "../src/graphQL/resolvers";
import { admin, db, FieldValue } from "../firebase/firebase";
import s3Client from "../spaces/s3Client";
import stripe from "../stripe/stripe";

export interface Context {
  req: any;
  resolvers: any;
  admin: typeof admin;
  db: typeof db;
  FieldValue: typeof FieldValue;
  s3Client: typeof s3Client;
  stripe: typeof stripe;
}

export const context = async ({ req }) => {
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
