import {
  CartProductVariation,
  Lot,
  MutationAddToCartArgs,
} from "src/graphQL/types/types.js";
import { Context } from "../../../../../apollo/context.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import customError from "../../../../controllers/errors/customError.js";
import Cart from "../../../../schemas/Cart.model.js";
import Product from "../../../../schemas/Product.model.js";

export const addToCart = async (
  _: any,
  { productVariationId, quantity, size }: MutationAddToCartArgs,
  { admin, req }: Context
) => {
  let token;
  let isVariationDuplicate;
  let searchedVariation;
  let sizeMatches = false;
  let variationIndex = 0;
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
  product.variations.forEach(
    (variation: CartProductVariation, index: number) => {
      if (variation.id === productVariationId) {
        variationIndex = index;
        searchedVariation = variation;
      }
    }
  );

  product.variations[variationIndex].lots.forEach((lot: Lot) => {
    if (lot.size === size) {
      sizeMatches = true;
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
    userId: token?.mongoId,
    "shopInfo.id": product.shopInfo.id,
  });

  if (cart) {
    //vedere se la variation e' gia' presente nel carrello
    cart.productVariations.forEach(async (variation: any) => {
      if (
        variation.variationId == productVariationId &&
        variation.size == size
      ) {
        //se e' presente
        isVariationDuplicate = true;
      } else {
        //se non e' presente
        isVariationDuplicate = false;
      }
    });

    if (isVariationDuplicate) {
      //la variation e' duplicata
      await Cart.updateOne(
        {
          _id: cart.id,
          "productVariations.variationId": productVariationId,
        },
        { $inc: { "productVariations.$.quantity": quantity } }
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
    }
  }

  if (!cart) {
    await Cart.create({
      userId: token?.mongoId,
      status: "active",
      shopInfo: product.shopInfo,
      productVariations: [{ variationId: productVariationId, size, quantity }],
    });
  }

  return true;
};
