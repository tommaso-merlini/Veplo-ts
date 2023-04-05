import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import depthLimit from "graphql-depth-limit";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "../src/graphQL/typeDefs.js";
import resolvers from "../src/graphQL/resolvers.js";
import crypto from "crypto";

const apolloserver = new ApolloServer({
  typeDefs,
  resolvers,
  cache: "bounded",
  csrfPrevention: process.env.NODE_ENV !== "development",
  // introspection: process.env.NODE_ENV !== "production",
  introspection: true,

  //TODO uncomment below when in production
  plugins: [
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
  validationRules: [depthLimit(7)],
  formatError: (err: any) => {
    let path = err.path;
    if (err.path === undefined) {
      path = "graphql fields";
    }

    const errorId = crypto.randomUUID();
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
          id: errorId,
          message: "Internal Server Error",
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
