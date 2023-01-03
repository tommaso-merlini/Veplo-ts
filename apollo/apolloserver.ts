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
    let path = err.path;
    if (err.path === undefined) {
      path = "graphql fields";
    }

    const errorId = uuidv4();
    console.log("================================================");
    console.log(`errorId: ${errorId}`);
    console.log(`path: ${path}`);
    console.log(`message: ${err.extensions.customMessage}`);
    console.log(`date: ${new Date()}`);
    console.log("===============================================");

    // Don't give the specific errors to the client (in production)
    if (err.extensions!.code.startsWith("INTERNAL_SERVER_ERROR")) {
      if (process.env.NODE_ENV === "production") {
        return new Error("Internal server error");
      } else {
        if (!err.extensions.customCode) {
          err.extensions.customCode = "500";
        }
        if (!err.extensions.customPath) {
          err.extensions.customPath = err.path[0];
        }
        if (!err.extensions.customMessage) {
          err.extensions.customMessage = err.message;
        }
        const error = Object.assign(new Error("Internal server error"), {
          extensions: {
            code: err.extensions.customCode,
            path: err.extensions.customPath,
            message: err.extensions.customMessage,
            id: errorId,
          },
        });
        return error;
      }
    }

    if (err.extensions!.code.startsWith("GRAPHQL_VALIDATION_FAILED")) {
      if (process.env.NODE_ENV === "production") {
        return new Error("bad graphql fields");
      } else {
        const error = Object.assign(new Error("Graphql validation failed"), {
          extensions: {
            code: "400",
            path: "fields",
            message: err.message,
            id: errorId,
          },
        });
        return error;
      }
    }

    return err;
  },
});

export default apolloserver;
