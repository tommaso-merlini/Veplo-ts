import { Lot, User, VariationProductInfo } from "src/graphQL/types/types.js";
import Cart from "../../../../schemas/Cart.model.js";
import Product from "../../../../schemas/Product.model.js";

export const carts = async (user: User) => {
  const variationsIds: string[] = [];
  const variations: any[] = [];
  const warnings = [];
  const warningVariationIds = [];
  //get every carts of the user
  const carts: any[] = await Cart.find({
    userId: user.id,
    status: "active",
  });
  // .explain("executionStats");

  // console.log(carts.queryPlanner.winningPlan.inputStage);

  //get every variationId
  carts.forEach((cart: any) => {
    cart.productVariations.forEach((variation: any) => {
      variationsIds.push(variation.variationId);
    });
  });

  const products = await Product.find({
    "variations._id": {
      $in: variationsIds,
    },
  });
  // console.log(variationsIds);

  //check if all products exists or have status: true
  variationsIds.forEach((id, index) => {
    let exists = false;
    products.forEach((product: any) => {
      product.variations.forEach((variation: VariationProductInfo) => {
        if (variation.id.toString() === id.toString()) {
          exists = true;
        }
      });
    });
    if (!exists) {
      //eliminare variation dall'array di variationsIds
      variationsIds.splice(index, 1);

      //eliminare variation dal cart
      carts.forEach((cart: any, cartIndex: number) => {
        cart.productVariations.forEach(
          (variation: any, variationIdex: number) => {
            if (variation.variationId.toString() === id.toString()) {
              carts[cartIndex].productVariations.splice(variationIdex, 1);
            }
          }
        );
      });

      console.log(carts);

      //push warnigng
      warnings.push({
        variationId: id,
        isQuantityTooMuch: false,
        isSizeNonExisting: false,
        isProductNonExisting: true,
      });
      // console.log(variationsIds);
    }
  });

  //get every variation of every product
  products.forEach((product: any) => {
    // if (!product) {
    //   console.log("non ce piu");
    // }

    product.variations.forEach((variation: any) => {
      variations.push({
        _id: variation._id,
        productId: product._id,
        photo: variation.photos[0],
        brand: product.info.brand,
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

          variations[variationIndex].lots.forEach((lot: Lot) => {
            lastQuantity =
              carts[cartIndex].productVariations[cartVariationIndex].quantity;

            if (
              lot.size ===
              carts[cartIndex].productVariations[cartVariationIndex].size
            ) {
              isSizeOk = true;

              if (
                lot.quantity <
                carts[cartIndex].productVariations[cartVariationIndex].quantity
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
                  size: carts[cartIndex].productVariations[cartVariationIndex]
                    .size,
                  isQuantityTooMuch: true,
                  isSizeNonExisting: false,
                  isProductNonExisting: false,
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
              size: carts[cartIndex].productVariations[cartVariationIndex].size,
              isSizeNonExisting: true,
              isQuantityTooMuch: false,
              isProductNonExisting: false,
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
          carts[cartIndex].productVariations[cartVariationIndex].brand =
            variations[variationIndex].brand;
          carts[cartIndex].productVariations[cartVariationIndex].productId =
            variations[variationIndex].productId;
          break;
        }
      }
    }
  }

  //calculate the total for each cart
  carts.forEach((cart: any) => {
    let total = 0;
    let subTotal;

    cart.productVariations.forEach((variation: any) => {
      if (variation.price.v2 != null) {
        subTotal = variation.price.v2 * variation.quantity;
      } else {
        subTotal = variation.price.v1 * variation.quantity;
      }

      total = total + subTotal;
    });

    cart.total = Number(total.toFixed(2));
  });

  //delete variations with error
  for (let warning of warnings) {
    warningVariationIds.push(warning.variationId);
  }

  return {
    carts,
    warnings,
  };
};
