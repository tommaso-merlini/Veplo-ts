const { gql } = require("apollo-server-express");

const typeDefs = gql`
  #===========SCALARS===============
  scalar ISODate

  #===========TYPES===============
  type Location {
    type: String!
    coordinates: [Float!]!
  }

  type Lightshop {
    city: String!
    name: String
  }

  type Opening {
    days: [Int!]
    hours: [String!]
  }

  type AddressShop {
    postcode: String
    city: String
    street: String
    location: Location
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
    shopId: ID
    firebaseShopId: String
    shop: Lightshop
    photos: [String!]
    updatedAt: String
    createdAt: String
  }

  type Shop {
    id: ID
    name: String
    status: String
    products: [Product!]
    firebaseId: String
    address: AddressShop
    #macroCategories: [String!]
    description: [String!]
    createdAt: String
    #gender: [String!]
    photo: String
    piva: String
    phone: String
    opening: Opening
  }

  #===========INPUTS===============

  input Filters {
    colors: [String!]
    sizes: [String!]
    brands: [String!]
    minPrice: Int
    maxPrice: Int
    name: String
    cap: String!
    gender: String
    macroCategory: String
  }

  input LightShop {
    name: String
    city: String
  }

  input LocationInput {
    type: String!
    coordinates: [Float!]!
  }

  input AddressShopInput {
    city: String!
    street: String!
    location: LocationInput!
  }

  input OpeningInput {
    days: [Int!]!
    hours: [String!]!
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
    photos: [String!]
  }

  input ShopInput {
    name: String!
    address: AddressShopInput!
    description: String
    opening: OpeningInput!
    photo: String
    piva: String!
    phone: String!
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
    photos: [String!]
  }

  #=============QUERIES=================

  type Query {
    prova: String!

    #product
    product(id: ID!): Product
    products(
      range: Float!
      limit: Int!
      offset: Int!
      filters: Filters
    ): [Product!]

    #shop
    shop(id: ID!): Shop
    shopByFirebaseId(firebaseId: String!): Shop
    isShop: Boolean!
    shops(cap: String!, range: Int!, limit: Int!, offset: Int!): [Shop!]!
  }

  #===================MUTATIONS===================

  type Mutation {
    #product
    createProduct(shopId: ID!, options: ProductInput!): ID!
    editProduct(id: ID!, options: EditProductInput!): ID!
    deleteProduct(id: ID!): ID!

    #shop
    createShop(options: ShopInput!): ID!
    setIsShop(isShop: Boolean!): Boolean!
  }
`;

export default typeDefs;
