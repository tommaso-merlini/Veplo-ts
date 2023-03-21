import { GraphQLUpload } from "graphql-upload";
import { adminCreateProduct } from "./admin/adminCreateProduct";
import { product } from "./user/queries/product/product";
import { shop } from "./user/queries/shop/shop";
import { shopByFirebaseId } from "./user/queries/shop/shopByFirebaseId";
import { isBusiness } from "./user/queries/business/isBusiness";
import { shops } from "./user/queries/shop/shops";
import { createProduct } from "./user/mutations/product/createProduct";
import { editProduct } from "./user/mutations/product/editProduct";
import { deleteProduct } from "./user/mutations/product/deleteProduct";
import { changeProductStatus } from "./user/mutations/product/changeProductsStatus";
import { createShop } from "./user/mutations/shop/createShop";
import { setIsBusiness } from "./user/mutations/business/setIsBusiness";
import { changeShopStatus } from "./user/mutations/shop/changeShopStatus";
import { uploadImages } from "./user/mutations/images/uploadImages";
import Product from "../schemas/Product.model";
import { adminDeleteProduct } from "./admin/adminDeleteProduct";
import { createBusinessStep1 } from "./user/mutations/business/createBusiness/createBusinessStep1";
import { createStripeAccount } from "./user/mutations/stripe/createStripeAccount";
import { business } from "./user/queries/business/business";
import Shop from "../schemas/Shop.model";
import productByVariationUniqueId from "./user/queries/product/productByVariationUniqueId";
import { products } from "./user/queries/product/products";
import { createUser } from "./user/mutations/user/createUser";
import { user } from "./user/queries/user/user";
import { editUser } from "./user/mutations/user/editUser";
import { addToCart } from "./user/mutations/Cart/addToCart";
import { deleteVariation } from "./user/mutations/variation/deleteVariation";
import Cart from "../schemas/Cart.model";
import { cart } from "./user/queries/cart/cart";
import { editVariation } from "./user/mutations/variation/editvariation";
import { removeFromCart } from "./user/mutations/Cart/removeFromCart";
import customError from "../controllers/errors/customError";
import { last } from "lodash";
import { carts } from "./user/queries/cart/carts";
import { deleteCart } from "./user/mutations/Cart/deleteCart";
import { editCart } from "./user/mutations/Cart/editCart";
import { checkout } from "./user/mutations/stripe/checkout";
import { orders } from "./user/queries/order/orders";
require("dotenv").config();

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    prova: () => {
      return "everything works";
    },
    product,
    shop,
    shopByFirebaseId,
    isBusiness,
    shops,
    business,
    productByVariationUniqueId,
    products,
    user,
    cart,
  },

  Mutation: {
    createProduct,
    editProduct,
    deleteProduct,
    changeProductStatus,
    createShop,
    setIsBusiness,
    changeShopStatus: changeShopStatus,
    uploadImages,
    adminCreateProduct,
    adminDeleteProduct,
    createBusinessStep1,
    createStripeAccount,
    createUser,
    editUser,
    addToCart,
    deleteVariation,
    editVariation,
    removeFromCart,
    deleteCart,
    editCart,
    checkout,
  },

  Shop: {
    products: async (shop, { limit, offset, see }) => {
      let status: any = "active";
      if (see === "everything") {
        status = { $exists: true };
      }
      const products = await Product.find({
        "shopInfo.id": shop.id,
        status,
      })
        .skip(offset)
        .limit(limit);

      return products;
    },
  },

  Business: {
    shops: async (business, { _ }) => {
      const shops = await Shop.find({
        businessId: business.id,
      });

      return shops;
    },
  },

  User: {
    carts,
    orders,
  },
};

export default resolvers;
