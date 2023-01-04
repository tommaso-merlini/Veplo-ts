import resolvers from "../src/graphQL/resolvers";
import { admin, db, FieldValue } from "../firebase/firebase";
import s3Client from "../spaces/s3Client";

export interface Context {
  req: any;
  resolvers: any;
  admin: typeof admin;
  db: typeof db;
  FieldValue: typeof FieldValue;
  s3Client: typeof s3Client;
}

export const context = async ({ req }) => {
  return {
    req,
    resolvers,
    db,
    admin,
    FieldValue,
    s3Client,
  }; //* context variables for apollo
};
