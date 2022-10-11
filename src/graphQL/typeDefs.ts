const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Location {
    type: String!
    coordinates: [Float!]!
  }

  type Product {
    id: ID
    name: String
    price: Float
    colors: [String!]
    sizes: [String!]
    category: String
    types: [String!]
    genders: [String!]
    brand: String
    location: Location
    description: String
    #//TODO query SHOP all'interno della query PRODUCT
  }

  input Filters {
    colors: [String!]
    sizes: [String!]
    genders: [String!]
    brand: String
  }

  type Query {
    prova: String!

    product(id: ID!): Product

    products(
      name: String!
      coordinates: [Float]!
      range: Float!
      filters: Filters
    ): [Product!]
  }
`;

export default typeDefs;
