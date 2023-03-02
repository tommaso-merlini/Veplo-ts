const { gql } = require("apollo-server-express");

const typeDefs = gql`
  #===========SCALARS===============
  scalar Upload

  #===========TYPES===============
  type Location {
    type: String!
    coordinates: [Float!]!
  }

  type ShopInfo {
    id: ID
    firebaseId: String
    name: String
    city: String!
    status: String!
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

  type Price {
    v1: Float
    v2: Float
    discountPercentage: Float
  }

  type Stripe {
    id: String
  }

  type ProductInfo {
    gender: String
    macroCategory: String
    microCategory: String
    brand: String
  }

  type Lot {
    size: String
    quantity: Int
  }

  type ProductVariation {
    id: ID
    color: String
    status: String
    price: Price
    photos: [String!]
    lots: [Lot!]
  }

  type Business {
    firebaseId: String!
    vatNumber: String
    email: String!
    businessName: String
    phone: String
    status: String!
    createdAt: String
    stripe: Stripe
    shops: [Shop!]
  }

  type Product {
    id: ID
    name: String
    status: String
    canBuy: Boolean
    createdAt: String
    updatedAt: String
    info: ProductInfo
    location: Location
    shopInfo: ShopInfo
    variations: [ProductVariation!]
  }

  type ShopInformations {
    phone: String
    description: String
    opening: Opening
  }

  type Shop {
    id: ID
    businessId: ID
    name: String
    createdAt: String
    status: String
    photo: String
    isDigitalOnly: Boolean
    info: ShopInformations
    address: AddressShop
    products(limit: Int!, offset: Int!, see: String): [Product!]
  }

  type CreateProductResponse {
    id: ID!
    photos: [String!]!
  }

  #===========INPUTS===============

  input ProductFilters {
    colors: [String!]
    sizes: [String!]
    brand: String
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

  input PriceInput {
    v1: Float!
    v2: Float
  }

  input ProductInfoInput {
    gender: String!
    macroCategory: String!
    microCategory: String!
    brand: String!
  }

  input ProductLotInput {
    size: String!
    quantity: Int
  }

  input ProductVariationInput {
    color: String!
    status: String!
    price: PriceInput!
    photos: [String!]!
    lots: [ProductLotInput!]!
  }

  input EditPriceInput {
    v1: Float!
    v2: Float
  }

  input ProductInput {
    name: String!
    status: String!
    canBuy: Boolean!
    info: ProductInfoInput!
    variations: [ProductVariationInput!]!
  }

  input ShopInputInfo {
    phone: String!
    description: String
    opening: OpeningInput!
  }

  input ShopInput {
    name: String!
    photo: String!
    isDigitalOnly: Boolean!
    info: ShopInputInfo!
    address: AddressShopInput!
  }

  input EditProductInput {
    name: String
    price: EditPriceInput
    colors: [String!]
    sizes: [String!]
    macroCategory: String
    microCategory: String
    gender: String
    brand: String
    photos: [String!]
    status: String
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
    shops(
      range: Int!
      limit: Int!
      offset: Int!
      filters: ShopFilters!
    ): [Shop!]!

    #business
    isBusiness: Boolean!
    business(id: ID): Business
  }

  #===================MUTATIONS===================

  type Mutation {
    #product
    createProduct(shopId: ID!, options: ProductInput!): CreateProductResponse
    editProduct(id: ID!, options: EditProductInput!): ID!
    changeProductStatus(id: ID!, status: String!): Boolean
    deleteProduct(id: ID!): ID!

    #shop
    createShop(options: ShopInput!): ID!
    changeShopStatus(id: ID!, status: String!): Boolean
    #TODO editShop

    #image
    uploadImages(images: [Upload!]!, proportion: String!): [String!]!

    #business
    createBusinessStep1: ID!
    setIsBusiness(isBusiness: Boolean!): Boolean!

    #stripe
    createStripeAccount(
      businessName: String!
      vatId: String!
      phone: String!
    ): String

    #ADMIN
    adminCreateProduct(
      shopId: ID!
      options: ProductInput!
    ): CreateProductResponse
    adminEditProduct(id: ID!, options: EditProductInput!): ID!
    adminDeleteProduct(id: ID!): ID!
  }
`;

export default typeDefs;
