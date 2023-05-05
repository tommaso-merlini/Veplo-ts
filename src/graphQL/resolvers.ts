import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import { adminCreateProduct } from "./admin/adminCreateProduct.js";
import { product } from "./user/queries/product/product.js";
import { shop } from "./user/queries/shop/shop.js";
import { shopByFirebaseId } from "./user/queries/shop/shopByFirebaseId.js";
import { isBusiness } from "./user/queries/business/isBusiness.js";
import { shops } from "./user/queries/shop/shops.js";
import { createProduct } from "./user/mutations/product/createProduct.js";
import { editProduct } from "./user/mutations/product/editProduct.js";
import { deleteProduct } from "./user/mutations/product/deleteProduct.js";
import { changeProductStatus } from "./user/mutations/product/changeProductsStatus.js";
import { createShop } from "./user/mutations/shop/createShop.js";
import { setIsBusiness } from "./user/mutations/business/setIsBusiness.js";
import { changeShopStatus } from "./user/mutations/shop/changeShopStatus.js";
import { uploadImages } from "./user/mutations/images/uploadImages.js";
import Product from "../schemas/Product.model.js";
import { adminDeleteProduct } from "./admin/adminDeleteProduct.js";
import { createBusinessStep1 } from "./user/mutations/business/createBusiness/createBusinessStep1.js";
import { createStripeAccount } from "./user/mutations/stripe/createStripeAccount.js";
import { business } from "./user/queries/business/business.js";
import Shop from "../schemas/Shop.model.js";
import { products } from "./user/queries/product/products.js";
import { createUser } from "./user/mutations/user/createUser.js";
import { user } from "./user/queries/user/user.js";
import { editUser } from "./user/mutations/user/editUser.js";
import { addToCart } from "./user/mutations/Cart/addToCart.js";
import { deleteVariation } from "./user/mutations/variation/deleteVariation.js";
import { cart } from "./user/queries/cart/cart.js";
import { editVariation } from "./user/mutations/variation/editvariation.js";
import { removeFromCart } from "./user/mutations/Cart/removeFromCart.js";
import { carts } from "./user/queries/cart/carts.js";
import { deleteCart } from "./user/mutations/Cart/deleteCart.js";
import { editCart } from "./user/mutations/Cart/editCart.js";
import { checkout } from "./user/mutations/stripe/checkout.js";
import { orders } from "./user/queries/order/orders.js";
import { editOrder } from "./user/mutations/order/editOrder.js";
import { brands } from "./user/queries/constants/brands.js";
import { createInformation } from "./user/mutations/Information/createInformation.js";
import { order } from "./user/queries/order/order.js";
import { createVariation } from "./user/mutations/variation/createVariation.js";
import {
  ProductInput,
  ProductProductsLikeThisArgs,
  QueryProductsArgs,
} from "./types/types.js";
import { refund } from "./user/mutations/stripe/refund.js";
import { productsNotAvailableRefund } from "./user/mutations/stripe/productsNotAvailableRefund.js";
import { adminSeeAllOrders } from "./admin/adminSeeAllOrders.js";
import { adminCreateAdmin } from "./admin/adminCreateAdmin.js";
import { adminLostPackage } from "./admin/adminLostPackage.js";
import { adminOrderHasArrived } from "./admin/adminOrderHasArrived.js";
import { returnOrder } from "./user/mutations/order/returnOrder.js";
import getRequestedFields from "../../src/controllers/getRequestedFields.js";
import { productsWithFilters } from "../../src/controllers/queries/productsWithFilters.js";
import checkFirebaseErrors from "../../src/controllers/checkFirebaseErrors.js";
import authenticateToken from "../../src/controllers/authenticateToken.js";
import { productsAutoComplete } from "./user/queries/product/productsAutoComplete.js";
import { BetterInputGenerator } from "../controllers/BetterInputGenerator.js";
import { editShop } from "./user/mutations/shop/editShop.js";

interface ShopProductsArgs extends QueryProductsArgs {
  statuses: string[];
}

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
    adminSeeAllOrders,
    productsAutoComplete,
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
    refund,
    productsNotAvailableRefund,
    adminCreateAdmin,
    adminLostPackage,
    adminOrderHasArrived,
    returnOrder,
    editShop,
  },

  Shop: {
    products: async (
      shop: any,
      { limit, offset, sort, filters, statuses }: ShopProductsArgs,
      { admin, req }: any,
      info: any
    ) => {
      let token;
      if (process.env.NODE_ENV !== "development") {
        try {
          token = await admin.auth().verifyIdToken(req.headers.authorization);
        } catch (e) {
          token = null;
        }
      } else {
        token = {
          firebaseId: "prova",
          mongoId: "641f209eca22d34c3ca1ec1f",
          isBusiness: true,
        };
      }

      try {
        authenticateToken({
          tokenId: token?.mongoId,
          ids: [String(shop.businessId)],
          isBusiness: token?.isBusiness,
        });
        var canSeeAllStatuses = true;
      } catch (e) {
        var canSeeAllStatuses = false;
      }

      const betterInput = BetterInputGenerator(filters);

      const products = await productsWithFilters({
        info,
        offset,
        sort,
        filters: betterInput,
        limit,
        shopId: shop._id,
        statuses,
        canSeeAllStatuses,
      });

      return products;
    },
    orders,
  },

  Product: {
    productsLikeThis: async (
      product: any,
      { limit, offset }: ProductProductsLikeThisArgs,
      _: any,
      info: any
    ) => {
      let productsLikeThis: any = await Product.aggregate([
        {
          $search: {
            index: "ProductSearchIndex",
            compound: {
              must: [
                {
                  moreLikeThis: {
                    like: product,
                  },
                },
              ],
              mustNot: [
                {
                  equals: {
                    path: "_id",
                    value: product._id,
                  },
                },
              ],
              should: [
                //boost products based on how many times it has been bought
                {
                  range: {
                    path: "orderCounter",
                    gt: 0,
                    lt: 20,
                    score: {
                      boost: {
                        value: 1,
                      },
                    },
                  },
                },
                {
                  range: {
                    path: "orderCounter",
                    gte: 20,
                    lt: 80,
                    score: {
                      boost: {
                        value: 2,
                      },
                    },
                  },
                },
                {
                  range: {
                    path: "orderCounter",
                    gte: 80,
                    score: {
                      boost: {
                        value: 3,
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          $skip: offset,
        },

        {
          $limit: limit,
        },

        {
          $project: {
            score: { $meta: "searchScore" },

            ...getRequestedFields(info),
            _id: 0,
            id: "$_id",
          },
        },
      ]);

      return productsLikeThis;
    },
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
