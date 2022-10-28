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
    macroCategory: String
    microCategory: String
    gender: String
    brand: String
    location: Location
    shopId: ID!
    description: String
    firebaseShopId: String
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
    firebaseId: String
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
    macroCategory: String!
    microCategory: String!
    gender: String!
    brand: String!
    description: String
  }

  input ScheduleInput {
    opening: String!
    closing: String!
  }

  input DayInput {
    name: String!
    schedule: ScheduleInput!
  }

  input WeekInput {
    monday: DayInput!
    tuesday: DayInput!
    wednesday: DayInput!
    thursday: DayInput!
    friday: DayInput!
    saturday: DayInput!
    sunday: DayInput!
  }

  input ShopInput {
    name: String!
    location: LocationInput!
    week: WeekInput!
    street: String!
  }

  input LocationInput {
    type: String!
    coordinates: [Float!]!
  }

  input EditProductInput {
    name: String
    price: Float
    colors: [String!]
    sizes: [String!]
    macroCategory: String
    microCategory: String
    gender: String
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

    shop(id: ID!): Shop
  }

  type Mutation {
    #product
    createProduct(shopId: ID!, options: ProductInput!): Boolean!
    editProduct(id: ID!, options: EditProductInput!): Boolean!
    deleteProduct(id: ID!): Boolean!

    #shop
    createShop(options: ShopInput!): Boolean
  }
`;

export default typeDefs;
