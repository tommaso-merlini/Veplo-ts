import { Context } from "../../../../../apollo/context";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import customError from "../../../../controllers/errors/customError";
import Cart from "../../../../schemas/Cart.model";
import Product from "../../../../schemas/Product.model";

export const editCart = async (
  _,
  { productVariationId, quantity, size },
  { admin, req }: Context
) => {
  let token;
  let isVariationDuplicate;
  let searchedVariation;
  let sizeMatches = false;
  let variationIndex;
  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  } else {
    token = {
      mongoId: "6410ace3850a8aeb92bcbc9e",
    };
  }

  const product = await Product.findOne({
    "variations._id": productVariationId,
  });

  if (!product) {
    customError({
      code: "404",
      path: "product",
      message: "cannot find a product with the specified variation id",
    });
  }

  //check if shop is active
  if (product.shopInfo.status !== "active") {
    customError({
      code: "400",
      path: "shop status",
      message: "the shop is not active",
    });
  }

  //check if the specified size is contained in the product
  product.variations.forEach((variation, index) => {
    if (variation.id === productVariationId) {
      variationIndex = index;
      searchedVariation = variation;
    }
  });

  product.variations[variationIndex].lots.forEach((lot) => {
    if (lot.size === size) {
      sizeMatches = true;
      if (lot.quantity < quantity) {
        customError({
          code: "409",
          path: "variation's quantity",
          message: "too much quantity for this product's variation",
        });
      }
    }
  });
  if (!sizeMatches) {
    customError({
      code: "409",
      path: "variation's size",
      message:
        "the size you specified is not included in the sizes of the product variation",
    });
  }

  const cart = await Cart.findOne({
    userId: token.mongoId,
    "shopInfo.id": product.shopInfo.id,
  });

  if (cart) {
    //vedere se la variation e' gia' presente nel carrello
    //cart.productVariations.map(async (variation) =>
    for (const variation of cart.productVariations) {
      console.log(variation.size.toString());
      console.log();
      if (
        variation.variationId.toString() === productVariationId.toString() &&
        variation.size.toString() == size.toString()
      ) {
        //se e' presente
        isVariationDuplicate = true;
        break;
      } else {
        //se non e' presente
        isVariationDuplicate = false;
      }
    }

    if (quantity > 0) {
      if (isVariationDuplicate) {
        //la variation e' duplicata
        await Cart.updateOne(
          {
            _id: cart.id,
            productVariations: {
              $elemMatch: {
                variationId: productVariationId,
                size,
              },
            },
          },
          {
            $set: {
              "productVariations.$.quantity": quantity,
            },
          }
        );
        return true;
      } else {
        await Cart.updateOne(
          { _id: cart.id },
          {
            $push: {
              productVariations: {
                variationId: productVariationId,
                quantity,
                size,
              },
            },
          }
        );
        return true;
      }
    } else {
      console.log(isVariationDuplicate);

      if (!isVariationDuplicate) {
        customError({
          code: "400",
          path: "quantity",
          message: "you can't add a product with quantity 0",
        });
      }
      if (cart.productVariations.length === 1) {
        //if the user is removing the last variation
        //delete the cart
        await Cart.findByIdAndRemove(cart.id);
      }
      //delete object
      await Cart.updateOne(
        { _id: cart.id },
        {
          $pull: {
            productVariations: {
              variationId: productVariationId,
              size,
            },
          },
        }
      );
      return true;
    }
  }

  if (!cart) {
    if (quantity === 0) {
      customError({
        code: "400",
        path: "quantity",
        message: "you can't add a product with quantity 0",
      });
    }
    await Cart.create({
      userId: token.mongoId,
      status: "active",
      shopInfo: product.shopInfo,
      productVariations: [{ variationId: productVariationId, size, quantity }],
    });
    return true;
  }
};
