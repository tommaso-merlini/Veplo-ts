import { Context } from "../../../../../apollo/context";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import Cart from "../../../../schemas/Cart.model";
import Product from "../../../../schemas/Product.model";

export const addToCart = async (
  _,
  { productVariationId },
  { admin, req }: Context
) => {
  let token;
  let isVariationDuplicate;
  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  } else {
    token = {
      mongoId: "mongoid",
    };
  }

  const product = await Product.findOne({
    "variations._id": productVariationId,
  });

  const cart = await Cart.findOne({
    userId: token.mongoId,
    "shopInfo.id": product.shopInfo.id,
  });

  if (cart) {
    //check if there is the variation in the cart
    cart.variations.forEach((variation) => {
      if (variation.id === productVariationId) {
        isVariationDuplicate = true;
      }
    });

    if (isVariationDuplicate) {
      await cart.updateOne(
        { _id: cart.id },
        {
          $inc: { "variations.id.": 1000 },
        }
      );
    }
  }

  const shopId = product.shopInfo.id;

  return true;
};
