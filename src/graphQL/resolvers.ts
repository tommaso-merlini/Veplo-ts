import { GraphQLUpload } from "graphql-upload";
import { adminCreateProduct } from "./admin/adminCreateProduct";
import { product } from "./user/queries/product/product";
import { variations } from "./user/queries/product/variations";
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
require("dotenv").config();

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    prova: () => {
      return "everything works";
    },
    product,
    variations,
    shop,
    shopByFirebaseId,
    isBusiness,
    shops,
    business,
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
  },

  Shop: {
    products: async (shop, { limit, offset, see }) => {
      let status: any = "active";
      if (see === "everything") {
        status = { $exists: true };
      }
      const products = await Product.find({
        shopId: shop.id,
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
};

export default resolvers;
