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

  type User {
    id: ID
    name: String
    surname: String
    stripeId: String
    firebaseId: String
    email: String
    phone: String
    location: Location
    gender: String
    age: String
    createdAt: String
    carts: [Cart!]
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
  type VariationProductInfo {
    id: ID
    status: String
    canBuy: Boolean
    info: VariationProductInfoInfo
  }

  type VariationProductInfoInfo {
    gender: String
    macroCategory: String
    microCategory: String
    brand: String
  }

  type VariationShopInfo {
    id: ID
    name: String
    status: String
  }

  type Variation {
    id: ID
    color: String
    name: String
    updatedAt: String
    status: String
    price: Price
    photos: [String!]
    lots: [Lot!]
    product: VariationProductInfo
    shopInfo: VariationShopInfo
    location: Location
  }

  type CartShopInfo {
    id: ID
    name: String
    city: String
  }

  type CartProductVariation {
    id: ID
    photo: String
    name: String
    price: Price
    quantity: Int
    color: String
    size: String
    status: String
  }

  type Cart {
    id: ID
    userId: ID
    status: String
    shopInfo: CartShopInfo
    productVariations: [CartProductVariation!]
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
    photo: String
    isDigitalOnly: Boolean!
    info: ShopInputInfo!
    address: AddressShopInput!
  }

  input UserInput {
    name: String!
    surname: String!
    location: LocationInput
    gender: String
    age: Int
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

  input EditUserInput {
    name: String
    surname: String
    location: LocationInput
    gender: String
    phone: String
    age: Int
  }

  #=============QUERIES=================

  type Query {
    prova: String!

    #product
    product(id: ID!): Product
    productByVariationUniqueId(uniqueId: ID!): Product
    products(
      range: Float!
      limit: Int!
      offset: Int!
      filters: ProductFilters!
    ): [Product!]

    #variation
    variation(id: ID!): Variation
    variations(
      range: Float!
      limit: Int!
      offset: Int!
      filters: ProductFilters!
    ): [Variation!]

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

    #user
    user: User

    #cart
    cart(id: ID!): Cart!
  }

  #===================MUTATIONS===================

  type Mutation {
    #product
    createProduct(shopId: ID!, options: ProductInput!): CreateProductResponse
    editProduct(id: ID!, options: EditProductInput!): ID!
    changeProductStatus(id: ID!, status: String!): Boolean
    deleteProduct(id: ID!): ID!

    #variation
    deleteVariation(id: ID!): Boolean

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
      vatNumber: String!
      phone: String!
    ): String

    #cart
    addToCart(productVariationId: ID!, size: String!, quantity: Int!): Boolean

    #user
    createUser(options: UserInput!): ID!
    editUser(options: EditUserInput!): Boolean

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
