const { gql } = require("apollo-server-express");

const typeDefs = gql`
  #===========SCALARS===============
  scalar Upload

  #===========TYPES===============
  type Location {
    type: String
    coordinates: [Float!]
  }

  type ShopInfo {
    id: ID
    businessId: ID
    name: String
    city: String
    status: String
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
    fit: String
  }

  type Lot {
    size: String
    quantity: Int
  }

  type ProductVariation {
    id: ID
    color: String
    status: String
    photos: [String!]
    lots: [Lot!]
  }

  type Business {
    firebaseId: String
    vatNumber: String
    email: String
    businessName: String
    phone: String
    status: String
    createdAt: String
    stripe: Stripe
    shops: [Shop!]
  }

  type CartWarning {
    variationId: ID
    color: String
    size: String
    isSizeNonExisting: Boolean
    isQuantityTooMuch: Boolean
    isProductNonExisting: Boolean
    name: String
    quantity: Int
  }

  type UserCarts {
    carts: [Cart!]
    warnings: [CartWarning!]!
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
    carts: UserCarts
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
    price: Price
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
    photos: [String!]
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

  type CartShopInfo {
    id: ID
    name: String
    city: String
    status: String
  }

  type CartProductVariation {
    id: ID
    variationId: ID
    photo: String
    brand: String
    name: String
    quantity: Int
    color: String
    size: String
    status: String
    price: Price
    productId: ID
  }

  type Cart {
    id: ID
    userId: ID
    status: String
    shopInfo: CartShopInfo
    total: Float
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
    #cap: String
    gender: String
    macroCategory: String
  }

  input ShopFilters {
    cap: String
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
    fit: String!
  }

  input ProductLotInput {
    size: String!
    quantity: Int
  }

  input ProductVariationInput {
    color: String!
    status: String!
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
    price: PriceInput!
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
    dateOfBirth: String
  }

  input EditProductInput {
    canBuy: Boolean
    status: String
    name: String
    price: PriceInput
    info: EditProductInfo
  }

  input EditProductInfo {
    gender: String
    microCategory: String
    macroCategory: String
    brand: String
    fit: String
  }

  input EditUserInput {
    name: String
    surname: String
    location: LocationInput
    gender: String
    phone: String
  }

  input EditVariationInput {
    color: String
    status: String
    photos: [String!]!
    lots: [EditLotsInput!]!
  }

  input EditLotsInput {
    size: String
    quantity: Int
  }

  #=============QUERIES=================

  type Query {
    prova: String!

    #product
    product(id: ID!): Product
    productByVariationUniqueId(uniqueId: ID!): Product
    products(
      #range: Float!
      limit: Int!
      offset: Int!
      filters: ProductFilters!
    ): [Product!]

    #shop
    shop(id: ID!): Shop
    shopByFirebaseId(firebaseId: String!): Shop
    shops(
      #range: Int!
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
    checkout(shopId: ID!): String

    #cart
    addToCart(productVariationId: ID!, size: String!, quantity: Int!): Boolean
    removeFromCart(
      productVariationId: ID!
      size: String!
      quantity: Int!
    ): Boolean
    editCart(productVariationId: ID!, size: String!, quantity: Int!): Boolean
    deleteCart(shopId: ID!): Boolean

    #variation
    editVariation(id: ID!, options: EditVariationInput!): Boolean
    deleteVariation(id: ID!): Boolean
    createVariation(productId: ID!, options: ProductVariationInput!): Boolean

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
