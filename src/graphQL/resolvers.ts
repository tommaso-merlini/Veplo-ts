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
import { products } from "./user/queries/product/products";
import { createUser } from "./user/mutations/user/createUser";
import { user } from "./user/queries/user/user";
import { editUser } from "./user/mutations/user/editUser";
import { addToCart } from "./user/mutations/Cart/addToCart";
import { deleteVariation } from "./user/mutations/variation/deleteVariation";
import { cart } from "./user/queries/cart/cart";
import { editVariation } from "./user/mutations/variation/editvariation";
import { removeFromCart } from "./user/mutations/Cart/removeFromCart";
import { carts } from "./user/queries/cart/carts";
import { deleteCart } from "./user/mutations/Cart/deleteCart";
import { editCart } from "./user/mutations/Cart/editCart";
import { checkout } from "./user/mutations/stripe/checkout";
import { orders } from "./user/queries/order/orders";
import { editOrder } from "./user/mutations/order/editOrder";
import { brands } from "./user/queries/constants/brands";
import { createInformation } from "./user/mutations/Information/createInformation";
import { order } from "./user/queries/order/order";
import { createVariation } from "./user/mutations/variation/createVariation";
import { ShopProductsArgs } from "./types/types";
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
    products,
    user,
    cart,
    brands,
    order,
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
    createVariation,
    deleteVariation,
    editVariation,
    removeFromCart,
    deleteCart,
    editCart,
    checkout,
    editOrder,
    createInformation,
  },

  Shop: {
    products: async (shop: any, { limit, offset, see }: ShopProductsArgs) => {
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
    orders,
  },

  Business: {
    shops: async (business: any) => {
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
