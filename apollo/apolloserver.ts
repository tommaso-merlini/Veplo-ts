//=============/Apollo/=============//
import { ApolloServer } from "apollo-server-express";
import depthLimit from "graphql-depth-limit";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "../src/graphQL/typeDefs";
import resolvers from "../src/graphQL/resolvers";

const context = ({ req }: { req: Request }) => {
  return {
    req,
    resolvers,
  }; //* context variables for apollo
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloserver = new ApolloServer({
  schema,
  context: context,
  introspection: process.env.NODE_ENV !== "production",
  validationRules: [depthLimit(3)],
  formatError: (err) => {
    // Don't give the specific errors to the client (in production)
    if (
      err.extensions!.code.startsWith("INTERNAL_SERVER_ERROR") &&
      process.env.NODE_ENV === "production"
    ) {
      return new Error(`internal server error`);
    }

    if (
      err.extensions!.code.startsWith("INTERNAL_SERVER_ERROR") &&
      process.env.NODE_ENV === "testing"
    ) {
      return new Error(`internal server error -> ${err.message}`);
    }

    if (
      err.extensions!.code.startsWith("GRAPHQL_VALIDATION_FAILED") &&
      process.env.NODE_ENV === "production"
    ) {
      return new Error("bad graphql fields");
    }

    if (
      err.extensions!.code.startsWith("GRAPHQL_VALIDATION_FAILED") &&
      process.env.NODE_ENV === "production"
    ) {
      return new Error("graphql validation failed");
    }

    return err;
  },
});

export default apolloserver;
