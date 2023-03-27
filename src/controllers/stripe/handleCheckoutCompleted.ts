import stripe from "../../../stripe/stripe";
import Cart from "../../schemas/Cart.model";
import Order from "../../schemas/Order.model";
import User from "../../schemas/User.model";
import Shop from "../../schemas/Shop.model";
import Product from "../../schemas/Product.model";
import Business from "../../schemas/Business.model";
import customError from "../errors/customError";
import { deleteCartById } from "../mutations/deleteCartById";
import { generateCode } from "../generateCode";
import { getStatus } from "../getStatus";
import { removeBoughtQuantityFromVariation } from "../removeBoughtQuantityFromVariation";

export const handleCheckoutCompleted = async (session) => {
  const paymentIntentId = session.payment_intent;
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const variationsIds = [];
  const variations = [];
  const variationsInCart = [];
  const variationsInCartWithSize = [];
  const code = generateCode();
  const status = getStatus(session.payment_status);

  const cart = await Cart.findById(paymentIntent.metadata.cartId);
  if (!cart) {
    customError({
      code: "404",
      path: "cart",
      message: "cart not found",
    });
  }
  const user = await User.findById(paymentIntent.metadata.userId);
  const shop = await Shop.findById(paymentIntent.metadata.shopId);
  const business = await Business.findById(paymentIntent.metadata.businessId);
  //get variationsIds
  for (let variation of cart.productVariations) {
    variationsIds.push(variation.variationId);
  }

  //get products
  const products = await Product.find({
    "variations._id": {
      $in: variationsIds,
    },
  });

  //get all the variations of every product
  for (let product of products) {
    await Product.updateOne(
      { _id: product._id },
      { $inc: { orderCounter: 1 } }
    );
    for (let variation of product.variations) {
      variations.push({
        _id: variation._id,
        photos: variation.photos,
        color: variation.color,
        productId: product._id,
        name: product.name,
        price: product.price,
        brand: product.info.brand,
      });
    }
  }

  //get only the variations that match the id from the variationsIds
  for (let variation of variations) {
    for (let id of variationsIds) {
      if (variation._id.toString() === id.toString()) {
        variationsInCart.push(variation);
        break;
      }
    }
  }

  //get the variation with the cart
  for (let cartVariation of cart.productVariations) {
    for (let variation of variationsInCart) {
      if (cartVariation.variationId.toString() === variation._id.toString()) {
        variationsInCartWithSize.push({
          productId: variation.productId,
          variationId: variation._id,
          photo: variation.photos[0],
          name: variation.name,
          price: variation.price,
          quantity: cartVariation.quantity,
          size: cartVariation.size,
          color: variation.color,
          brand: variation.brand,
        });
        break;
      }
    }
  }

  Order.create({
    cartId: paymentIntent.metadata.cartId,
    code,
    status,
    createdAt: new Date(),
    recipient: {
      id: user._id,
      name: session.shipping_details.name,
      phone: session.shipping_details.phone,
      address: {
        city: session.shipping_details.address.city,
        country: session.shipping_details.address.country,
        line1: session.shipping_details.address.line1,
        line2: session.shipping_details.address.line2,
        postalCode: session.shipping_details.address.postal_code,
        state: session.shipping_details.address.state,
      },
    },
    totalDetails: {
      amountDiscount: session.total_details.amount_discount / 100,
      amountShipping: session.total_details.amount_shipping / 100,
      amountTax: session.total_details.amount_tax / 100,
      subTotal: session.amount_subtotal / 100,
      total: session.amount_total / 100,
    },
    shop: {
      id: shop._id,
      name: shop.name,
      stripeId: business.stripe.id,
    },
    shipping: {
      url: null,
      courier: null,
      code: null,
    },
    productVariations: variationsInCartWithSize,
  });

  deleteCartById(cart._id);

  removeBoughtQuantityFromVariation(variationsInCartWithSize);
};
