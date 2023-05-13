import { gql } from "apollo-server-express";

const typeDefs = gql`
  enum ShopProductsStatusesEnum {
    active
    not_active
  }

  enum imageProportionsEnum {
    shopCover
    shopPhoto
    product
  }
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
    profilePhoto: String
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
    traits: [String!]
    materials: [String!]
    length: String
    making: String
    collar: String
    keywords: [String!]
    description: String
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
    orders(statuses: [String!], limit: Int!, offset: Int!): [Order!]
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
    productsLikeThis(offset: Int!, limit: Int!, shopId: ID): [Product!]
  }

  type ProductsQueryResponse {
    products: [Product!]!
    filters: ProductFiltersResponse!
  }

  type ProductFiltersResponse {
    colors: [String]
    sizes: [String]
    brand: String
    minPrice: Int
    maxPrice: Int
    query: String
    gender: String
    macroCategory: String
    microCategory: String
    fit: String
    traits: [String]
    collar: String
    length: String
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
    profileCover: String
    profilePhoto: String
    isDigitalOnly: Boolean
    minimumAmountForFreeShipping: Int
    categories: [String!]
    info: ShopInformations
    address: AddressShop
    products(
      limit: Int!
      offset: Int!
      sort: ProductSort
      filters: ProductFilters
      statuses: [ShopProductsStatusesEnum!]
    ): ProductsQueryResponse!
    orders(statuses: [String!], limit: Int!, offset: Int!): [Order!]
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
    createdAt: String
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
    query: String
    #cap: String
    gender: String
    macroCategory: String
    microCategory: String
    fit: String
    traits: [String!]
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
    fit: String
    traits: [String]!
    materials: [String!]
    length: String
    making: String
    collar: String
    keywords: [String!]
    description: String
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
    profileCover: String
    profilePhoto: String
    isDigitalOnly: Boolean!
    minimumAmountForFreeShipping: Int
    categories: [String]!
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
    traits: [String!]
    length: String
    materials: [String]
    description: String
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

  input EditShopInput {
    name: String
    status: String
    profileCover: String
    profilePhoto: String
    isDigitalOnly: Boolean
    minimumAmountForFreeShipping: Int
    categories: [String!]
    info: EditShopInputInfo
    address: EditAddressShopInput
  }

  input EditShopInputInfo {
    phone: String
    description: String
    opening: OpeningInput
  }

  input EditAddressShopInput {
    city: String!
    street: String!
    location: LocationInput!
  }

  #=============QUERIES=================

  type Query {
    prova: String!

    #===================PRODUCT===================
    """
    get a single product
    """
    product(id: ID!): Product
    """
    get a list of products, you can use the filters and sort
    """
    products(
      #range: Float!
      limit: Int!
      offset: Int!
      sort: ProductSort
      filters: ProductFilters
    ): ProductsQueryResponse!
    """
    get a list of products with an autocomplete engine under the hood
    """
    productsAutoComplete(query: String!): [Product!]!

    #===================SHOP===================
    """
    get a single shop
    """
    shop(id: ID!): Shop
    """
    get a single shop searching by firebaseId
    """
    shopByFirebaseId(firebaseId: String!): Shop
    """
    get a list of shops, you can use the filters
    """
    shops(
      #range: Int!
      limit: Int!
      offset: Int!
      filters: ShopFilters!
    ): [Shop!]!

    #===================BUSINESS===================
    """
    check if the account is a business
    """
    isBusiness: Boolean!
    """
    get a single business
    """
    business(id: ID!): Business

    #===================USER===================
    """
    get a single user - id provided by the jwt
    """
    user: User

    #===================CART===================
    """
    get a single cart
    """
    cart(id: ID!): Cart!

    #===================ORDER===================
    """
    get a single order
    """
    order(id: ID!): Order

    #constants
    """
    get list of available brands
    """
    brands: [String!]

    #===================ADMIN===================
    """
    admin - get a list of all the orders
    """
    adminSeeAllOrders(
      offset: Int!
      limit: Int!
      filters: AdminSeeAllOrdersFilters
    ): [Order!]
  }

  #===================MUTATIONS===================

  type Mutation {
    #===================PRODUCT===================
    """
    create a single product
    """
    createProduct(shopId: ID!, options: ProductInput!): CreateProductResponse
    """
    edit a product
    """
    editProduct(id: ID!, options: EditProductInput!): ID!
    """
    change the status of a product
    """
    changeProductStatus(id: ID!, status: String!): Boolean
    """
    delete a product
    """
    deleteProduct(id: ID!): ID!

    #===================SHOP===================
    """
    create a shop
    """
    createShop(options: ShopInput!): ID!
    """
    change the status of a shop
    """
    changeShopStatus(id: ID!, status: String!): Boolean
    """
    change the status of a shop
    """
    editShop(id: ID!, options: EditShopInput!): Boolean

    #===================IMAGE===================
    """
    upload a list of images to the image bucket
    """
    uploadImages(
      images: [Upload!]!
      proportion: imageProportionsEnum!
    ): [String!]!

    #===================BUSINESS===================
    """
    the first step of creating a business
    """
    createBusinessStep1: ID!
    """
    change the isBusiness account field
    """
    setIsBusiness(isBusiness: Boolean!): Boolean!

    #===================STRIPE===================
    """
    create an account on stripe
    """
    createStripeAccount(
      businessName: String!
      vatNumber: String!
      phone: String!
    ): String
    """
    get a checkout url of a cart by providing the shopId, the userId is inside the jwt
    """
    checkout(shopId: ID!): String
    """
    refund an order
    """
    refund(checkoutSessionId: String): Boolean
    """
    shop refunds an order because the products are not available
    """
    productsNotAvailableRefund(
      orderId: ID!
      productsNotAvailable: [productsNotAvailableInput!]
    ): Boolean

    #===================CART===================
    """
    add products to the cart
    """
    addToCart(productVariationId: ID!, size: String!, quantity: Int!): Boolean
    """
    remove product form cart
    """
    removeFromCart(
      productVariationId: ID!
      size: String!
      quantity: Int!
    ): Boolean
    """
    edit a cart (you can add or remove)
    """
    editCart(productVariationId: ID!, size: String!, quantity: Int!): Boolean
    """
    delete a cart
    """
    deleteCart(shopId: ID!): Boolean

    #===================VARIATION===================
    """
    edit a single variation
    """
    editVariation(id: ID!, options: EditVariationInput!): Boolean
    """
    delete a variation
    """
    deleteVariation(id: ID!): Boolean
    """
    create a variation
    """
    createVariation(productId: ID!, options: ProductVariationInput!): Boolean

    #===================USER===================
    """
    create a user in mongodb
    """
    createUser(options: UserInput!): ID!
    """
    edit a user
    """
    editUser(options: EditUserInput!): Boolean

    #===================ORDER===================
    """
    edit an order
    """
    editOrder(id: ID!, options: EditOrderInput!): Boolean
    """
    user returns an order
    """
    returnOrder(id: ID!, why: String): Boolean
    """
    shop tells that a return order has arrived
    """
    returnedOrderHasArrived(id: ID!): Boolean

    #Information
    """
    create information
    """
    createInformation(options: InformationInput!): Boolean

    #===================ADMIN===================
    adminCreateAdmin: Boolean
    adminCreateProduct(
      shopId: ID!
      options: ProductInput!
    ): CreateProductResponse
    adminEditProduct(id: ID!, options: EditProductInput!): ID!
    adminDeleteProduct(id: ID!): ID!
    """
    tells that a package was lost
    """
    adminLostPackage(orderId: ID!): Boolean
    """
    tells that an order has arrived
    """
    adminOrderHasArrived(id: ID!): Boolean
  }
`;

export default typeDefs;
