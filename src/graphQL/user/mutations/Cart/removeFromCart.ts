import {
  CartProductVariation,
  EditLotsInput,
  MutationRemoveFromCartArgs,
  ProductVariation,
} from "src/graphQL/types/types.js";
import { Context } from "../../../../../apollo/context.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import customError from "../../../../controllers/errors/customError.js";
import Cart from "../../../../schemas/Cart.model.js";
import Product from "../../../../schemas/Product.model.js";

export const removeFromCart = async (
  _: any,
  { productVariationId, quantity, size }: MutationRemoveFromCartArgs,
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
      mongoId: "6404ba28f716fa3804740854",
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

  //check if the specified size is contained in the product
  product.variations.forEach((variation: ProductVariation, index: number) => {
    if (variation.id === productVariationId) {
      variationIndex = index;
      searchedVariation = variation;
    }
  });

  product.variations[variationIndex].lots.forEach((lot: EditLotsInput) => {
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
        { $inc: { "productVariations.$.quantity": -quantity } }
      );
      return true;
    } else {
      customError({
        code: "404",
        path: "cart",
        message: `the specified productVariation not existing in the cart`,
      });
    }
  }

  if (!cart) {
    customError({
      code: "404",
      path: "cart",
      message: `the user does not have any ${product.shopInfo.name}'s products in the cart`,
    });
  }

  return true;
};
