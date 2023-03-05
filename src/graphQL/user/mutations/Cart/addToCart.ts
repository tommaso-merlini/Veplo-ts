import { Context } from "../../../../../apollo/context";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import customError from "../../../../controllers/errors/customError";
import Cart from "../../../../schemas/Cart.model";
import Product from "../../../../schemas/Product.model";

export const addToCart = async (
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

  //check if shop is active
  if (product.shopInfo.status !== "active") {
    customError({
      code: "400",
      path: "shop status",
      message: "the status is not active",
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
    //check if there is the variation in the cart
    cart.productVariations.forEach((variation) => {
      if (String(variation.variationId) === productVariationId) {
        isVariationDuplicate = true;
      }
    });

    if (isVariationDuplicate) {
      // incrementare solo la quantita
      await Cart.updateOne(
        {
          _id: cart.id,
          "productVariations.variationId": productVariationId,
        },
        { $inc: { "productVariations.$.quantity": quantity } }
        // false,
        // true
      );
    }

    if (!isVariationDuplicate) {
      // aggiungere la variation nell'array variations
      await Cart.updateOne(
        { _id: cart.id },
        {
          $push: {
            productVariations: {
              variationId: productVariationId,
              photo: searchedVariation.photos[0],
              name: product.name,
              price: searchedVariation.price,
              quantity,
              color: searchedVariation.color,
              size,
              status: searchedVariation.status,
            },
          },
        }
      );
    }
  }

  if (!cart) {
    await Cart.create({
      userId: token.mongoId,
      status: "active",
      shopInfo: product.shopInfo,
      productVariations: [
        {
          variationId: productVariationId,
          photo: searchedVariation.photos[0],
          name: product.name,
          price: searchedVariation.price,
          quantity,
          color: searchedVariation.color,
          size,
          status: searchedVariation.status,
        },
      ],
    });
  }

  return true;
};
