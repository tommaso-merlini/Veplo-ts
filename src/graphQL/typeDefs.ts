const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Float!
    colors: [String!]!
    description: String
    sizes: [String!]!
    #//TODO query SHOP all'interno della query PRODUCT
  }

  type Query {
    prova: String!

    product(id: ID!): Product
  }
`;

export default typeDefs;
