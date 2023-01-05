const { gql } = require("apollo-server-express");

const typeDefs = gql`
  #===========SCALARS===============
  scalar Upload

  #===========TYPES===============
  type Location {
    type: String!
    coordinates: [Float!]!
  }

  type ShopOptions {
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
    shopOptions: ShopOptions
    photos: [String!]
    updatedAt: String
    createdAt: String
    discount: Int
    discountedPrice: Int
  }

  type Shop {
    id: ID
    name: String
    status: String
    products(limit: Int!, offset: Int!): [Product!]
    firebaseId: String
    address: AddressShop
    #macroCategories: [String!]
    description: String
    createdAt: String
    #gender: [String!]
    photo: String
    piva: String
    phone: String
    opening: Opening
  }

  type CreateProductResponse {
    id: ID!
    photos: [String!]!
  }

  #===========INPUTS===============

  input ProductFilters {
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

  input ShopFilters {
    cap: String!
    name: String
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
    photos: [Upload!]!
    discount: Int
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
    discount: Int
    newPhotos: [Upload!]
    deletedPhotos: [String!]
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
      filters: ProductFilters!
    ): [Product!]

    #shop
    shop(id: ID!): Shop
    shopByFirebaseId(firebaseId: String!): Shop
    isShop: Boolean!
    shops(
      range: Int!
      limit: Int!
      offset: Int!
      filters: ShopFilters!
    ): [Shop!]!
  }

  #===================MUTATIONS===================

  type Mutation {
    #product
    createProduct(shopId: ID!, options: ProductInput!): CreateProductResponse
    editProduct(id: ID!, options: EditProductInput!): ID!
    deleteProduct(id: ID!): ID!

    #shop
    createShop(options: ShopInput!): ID!
    setIsShop(isShop: Boolean!): Boolean!
    #TODO editShop

    #image
    createImage(files: [Upload!]!): Boolean!
  }
`;

export default typeDefs;
