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
`;

export default typeDefs;
