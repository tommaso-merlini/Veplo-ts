import stripe from "../../../stripe/stripe";
import Cart from "../../schemas/Cart.model";
import Order from "../../schemas/Order.model";
import { v4 as uuidv4 } from "uuid";
import User from "../../schemas/User.model";
import Shop from "../../schemas/Shop.model";
import Product from "../../schemas/Product.model";
import Business from "../../schemas/Business.model";
import customError from "../errors/customError";

export const handleCheckoutCompleted = async (session) => {
  const paymentIntentId = session.payment_intent;
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const variationsIds = [];
  const variations = [];
  const variationsInCart = [];
  const variationsInCartWithSize = [];
  const uniqueId = uuidv4();

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
    for (let variation of product.variations) {
      variations.push({
        _id: variation._id,
        photos: variation.photos,
        color: variation.color,
        productId: product._id,
        name: product.name,
        price: product.price,
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
        });
        break;
      }
    }
  }

  console.log(variationsInCartWithSize);

  if (session.payment_status === "paid") {
    const order = await Order.findOne({
      cartId: paymentIntent.metadata.cartId,
    });
    if (order) {
      await Cart.updateOne(
        {
          _id: paymentIntent.metadata.cartId,
        },
        {
          status: "paid",
        }
      );
    } else {
      Order.create({
        cartId: paymentIntent.metadata.cartId,
        uniqueId,
        status: "paid",
        createdAt: new Date(),
        user: {
          id: user._id,
          name: user.name,
          surname: user.surname,
          address: {
            city: session.customer_details.address.city,
            country: session.customer_details.address.country,
            line1: session.customer_details.address.line1,
            line2: session.customer_details.address.line2,
            postalCode: session.customer_details.address.postal_code,
            state: session.customer_details.address.state,
          },
        },
        totalDetails: {
          amountDiscount: session.total_details.amount_discount,
          amountShipping: session.total_details.amount_shipping,
          amountTax: session.total_details.amount_tax,
          subTotal: session.amount_subtotal,
          total: session.amount_total,
        },
        shop: {
          id: shop._id,
          name: shop.name,
          stripeId: business.stripe.id,
        },
        productVariations: variationsInCartWithSize,
      });
    }
  } else {
    Order.create({
      cartId: paymentIntent.metadata.cartId,
      uniqueId,
      status: "pending",
      createdAt: new Date(),
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        address: {
          city: session.customer_details.address.city,
          country: session.customer_details.address.country,
          line1: session.customer_details.address.line1,
          line2: session.customer_details.address.line2,
          postalCode: session.customer_details.address.postal_code,
          state: session.customer_details.address.state,
        },
      },
      totalDetails: {
        amountDiscount: session.total_details.amount_discount,
        amountShipping: session.total_details.amount_shipping,
        amountTax: session.total_details.amount_tax,
        subTotal: session.amount_subtotal,
        total: session.amount_total,
      },
      shop: {
        id: shop._id,
        name: shop.name,
        stripeId: business.stripe.id,
      },
      productVariations: variationsInCartWithSize,
    });
  }
};