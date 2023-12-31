export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: any;
};

export type AddressShop = {
  __typename?: 'AddressShop';
  city?: Maybe<Scalars['String']>;
  location?: Maybe<Location>;
  postcode?: Maybe<Scalars['String']>;
  street?: Maybe<Scalars['String']>;
};

export type AddressShopInput = {
  city: Scalars['String'];
  location: LocationInput;
  street: Scalars['String'];
};

export type AdminSeeAllOrdersFilters = {
  business?: InputMaybe<AdminSeeAllOrdersFiltersBusiness>;
  code?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  shop?: InputMaybe<AdminSeeAllOrdersFiltersShop>;
  status?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<AdminSeeAllOrdersFiltersUser>;
};

export type AdminSeeAllOrdersFiltersBusiness = {
  firebaseId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

export type AdminSeeAllOrdersFiltersShop = {
  id?: InputMaybe<Scalars['ID']>;
};

export type AdminSeeAllOrdersFiltersUser = {
  email?: InputMaybe<Scalars['String']>;
  firebaseId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

export type Business = {
  __typename?: 'Business';
  businessName?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firebaseId?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  shops?: Maybe<Array<Shop>>;
  status?: Maybe<Scalars['String']>;
  stripe?: Maybe<Stripe>;
  vatNumber?: Maybe<Scalars['String']>;
};

export type Cart = {
  __typename?: 'Cart';
  createdAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  productVariations?: Maybe<Array<CartProductVariation>>;
  shopInfo?: Maybe<CartShopInfo>;
  status?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Float']>;
  userId?: Maybe<Scalars['ID']>;
};

export type CartProductVariation = {
  __typename?: 'CartProductVariation';
  brand?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  photo?: Maybe<Scalars['String']>;
  price?: Maybe<Price>;
  productId?: Maybe<Scalars['ID']>;
  quantity?: Maybe<Scalars['Int']>;
  size?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  variationId?: Maybe<Scalars['ID']>;
};

export type CartShopInfo = {
  __typename?: 'CartShopInfo';
  city?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type CartWarning = {
  __typename?: 'CartWarning';
  color?: Maybe<Scalars['String']>;
  isProductNonExisting?: Maybe<Scalars['Boolean']>;
  isQuantityTooMuch?: Maybe<Scalars['Boolean']>;
  isSizeNonExisting?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  size?: Maybe<Scalars['String']>;
  variationId?: Maybe<Scalars['ID']>;
};

export type CreateProductResponse = {
  __typename?: 'CreateProductResponse';
  id: Scalars['ID'];
  photos?: Maybe<Array<Scalars['String']>>;
};

export type EditAddressShopInput = {
  city: Scalars['String'];
  location: LocationInput;
  street: Scalars['String'];
};

export type EditLotsInput = {
  quantity: Scalars['Int'];
  size: Scalars['String'];
};

export type EditOrderInput = {
  code?: InputMaybe<Scalars['String']>;
  courier?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};

export type EditPriceInput = {
  v1: Scalars['Float'];
  v2?: InputMaybe<Scalars['Float']>;
};

export type EditProductInfo = {
  brand?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  fit?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  length?: InputMaybe<Scalars['String']>;
  macroCategory?: InputMaybe<Scalars['String']>;
  materials?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  microCategory?: InputMaybe<Scalars['String']>;
  traits?: InputMaybe<Array<Scalars['String']>>;
};

export type EditProductInput = {
  canBuy?: InputMaybe<Scalars['Boolean']>;
  info?: InputMaybe<EditProductInfo>;
  name?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<PriceInput>;
  status?: InputMaybe<Scalars['String']>;
};

export type EditShopInput = {
  address?: InputMaybe<EditAddressShopInput>;
  categories?: InputMaybe<Array<Scalars['String']>>;
  info?: InputMaybe<EditShopInputInfo>;
  isDigitalOnly?: InputMaybe<Scalars['Boolean']>;
  minimumAmountForFreeShipping?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  profileCover?: InputMaybe<Scalars['String']>;
  profilePhoto?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
};

export type EditShopInputInfo = {
  description?: InputMaybe<Scalars['String']>;
  opening?: InputMaybe<OpeningInput>;
  phone?: InputMaybe<Scalars['String']>;
};

export type EditUserInput = {
  gender?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<LocationInput>;
  name?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  surname?: InputMaybe<Scalars['String']>;
};

export type EditVariationInput = {
  color?: InputMaybe<Scalars['String']>;
  lots: Array<EditLotsInput>;
  photos: Array<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
};

export type HistoryOrder = {
  __typename?: 'HistoryOrder';
  date?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type InformationInput = {
  businessName: Scalars['String'];
  email: Scalars['String'];
  phone: Scalars['String'];
  userName: Scalars['String'];
};

export type Location = {
  __typename?: 'Location';
  coordinates?: Maybe<Array<Scalars['Float']>>;
  type?: Maybe<Scalars['String']>;
};

export type LocationInput = {
  coordinates: Array<Scalars['Float']>;
  type: Scalars['String'];
};

export type Lot = {
  __typename?: 'Lot';
  quantity?: Maybe<Scalars['Int']>;
  size?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** add products to the cart */
  addToCart?: Maybe<Scalars['Boolean']>;
  adminCreateAdmin?: Maybe<Scalars['Boolean']>;
  adminCreateProduct?: Maybe<CreateProductResponse>;
  adminDeleteProduct: Scalars['ID'];
  adminEditProduct: Scalars['ID'];
  /** tells that a package was lost */
  adminLostPackage?: Maybe<Scalars['Boolean']>;
  /** tells that an order has arrived */
  adminOrderHasArrived?: Maybe<Scalars['Boolean']>;
  /** change the status of a product */
  changeProductStatus?: Maybe<Scalars['Boolean']>;
  /** change the status of a shop */
  changeShopStatus?: Maybe<Scalars['Boolean']>;
  /** get a checkout url of a cart by providing the shopId, the userId is inside the jwt */
  checkout?: Maybe<Scalars['String']>;
  /** the first step of creating a business */
  createBusinessStep1: Scalars['ID'];
  /** create information */
  createInformation?: Maybe<Scalars['Boolean']>;
  /** create a single product */
  createProduct?: Maybe<CreateProductResponse>;
  /** create a shop */
  createShop: Scalars['ID'];
  /** create an account on stripe */
  createStripeAccount?: Maybe<Scalars['String']>;
  /** create a user in mongodb */
  createUser: Scalars['ID'];
  /** create a variation */
  createVariation?: Maybe<Scalars['Boolean']>;
  /** delete a cart */
  deleteCart?: Maybe<Scalars['Boolean']>;
  /** delete a product */
  deleteProduct: Scalars['ID'];
  /** delete a variation */
  deleteVariation?: Maybe<Scalars['Boolean']>;
  /** shop deny the refund requested by the user */
  denyReturn?: Maybe<Scalars['Boolean']>;
  /** edit a cart (you can add or remove) */
  editCart?: Maybe<Scalars['Boolean']>;
  /** edit an order */
  editOrder?: Maybe<Scalars['Boolean']>;
  /** edit a product */
  editProduct: Scalars['ID'];
  /** change the status of a shop */
  editShop?: Maybe<Scalars['Boolean']>;
  /** edit a user */
  editUser?: Maybe<Scalars['Boolean']>;
  /** edit a single variation */
  editVariation?: Maybe<Scalars['Boolean']>;
  /** shop refunds an order because the products are not available */
  productsNotAvailableRefund?: Maybe<Scalars['Boolean']>;
  /** refund an order */
  refund?: Maybe<Scalars['Boolean']>;
  /** remove product form cart */
  removeFromCart?: Maybe<Scalars['Boolean']>;
  /** user returns an order */
  returnOrder?: Maybe<Scalars['Boolean']>;
  /** shop tells that a return order has arrived */
  returnedOrderHasArrived?: Maybe<Scalars['Boolean']>;
  /** change the isBusiness account field */
  setIsBusiness: Scalars['Boolean'];
  /** upload a list of images to the image bucket */
  uploadImages: Array<Scalars['String']>;
};


export type MutationAddToCartArgs = {
  productVariationId: Scalars['ID'];
  quantity: Scalars['Int'];
  size: Scalars['String'];
};


export type MutationAdminCreateProductArgs = {
  options: ProductInput;
  shopId: Scalars['ID'];
};


export type MutationAdminDeleteProductArgs = {
  id: Scalars['ID'];
};


export type MutationAdminEditProductArgs = {
  id: Scalars['ID'];
  options: EditProductInput;
};


export type MutationAdminLostPackageArgs = {
  orderId: Scalars['ID'];
};


export type MutationAdminOrderHasArrivedArgs = {
  id: Scalars['ID'];
};


export type MutationChangeProductStatusArgs = {
  id: Scalars['ID'];
  status: Scalars['String'];
};


export type MutationChangeShopStatusArgs = {
  id: Scalars['ID'];
  status: Scalars['String'];
};


export type MutationCheckoutArgs = {
  shopId: Scalars['ID'];
};


export type MutationCreateInformationArgs = {
  options: InformationInput;
};


export type MutationCreateProductArgs = {
  options: ProductInput;
  shopId: Scalars['ID'];
};


export type MutationCreateShopArgs = {
  options: ShopInput;
};


export type MutationCreateStripeAccountArgs = {
  businessName: Scalars['String'];
  phone: Scalars['String'];
  vatNumber: Scalars['String'];
};


export type MutationCreateUserArgs = {
  options: UserInput;
};


export type MutationCreateVariationArgs = {
  options: ProductVariationInput;
  productId: Scalars['ID'];
};


export type MutationDeleteCartArgs = {
  shopId: Scalars['ID'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteVariationArgs = {
  id: Scalars['ID'];
};


export type MutationDenyReturnArgs = {
  orderId: Scalars['ID'];
};


export type MutationEditCartArgs = {
  productVariationId: Scalars['ID'];
  quantity: Scalars['Int'];
  size: Scalars['String'];
};


export type MutationEditOrderArgs = {
  id: Scalars['ID'];
  options: EditOrderInput;
};


export type MutationEditProductArgs = {
  id: Scalars['ID'];
  options: EditProductInput;
};


export type MutationEditShopArgs = {
  id: Scalars['ID'];
  options: EditShopInput;
};


export type MutationEditUserArgs = {
  options: EditUserInput;
};


export type MutationEditVariationArgs = {
  id: Scalars['ID'];
  options: EditVariationInput;
};


export type MutationProductsNotAvailableRefundArgs = {
  orderId: Scalars['ID'];
  productsNotAvailable?: InputMaybe<Array<ProductsNotAvailableInput>>;
};


export type MutationRefundArgs = {
  checkoutSessionId?: InputMaybe<Scalars['String']>;
};


export type MutationRemoveFromCartArgs = {
  productVariationId: Scalars['ID'];
  quantity: Scalars['Int'];
  size: Scalars['String'];
};


export type MutationReturnOrderArgs = {
  id: Scalars['ID'];
  why?: InputMaybe<Scalars['String']>;
};


export type MutationReturnedOrderHasArrivedArgs = {
  id: Scalars['ID'];
};


export type MutationSetIsBusinessArgs = {
  isBusiness: Scalars['Boolean'];
};


export type MutationUploadImagesArgs = {
  images: Array<Scalars['Upload']>;
  proportion: ImageProportionsEnum;
};

export type Opening = {
  __typename?: 'Opening';
  days?: Maybe<Array<Scalars['Int']>>;
  hours?: Maybe<Array<Scalars['String']>>;
};

export type OpeningInput = {
  days: Array<Scalars['Int']>;
  hours: Array<Scalars['String']>;
};

export type Order = {
  __typename?: 'Order';
  cartId?: Maybe<Scalars['ID']>;
  chargeId?: Maybe<Scalars['String']>;
  checkoutSessionId?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  history?: Maybe<Array<HistoryOrder>>;
  id?: Maybe<Scalars['ID']>;
  productVariations?: Maybe<Array<ProductVariationsOrder>>;
  recipient?: Maybe<RecipientOrder>;
  shipping?: Maybe<ShippingOrder>;
  shop?: Maybe<ShopOrder>;
  status?: Maybe<Scalars['String']>;
  totalDetails?: Maybe<TotalDetailsOrder>;
  user?: Maybe<UserOrder>;
};

export type Price = {
  __typename?: 'Price';
  discountPercentage?: Maybe<Scalars['Float']>;
  v1?: Maybe<Scalars['Float']>;
  v2?: Maybe<Scalars['Float']>;
};

export type PriceInput = {
  v1: Scalars['Float'];
  v2?: InputMaybe<Scalars['Float']>;
};

export type Product = {
  __typename?: 'Product';
  canBuy?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  info?: Maybe<ProductInfo>;
  location?: Maybe<Location>;
  name?: Maybe<Scalars['String']>;
  orderCounter?: Maybe<Scalars['Int']>;
  price?: Maybe<Price>;
  productsLikeThis?: Maybe<Array<Product>>;
  score?: Maybe<Scalars['Float']>;
  shopInfo?: Maybe<ShopInfo>;
  status?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  variations?: Maybe<Array<ProductVariation>>;
};


export type ProductProductsLikeThisArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  shopId?: InputMaybe<Scalars['ID']>;
};

export type ProductFilters = {
  brand?: InputMaybe<Scalars['String']>;
  colors?: InputMaybe<Array<Scalars['String']>>;
  fit?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  macroCategory?: InputMaybe<Scalars['String']>;
  maxPrice?: InputMaybe<Scalars['Int']>;
  microCategory?: InputMaybe<Scalars['String']>;
  minPrice?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  sizes?: InputMaybe<Array<Scalars['String']>>;
  traits?: InputMaybe<Array<Scalars['String']>>;
};

export type ProductFiltersResponse = {
  __typename?: 'ProductFiltersResponse';
  brand?: Maybe<Scalars['String']>;
  collar?: Maybe<Scalars['String']>;
  colors?: Maybe<Array<Maybe<Scalars['String']>>>;
  fit?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  length?: Maybe<Scalars['String']>;
  macroCategory?: Maybe<Scalars['String']>;
  maxPrice?: Maybe<Scalars['Int']>;
  microCategory?: Maybe<Scalars['String']>;
  minPrice?: Maybe<Scalars['Int']>;
  query?: Maybe<Scalars['String']>;
  sizes?: Maybe<Array<Maybe<Scalars['String']>>>;
  traits?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type ProductInfo = {
  __typename?: 'ProductInfo';
  brand?: Maybe<Scalars['String']>;
  collar?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  fit?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  keywords?: Maybe<Array<Scalars['String']>>;
  length?: Maybe<Scalars['String']>;
  macroCategory?: Maybe<Scalars['String']>;
  making?: Maybe<Scalars['String']>;
  materials?: Maybe<Array<Scalars['String']>>;
  microCategory?: Maybe<Scalars['String']>;
  traits?: Maybe<Array<Scalars['String']>>;
};

export type ProductInfoInput = {
  brand: Scalars['String'];
  collar?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  fit?: InputMaybe<Scalars['String']>;
  gender: Scalars['String'];
  keywords?: InputMaybe<Array<Scalars['String']>>;
  length?: InputMaybe<Scalars['String']>;
  macroCategory: Scalars['String'];
  making?: InputMaybe<Scalars['String']>;
  materials?: InputMaybe<Array<Scalars['String']>>;
  microCategory: Scalars['String'];
  traits: Array<InputMaybe<Scalars['String']>>;
};

export type ProductInput = {
  canBuy: Scalars['Boolean'];
  info: ProductInfoInput;
  name: Scalars['String'];
  price: PriceInput;
  status: Scalars['String'];
  variations: Array<ProductVariationInput>;
};

export type ProductLotInput = {
  quantity: Scalars['Int'];
  size: Scalars['String'];
};

export type ProductSort = {
  ascending: Scalars['Boolean'];
  for: Scalars['String'];
};

export type ProductVariation = {
  __typename?: 'ProductVariation';
  color?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  lots?: Maybe<Array<Lot>>;
  photos?: Maybe<Array<Scalars['String']>>;
  status?: Maybe<Scalars['String']>;
};

export type ProductVariationInput = {
  color: Scalars['String'];
  lots: Array<ProductLotInput>;
  photos: Array<Scalars['String']>;
  status: Scalars['String'];
};

export type ProductVariationsOrder = {
  __typename?: 'ProductVariationsOrder';
  brand?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  photo?: Maybe<Scalars['String']>;
  price?: Maybe<Price>;
  productId?: Maybe<Scalars['ID']>;
  quantity?: Maybe<Scalars['Int']>;
  size?: Maybe<Scalars['String']>;
  variationId?: Maybe<Scalars['ID']>;
};

export type ProductsQueryResponse = {
  __typename?: 'ProductsQueryResponse';
  filters: ProductFiltersResponse;
  products: Array<Product>;
};

export type Query = {
  __typename?: 'Query';
  /** admin - get a list of all the orders */
  adminSeeAllOrders?: Maybe<Array<Order>>;
  /** get list of available brands */
  brands?: Maybe<Array<Scalars['String']>>;
  /** get a single business */
  business?: Maybe<Business>;
  /** get a single cart */
  cart: Cart;
  /** check if the account is a business */
  isBusiness: Scalars['Boolean'];
  /** get a single order */
  order?: Maybe<Order>;
  /** get a single product */
  product?: Maybe<Product>;
  /** get a list of products, you can use the filters and sort */
  products: ProductsQueryResponse;
  /** get a list of products with an autocomplete engine under the hood */
  productsAutoComplete: Array<Product>;
  prova: Scalars['String'];
  /** get a single shop */
  shop?: Maybe<Shop>;
  /** get a single shop searching by firebaseId */
  shopByFirebaseId?: Maybe<Shop>;
  /** get a list of shops, you can use the filters */
  shops: Array<Shop>;
  shopsAutoComplete: Array<Shop>;
  /** get a single user - id provided by the jwt */
  user?: Maybe<User>;
};


export type QueryAdminSeeAllOrdersArgs = {
  filters?: InputMaybe<AdminSeeAllOrdersFilters>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryBusinessArgs = {
  id: Scalars['ID'];
};


export type QueryCartArgs = {
  id: Scalars['ID'];
};


export type QueryOrderArgs = {
  id: Scalars['ID'];
};


export type QueryProductArgs = {
  id: Scalars['ID'];
};


export type QueryProductsArgs = {
  filters?: InputMaybe<ProductFilters>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  sort?: InputMaybe<ProductSort>;
};


export type QueryProductsAutoCompleteArgs = {
  query: Scalars['String'];
};


export type QueryShopArgs = {
  id: Scalars['ID'];
};


export type QueryShopByFirebaseIdArgs = {
  firebaseId: Scalars['String'];
};


export type QueryShopsArgs = {
  filters: ShopFilters;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryShopsAutoCompleteArgs = {
  query: Scalars['String'];
};

export type RecipientOrder = {
  __typename?: 'RecipientOrder';
  address?: Maybe<UserOrderAddress>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
};

export type ShippingOrder = {
  __typename?: 'ShippingOrder';
  code?: Maybe<Scalars['String']>;
  courier?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type Shop = {
  __typename?: 'Shop';
  address?: Maybe<AddressShop>;
  businessId?: Maybe<Scalars['ID']>;
  businessStatus?: Maybe<Scalars['String']>;
  categories?: Maybe<Array<Scalars['String']>>;
  createdAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  info?: Maybe<ShopInformations>;
  isDigitalOnly?: Maybe<Scalars['Boolean']>;
  minimumAmountForFreeShipping?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  orders?: Maybe<Array<Order>>;
  products: ProductsQueryResponse;
  profileCover?: Maybe<Scalars['String']>;
  profilePhoto?: Maybe<Scalars['String']>;
  score?: Maybe<Scalars['Float']>;
  shopsLikeThis?: Maybe<Array<Shop>>;
  status?: Maybe<Scalars['String']>;
};


export type ShopOrdersArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  statuses?: InputMaybe<Array<Scalars['String']>>;
};


export type ShopProductsArgs = {
  filters?: InputMaybe<ProductFilters>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  sort?: InputMaybe<ProductSort>;
  statuses?: InputMaybe<Array<ShopProductsStatusesEnum>>;
};


export type ShopShopsLikeThisArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};

export type ShopFilters = {
  categories?: InputMaybe<Array<Scalars['String']>>;
  name?: InputMaybe<Scalars['String']>;
};

export type ShopInfo = {
  __typename?: 'ShopInfo';
  businessId?: Maybe<Scalars['ID']>;
  businessStatus?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  profilePhoto?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type ShopInformations = {
  __typename?: 'ShopInformations';
  description?: Maybe<Scalars['String']>;
  opening?: Maybe<Opening>;
  phone?: Maybe<Scalars['String']>;
};

export type ShopInput = {
  address: AddressShopInput;
  categories: Array<InputMaybe<Scalars['String']>>;
  info: ShopInputInfo;
  isDigitalOnly: Scalars['Boolean'];
  minimumAmountForFreeShipping?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  profileCover?: InputMaybe<Scalars['String']>;
  profilePhoto?: InputMaybe<Scalars['String']>;
};

export type ShopInputInfo = {
  description?: InputMaybe<Scalars['String']>;
  opening: OpeningInput;
  phone: Scalars['String'];
};

export type ShopOrder = {
  __typename?: 'ShopOrder';
  businessId?: Maybe<Scalars['ID']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  stripeId?: Maybe<Scalars['String']>;
};

export enum ShopProductsStatusesEnum {
  Active = 'active',
  NotActive = 'not_active'
}

export type Stripe = {
  __typename?: 'Stripe';
  id?: Maybe<Scalars['String']>;
};

export type TotalDetailsOrder = {
  __typename?: 'TotalDetailsOrder';
  amountDiscount?: Maybe<Scalars['Float']>;
  amountShipping?: Maybe<Scalars['Float']>;
  amountTax?: Maybe<Scalars['Float']>;
  subTotal?: Maybe<Scalars['Float']>;
  total?: Maybe<Scalars['Float']>;
};

export type User = {
  __typename?: 'User';
  age?: Maybe<Scalars['String']>;
  carts?: Maybe<UserCarts>;
  createdAt?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firebaseId?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  location?: Maybe<Location>;
  name?: Maybe<Scalars['String']>;
  orders?: Maybe<Array<Order>>;
  phone?: Maybe<Scalars['String']>;
  stripeId?: Maybe<Scalars['String']>;
  surname?: Maybe<Scalars['String']>;
};


export type UserOrdersArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  statuses?: InputMaybe<Array<Scalars['String']>>;
};

export type UserCarts = {
  __typename?: 'UserCarts';
  carts?: Maybe<Array<Cart>>;
  warnings: Array<CartWarning>;
};

export type UserInput = {
  dateOfBirth?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<LocationInput>;
  name: Scalars['String'];
  surname: Scalars['String'];
};

export type UserOrder = {
  __typename?: 'UserOrder';
  email?: Maybe<Scalars['String']>;
  firebaseId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  stripeId?: Maybe<Scalars['String']>;
  surname?: Maybe<Scalars['String']>;
};

export type UserOrderAddress = {
  __typename?: 'UserOrderAddress';
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  line1?: Maybe<Scalars['String']>;
  line2?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
};

export type VariationProductInfo = {
  __typename?: 'VariationProductInfo';
  canBuy?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
  info?: Maybe<VariationProductInfoInfo>;
  status?: Maybe<Scalars['String']>;
};

export type VariationProductInfoInfo = {
  __typename?: 'VariationProductInfoInfo';
  brand?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  macroCategory?: Maybe<Scalars['String']>;
  microCategory?: Maybe<Scalars['String']>;
};

export enum ImageProportionsEnum {
  Product = 'product',
  ShopCover = 'shopCover',
  ShopPhoto = 'shopPhoto'
}

export type ProductsNotAvailableInput = {
  productId: Scalars['ID'];
  reason?: InputMaybe<Scalars['String']>;
  size: Scalars['String'];
  variationId: Scalars['ID'];
};
