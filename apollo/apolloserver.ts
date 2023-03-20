import { ApolloServer } from "apollo-server-express";
import {
  ApolloError,
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
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
  // csrfPrevention: process.env.NODE_ENV !== "development",
  // introspection: process.env.NODE_ENV !== "production",
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()], //!disables apollo studio
  //TODO uncomment below when in production
  // plugins: [
  //   process.env.NODE_ENV === "production"
  //     ? ApolloServerPluginLandingPageDisabled()
  //     : ApolloServerPluginLandingPageGraphQLPlayground(),
  // ],
  validationRules: [depthLimit(7)],
  formatError: (err: any) => {
    let path = err.path;
    if (err.path === undefined) {
      path = "graphql fields";
    }

    const errorId = uuidv4();
    console.log("================================================");
    console.log(`errorId: ${errorId}`);
    console.log(`path: ${path}`);
    console.log(`message: ${err.extensions.customMessage || err.message}`);
    console.log(`date: ${new Date()}`);
    console.log("===============================================");

    // Don't give the specific errors to the client (in production)
    if (err.extensions!.code.startsWith("INTERNAL_SERVER_ERROR")) {
      if (process.env.NODE_ENV === "development") {
        return err;
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
        return {
          name: err.extensions.customMessage,
          code: err.extensions.customCode,
          path: err.extensions.customPath,
          message: "Internal Server Error",
          id: errorId,
        };
      }
    }

    if (err.extensions!.code.startsWith("GRAPHQL_VALIDATION_FAILED")) {
      if (process.env.NODE_ENV === "development") {
        return err;
      } else {
        return {
          name: err.message,
          code: "400",
          path: "fields",
          message: "Graphql Validation Failed",
          id: errorId,
        };
      }
    }

    return {
      name: err.extensions.code || "Unknow Error",
      code: "500",
      path: err.path[0] || "unknown",
      message: err.message || "unknown",
      id: errorId,
    };
  },
});

export default apolloserver;
