import { gql } from "apollo-server-express";

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
    businessStatus: String
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
    orders(statuses: [String!]): [Order!]
  }

  type Product {
    id: ID
    score: Float
    name: String
    status: String
    canBuy: Boolean
    createdAt: String
    updatedAt: String
    info: ProductInfo
    location: Location
    shopInfo: ShopInfo
    price: Price
    orderCounter: Int
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
    businessStatus: String
    name: String
    createdAt: String
    status: String
    photo: String
    isDigitalOnly: Boolean
    info: ShopInformations
    address: AddressShop
    products(limit: Int!, offset: Int!, see: String): [Product!]
    orders(statuses: [String!]): [Order!]
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

  type Order {
    id: ID
    cartId: ID
    status: String
    code: String
    createdAt: String
    checkoutSessionId: String
    chargeId: String
    history: [HistoryOrder!]
    user: UserOrder
    recipient: RecipientOrder
    totalDetails: TotalDetailsOrder
    shop: ShopOrder
    shipping: ShippingOrder
    productVariations: [ProductVariationsOrder!]
  }

  type HistoryOrder {
    status: String
    date: String
  }

  type RecipientOrder {
    name: String
    phone: String
    address: UserOrderAddress
  }

  type UserOrder {
    id: ID
    email: String
    stripeId: String
    firebaseId: String
    name: String
    surname: String
  }

  type UserOrderAddress {
    city: String
    country: String
    line1: String
    line2: String
    postalCode: String
    state: String
  }

  type TotalDetailsOrder {
    amountDiscount: Float
    amountShipping: Float
    amountTax: Float
    subTotal: Float
    total: Float
  }

  type ShopOrder {
    id: ID
    name: String
    stripeId: String
    businessId: ID
  }

  type ShippingOrder {
    url: String
    courier: String
    code: String
  }

  type ProductVariationsOrder {
    productId: ID
    variationId: ID
    photo: String
    name: String
    price: Price
    quantity: Int
    color: String
    size: String
    brand: String
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
    microCategory: String
  }

  input ProductSort {
    ascending: Boolean!
    for: String!
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
    quantity: Int!
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
    size: String!
    quantity: Int!
  }

  input EditOrderInput {
    url: String
    courier: String
    code: String
  }

  input InformationInput {
    userName: String!
    businessName: String!
    email: String!
    phone: String!
  }

  input productsNotAvailableInput {
    productId: ID!
    variationId: ID!
    size: String!
    reason: String
  }

  input AdminSeeAllOrdersFilters {
    status: String
    code: String
    id: ID
    user: AdminSeeAllOrdersFiltersUser
    shop: AdminSeeAllOrdersFiltersShop
    business: AdminSeeAllOrdersFiltersBusiness
  }

  input AdminSeeAllOrdersFiltersUser {
    email: String
    id: ID
    firebaseId: String
  }

  input AdminSeeAllOrdersFiltersShop {
    id: ID
  }

  input AdminSeeAllOrdersFiltersBusiness {
    id: ID
    firebaseId: String
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
      sort: ProductSort
      filters: ProductFilters
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
    business(id: ID!): Business

    #user
    user: User

    #cart
    cart(id: ID!): Cart!

    #order
    order(id: ID!): Order

    #constants
    brands: [String!]

    #admin
    adminSeeAllOrders(
      offset: Int!
      limit: Int!
      filters: AdminSeeAllOrdersFilters
    ): [Order!]
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
    refund(checkoutSessionId: String): Boolean
    productsNotAvailableRefund(
      orderId: ID!
      productsNotAvailable: [productsNotAvailableInput!]
    ): Boolean

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

    #order
    editOrder(id: ID!, options: EditOrderInput!): Boolean

    #Information
    createInformation(options: InformationInput!): Boolean

    #ADMIN
    adminCreateAdmin: Boolean
    adminCreateProduct(
      shopId: ID!
      options: ProductInput!
    ): CreateProductResponse
    adminEditProduct(id: ID!, options: EditProductInput!): ID!
    adminDeleteProduct(id: ID!): ID!
    adminLostPackage(orderId: ID!): Boolean
    adminOrderHasArrived(id: ID!): Boolean
  }
`;

export default typeDefs;
