const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    prova: String!
  }
`;

export default typeDefs;
