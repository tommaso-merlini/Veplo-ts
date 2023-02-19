import { GraphQLUpload } from "graphql-upload";
import { adminCreateProduct } from "./admin/adminCreateProduct";
import { product } from "./user/queries/product/product";
import { products } from "./user/queries/product/products";
import { shop } from "./user/queries/shop/shop";
import { shopByFirebaseId } from "./user/queries/shop/shopByFirebaseId";
import { isShop } from "./user/queries/shop/isShop";
import { shops } from "./user/queries/shop/shops";
import { createProduct } from "./user/mutations/product/createProduct";
import { editProduct } from "./user/mutations/product/editProduct";
import { deleteProduct } from "./user/mutations/product/deleteProduct";
import { changeProductStatus } from "./user/mutations/product/changeProductsStatus";
import { createShop } from "./user/mutations/shop/createShop";
import { setIsShop } from "./user/mutations/shop/setIsShop";
import { changeShopStatus } from "./user/mutations/shop/changeShopStatus";
import { uploadImages } from "./user/mutations/images/uploadImages";
import Product from "../schemas/Product.model";
require("dotenv").config();

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    prova: () => {
      return "everything works";
    },
    product,
    products,
    shop,
    shopByFirebaseId,
    isShop,
    shops,
  },

  Mutation: {
    createProduct,
    editProduct,
    deleteProduct,
    changeProductStatus,
    createShop,
    setIsShop,
    changeShopStatus: changeShopStatus,
    uploadImages,
    adminCreateProduct,
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
};

export default resolvers;
