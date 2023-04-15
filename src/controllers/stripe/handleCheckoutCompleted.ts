import stripe from "../../../stripe/stripe.js";
import Cart from "../../schemas/Cart.model.js";
import Order from "../../schemas/Order.model.js";
import Product from "../../schemas/Product.model.js";
import Business from "../../schemas/Business.model.js";
import customError from "../errors/customError.js";
import { deleteCartById } from "../mutations/deleteCartById.js";
import { generateCode } from "../generateCode.js";
import { getStatus } from "../getStatus.js";
import { removeBoughtQuantityFromVariation } from "../removeBoughtQuantityFromVariation.js";
import userById from "../queries/userById.js";
import shopById from "../queries/shopById.js";
import businessById from "../queries/businessById.js";

export const handleCheckoutCompleted = async (session: any) => {
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
  const user = await userById(paymentIntent.metadata.userId);
  const shop = await shopById(paymentIntent.metadata.shopId);
  const business = await businessById(paymentIntent.metadata.businessId);
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
    for (let variation of product.variations as any[]) {
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
          productId: String(variation.productId),
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

  await Order.create({
    code,
    status,
    createdAt: new Date(),
    checkoutSessionId: session.id,
    history: [
      {
        status,
        date: new Date(),
      },
    ],
    user: {
      id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      stripeId: user.stripeId,
      firebaseId: user.firebaseId,
    },
    recipient: {
      name: session.shipping_details.name,
      phone: session.customer_details.phone,
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
      businessId: business.id,
      businessFirebaseId: business.firebaseId,
    },
    shipping: {
      url: null,
      courier: null,
      code: null,
    },
    productVariations: variationsInCartWithSize,
  });

  await deleteCartById(cart.id);

  await removeBoughtQuantityFromVariation(variationsInCartWithSize);
};
