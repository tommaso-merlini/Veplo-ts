import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";
import depthLimit from "graphql-depth-limit";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "../src/graphQL/typeDefs.js";
import resolvers from "../src/graphQL/resolvers.js";
import crypto from "crypto";
import { formatError } from "./formatError.js";
import plugins from "./plugins.js";

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
  formatError,
});

export default apolloserver;
