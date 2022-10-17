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
    gender: String
    brand: String
    location: Location
    shopId: ID!
    description: String
  }

  type Schedule {
    opening: String!
    closing: String!
  }

  type Day {
    name: String!
    schedule: Schedule!
  }

  type Week {
    monday: Day!
    tuesday: Day!
    wednesday: Day!
    thursday: Day!
    friday: Day!
    saturday: Day!
    sunday: Day!
  }

  type Shop {
    id: ID
    name: String
    location: Location
    week: Week
    street: String
    status: String
    products: [Product!]
  }

  input Filters {
    colors: [String!]
    sizes: [String!]
    genders: [String!]
    brand: String
  }

  input ProductInput {
    name: String!
    price: Float!
    colors: [String!]!
    sizes: [String!]!
    category: String!
    types: [String!]!
    gender: String!
    brand: String!
    description: String
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

    shop(id: ID!): Shop
  }

  type Mutation {
    createProduct(shopId: ID!, options: ProductInput!): Boolean!
  }
`;

export default typeDefs;
