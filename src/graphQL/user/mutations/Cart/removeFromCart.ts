import { Context } from "../../../../../apollo/context";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import customError from "../../../../controllers/errors/customError";
import Cart from "../../../../schemas/Cart.model";
import Product from "../../../../schemas/Product.model";

export const removeFromCart = async (
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
  product.variations.forEach((variation, index) => {
    if (variation.id === productVariationId) {
      variationIndex = index;
      searchedVariation = variation;
    }
  });

  product.variations[variationIndex].lots.forEach((lot) => {
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
    userId: token.mongoId,
    "shopInfo.id": product.shopInfo.id,
  });

  if (cart) {
    //vedere se la variation e' gia' presente nel carrello
    cart.productVariations.forEach(async (variation) => {
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
