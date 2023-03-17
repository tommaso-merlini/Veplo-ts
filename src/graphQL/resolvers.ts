import { GraphQLUpload } from "graphql-upload";
import { adminCreateProduct } from "./admin/adminCreateProduct";
import { product } from "./user/queries/product/product";
import { variations } from "./user/queries/variation/variations";
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
import { variation } from "./user/queries/variation/variation";
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
    carts: async (user, { _ }) => {
      const variationsIds = [];
      const variations = [];
      const warnings = [];
      const carts = await Cart.find({
        userId: user.id,
      });
      // .explain("executionStats");

      // console.log(carts.queryPlanner.winningPlan.inputStage);

      carts.forEach((cart) => {
        cart.productVariations.forEach((variation) => {
          variationsIds.push(variation.variationId);
        });
      });

      const products = await Product.find({
        "variations._id": {
          $in: variationsIds,
        },
      });

      // carts.forEach((cart) => {
      //   cart.productVariations.forEach((cartVariation, index) => {
      //     products.forEach((product) => {
      //       product.variations.forEach((variation) => {
      //         console.log("==============================");
      //         console.log(variation._id);
      //         console.log(cartVariation.variationId);
      //         console.log("==============================");
      //         if (
      //           variation._id.toString() ===
      //           cartVariation.variationId.toString()
      //         ) {
      //           cart.productVariations[index].name = product.name;
      //           return;
      //         }
      //       });
      //     });
      //   });
      // });

      //get every variation of every product
      products.forEach((product) => {
        product.variations.forEach((variation) => {
          variations.push({
            _id: variation._id,
            photo: variation.photos[0],
            name: product.name,
            color: variation.color,
            lots: variation.lots,
            price: product.price,
            status: variation.status,
          });
        });
      });

      //insert the variation fields inside the cartVariation that has the same id
      for (let cartIndex = 0; cartIndex < carts.length; cartIndex++) {
        for (
          let cartVariationIndex = 0;
          cartVariationIndex < carts[cartIndex].productVariations.length;
          cartVariationIndex++
        ) {
          for (
            let variationIndex = 0;
            variationIndex < variations.length;
            variationIndex++
          ) {
            //if the ids are equal
            if (
              variations[variationIndex]._id.toString() ==
              carts[cartIndex].productVariations[
                cartVariationIndex
              ].variationId.toString()
            ) {
              //check quantity and size integrity
              let isSizeOk = false;
              let lastQuantity;

              variations[variationIndex].lots.forEach((lot, index, array) => {
                lastQuantity =
                  carts[cartIndex].productVariations[cartVariationIndex]
                    .quantity;

                if (
                  lot.size ===
                  carts[cartIndex].productVariations[cartVariationIndex].size
                ) {
                  isSizeOk = true;

                  if (
                    lot.quantity <
                    carts[cartIndex].productVariations[cartVariationIndex]
                      .quantity
                  ) {
                    // console.log("==========================");

                    // console.log(lot.quantity);
                    // console.log(
                    //   carts[cartIndex].productVariations[cartVariationIndex]
                    //     .quantity
                    // );
                    // console.log(variations[variationIndex].name);
                    // console.log(variations[variationIndex]._id);
                    // console.log("==========================");
                    warnings.push({
                      variationId: variations[variationIndex]._id,
                      color: variations[variationIndex].color,
                      size: carts[cartIndex].productVariations[
                        cartVariationIndex
                      ].size,
                      isQuantityTooMuch: true,
                      isSizeNonExisting: false,
                      name: variations[variationIndex].name,
                      quantity: lot.quantity,
                    });
                  }
                }
              });

              if (!isSizeOk) {
                warnings.push({
                  variationId: variations[variationIndex]._id,
                  color: variations[variationIndex].color,
                  size: carts[cartIndex].productVariations[cartVariationIndex]
                    .size,
                  isSizeNonExisting: true,
                  isQuantityTooMuch: false,
                  name: variations[variationIndex].name,
                  quantity: lastQuantity,
                });
              }

              //!non so cosa sia ma NON ELIMINARLO
              //check size existance and quantity
              // carts.forEach((cart) => {
              //   cart.productVariations.forEach((cartVariation) => {
              //     console.log("==========================");
              //     console.log(cartVariation);
              //     console.log("==========================");
              //     variations.forEach((variation) => {
              //       if (
              //         variation._id.toString() ==
              //         cartVariation.variationId.toString()
              //       ) {
              //         let checkSize = false;
              //         let checkQuantity = false;
              //         variation.lots.forEach((lot, index, array) => {
              //           if (lot.size === cartVariation.size) {
              //             checkSize = true;

              //             if (lot.quantity < cartVariation.quantity) {
              //               // console.log("==========================");

              //               // console.log(lot.quantity);
              //               // console.log(cartVariation.quantity);
              //               // console.log(variations[variationIndex].name);
              //               // console.log(variations[variationIndex]._id);
              //               // console.log("==========================");
              //               // customError({
              //               //   code: "404",
              //               //   path: "quantity",
              //               //   message: `${variations[variationIndex].name}, color ${variations[variationIndex].color} and size: ${lot.size} remained only ${lot.quantity} pieces. you wanted ${carts[cartIndex].productVariations[cartVariationIndex].quantity}`,
              //               // });
              //               warnings.push({
              //                 variationId: variation._id,
              //                 color: variation.color,
              //                 size: carts[cartIndex].productVariations[
              //                   cartVariationIndex
              //                 ].size,
              //                 isQuantityTooMuch: true,
              //                 isSizeNonExisting: false,
              //                 name: variations[variationIndex].name,
              //                 quantity: cartVariation.quantity,
              //               });
              //             }
              //           }
              //         });

              //         if (!checkSize) {
              //           // customError({
              //           //   code: "404",
              //           //   path: `size`,
              //           //   message: `${variations[variationIndex].name}, color ${variations[variationIndex].color} does not have the size: ${carts[cartIndex].productVariations[cartVariationIndex].size} `,
              //           // });
              //           warnings.push({
              //             variationId: variation._id,
              //             color: variation.color,
              //             size: carts[cartIndex].productVariations[
              //               cartVariationIndex
              //             ].size,
              //             isSizeNonExisting: true,
              //             isQuantityTooMuch: false,
              //             name: variations[variationIndex].name,
              //             quantity: cartVariation.quantity,
              //           });
              //         }
              //       }
              //     });
              //   });
              // });

              //insert the variation fields insize the cart
              carts[cartIndex].productVariations[cartVariationIndex].name =
                variations[variationIndex].name;
              carts[cartIndex].productVariations[cartVariationIndex].color =
                variations[variationIndex].color;
              carts[cartIndex].productVariations[cartVariationIndex].photo =
                variations[variationIndex].photo;
              carts[cartIndex].productVariations[cartVariationIndex].price =
                variations[variationIndex].price;
              carts[cartIndex].productVariations[cartVariationIndex].status =
                variations[variationIndex].status;
              break;
            }
          }
        }
      }
      return {
        carts,
        warnings,
      };
    },
  },
};

export default resolvers;
