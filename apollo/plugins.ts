import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";

const plugins: any[] = [];

if (process.env.NODE_ENV === "development") {
  plugins.push(ApolloServerPluginLandingPageGraphQLPlayground());
}

if (process.env.NODE_ENV === "testing") {
}

if (process.env.NODE_ENV === "production") {
  plugins.push(ApolloServerPluginLandingPageDisabled());
}

export default [];
