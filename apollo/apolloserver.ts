import { ApolloServer } from "apollo-server-express";
import {
  ApolloError,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import depthLimit from "graphql-depth-limit";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "../src/graphQL/typeDefs";
import resolvers from "../src/graphQL/resolvers";
import { context } from "./context";
import { v4 as uuidv4 } from "uuid";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const apolloserver = new ApolloServer({
  schema,
  cache: "bounded",
  context: context,
  introspection: process.env.NODE_ENV !== "production",
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()], //!disables apollo studio
  validationRules: [depthLimit(3)],
  formatError: (err: any) => {
    // Don't give the specific errors to the client (in production)
    if (
      err.extensions!.code.startsWith("INTERNAL_SERVER_ERROR") &&
      process.env.NODE_ENV === "production"
    ) {
      if (err.originalError instanceof ApolloError) {
        const errorId = uuidv4();
        console.log("============================");

        console.log(`errorId: ${errorId}`);
        console.log(`path: ${err.path}`);
        console.log(`date: ${new Date()}`);
        console.log("============================");
        return new Error(
          `internal server error -> error id: ${errorId} | save the error id and contact ${process.env.CONTACT_EMAIL} for more informations`
        );
      } else {
        return new Error(`internal server error`);
      }
    }

    if (
      err.extensions!.code.startsWith("GRAPHQL_VALIDATION_FAILED") &&
      process.env.NODE_ENV === "production"
    ) {
      return new Error("bad graphql fields");
    }

    return err;
  },
});

export default apolloserver;
