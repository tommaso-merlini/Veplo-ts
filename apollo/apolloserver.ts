import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";
import depthLimit from "graphql-depth-limit";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "../src/graphQL/typeDefs.js";
import resolvers from "../src/graphQL/resolvers.js";
import crypto from "crypto";

const plugins: any[] = [];

if (process.env.NODE_ENV === "development") {
  plugins.push(ApolloServerPluginLandingPageGraphQLPlayground());
}

if (process.env.NODE_ENV === "testing") {
}

if (process.env.NODE_ENV === "production") {
  plugins.push(ApolloServerPluginLandingPageDisabled());
}

const apolloserver = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: process.env.NODE_ENV !== "development",
  // introspection: process.env.NODE_ENV !== "production",
  introspection: true,
  cache: new InMemoryLRUCache({
    // ~100MiB
    maxSize: Math.pow(2, 20) * 100,
    // 5 minutes (in milliseconds)
    ttl: 300_000,
  }),
  // cache: "bounded",

  //TODO uncomment below when in production
  plugins: plugins,
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
