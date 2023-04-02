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
  fit?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  macroCategory?: InputMaybe<Scalars['String']>;
  microCategory?: InputMaybe<Scalars['String']>;
};

export type EditProductInput = {
  canBuy?: InputMaybe<Scalars['Boolean']>;
  info?: InputMaybe<EditProductInfo>;
  name?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<PriceInput>;
  status?: InputMaybe<Scalars['String']>;
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
  addToCart?: Maybe<Scalars['Boolean']>;
  adminCreateProduct?: Maybe<CreateProductResponse>;
  adminDeleteProduct: Scalars['ID'];
  adminEditProduct: Scalars['ID'];
  changeProductStatus?: Maybe<Scalars['Boolean']>;
  changeShopStatus?: Maybe<Scalars['Boolean']>;
  checkout?: Maybe<Scalars['String']>;
  createBusinessStep1: Scalars['ID'];
  createInformation?: Maybe<Scalars['Boolean']>;
  createProduct?: Maybe<CreateProductResponse>;
  createShop: Scalars['ID'];
  createStripeAccount?: Maybe<Scalars['String']>;
  createUser: Scalars['ID'];
  createVariation?: Maybe<Scalars['Boolean']>;
  deleteCart?: Maybe<Scalars['Boolean']>;
  deleteProduct: Scalars['ID'];
  deleteVariation?: Maybe<Scalars['Boolean']>;
  editCart?: Maybe<Scalars['Boolean']>;
  editOrder?: Maybe<Scalars['Boolean']>;
  editProduct: Scalars['ID'];
  editUser?: Maybe<Scalars['Boolean']>;
  editVariation?: Maybe<Scalars['Boolean']>;
  removeFromCart?: Maybe<Scalars['Boolean']>;
  setIsBusiness: Scalars['Boolean'];
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


export type MutationEditUserArgs = {
  options: EditUserInput;
};


export type MutationEditVariationArgs = {
  id: Scalars['ID'];
  options: EditVariationInput;
};


export type MutationRemoveFromCartArgs = {
  productVariationId: Scalars['ID'];
  quantity: Scalars['Int'];
  size: Scalars['String'];
};


export type MutationSetIsBusinessArgs = {
  isBusiness: Scalars['Boolean'];
};


export type MutationUploadImagesArgs = {
  images: Array<Scalars['Upload']>;
  proportion: Scalars['String'];
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
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
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
  price?: Maybe<Price>;
  shopInfo?: Maybe<ShopInfo>;
  status?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  variations?: Maybe<Array<ProductVariation>>;
};

export type ProductFilters = {
  brand?: InputMaybe<Scalars['String']>;
  colors?: InputMaybe<Array<Scalars['String']>>;
  gender?: InputMaybe<Scalars['String']>;
  macroCategory?: InputMaybe<Scalars['String']>;
  maxPrice?: InputMaybe<Scalars['Int']>;
  microCategory?: InputMaybe<Scalars['String']>;
  minPrice?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  sizes?: InputMaybe<Array<Scalars['String']>>;
};

export type ProductInfo = {
  __typename?: 'ProductInfo';
  brand?: Maybe<Scalars['String']>;
  fit?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  macroCategory?: Maybe<Scalars['String']>;
  microCategory?: Maybe<Scalars['String']>;
};

export type ProductInfoInput = {
  brand: Scalars['String'];
  fit: Scalars['String'];
  gender: Scalars['String'];
  macroCategory: Scalars['String'];
  microCategory: Scalars['String'];
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

export type Query = {
  __typename?: 'Query';
  brands?: Maybe<Array<Scalars['String']>>;
  business?: Maybe<Business>;
  cart: Cart;
  isBusiness: Scalars['Boolean'];
  order?: Maybe<Order>;
  product?: Maybe<Product>;
  productByVariationUniqueId?: Maybe<Product>;
  products?: Maybe<Array<Product>>;
  prova: Scalars['String'];
  shop?: Maybe<Shop>;
  shopByFirebaseId?: Maybe<Shop>;
  shops: Array<Shop>;
  user?: Maybe<User>;
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


export type QueryProductByVariationUniqueIdArgs = {
  uniqueId: Scalars['ID'];
};


export type QueryProductsArgs = {
  filters?: InputMaybe<ProductFilters>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  sort?: InputMaybe<ProductSort>;
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
  createdAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  info?: Maybe<ShopInformations>;
  isDigitalOnly?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  orders?: Maybe<Array<Order>>;
  photo?: Maybe<Scalars['String']>;
  products?: Maybe<Array<Product>>;
  status?: Maybe<Scalars['String']>;
};


export type ShopOrdersArgs = {
  statuses?: InputMaybe<Array<Scalars['String']>>;
};


export type ShopProductsArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  see?: InputMaybe<Scalars['String']>;
};

export type ShopFilters = {
  cap?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type ShopInfo = {
  __typename?: 'ShopInfo';
  businessId?: Maybe<Scalars['ID']>;
  city?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
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
  info: ShopInputInfo;
  isDigitalOnly: Scalars['Boolean'];
  name: Scalars['String'];
  photo?: InputMaybe<Scalars['String']>;
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
