import {
  CartProductVariation,
  MutationCheckoutArgs,
} from "src/graphQL/types/types";
import { Context } from "../../../../../apollo/context";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import customError from "../../../../controllers/errors/customError";
import businessById from "../../../../controllers/queries/businessById";
import userById from "../../../../controllers/queries/userById";
import Cart from "../../../../schemas/Cart.model";
import Product from "../../../../schemas/Product.model";
require("dotenv").config();

export const checkout = async (
  _,
  { shopId }: MutationCheckoutArgs,
  { admin, req, stripe }: Context
) => {
  //TODO calcolare amount
  let token;
  const lineItems = [];
  const variations = [];
  const variationsIds: string[] = [];
  const variationsInCart = [];
  const veploFee: number | undefined = +process.env.VEPLO_FEE;
  const transactionFeePercentage: number | undefined =
    +process.env.TRANSACTION_FEE_PERCENTAGE;
  const transactionFeeFixed: number | undefined =
    +process.env.TRANSACTION_FEE_FIXED;
  if (
    veploFee == undefined ||
    transactionFeePercentage == undefined ||
    transactionFeeFixed == undefined
  ) {
    customError({
      code: "400",
      path: "checkout",
      message: "internal server error, contact the assistency",
    });
  }
  let successUrl;
  let shippingRate;
  let cancelUrl;

  let IVA;
  if (process.env.NODE_ENV !== "production") {
    IVA = process.env.STRIPE_IVA_TEST;
  } else {
    IVA = process.env.STRIPE_IVA_PROD; //TODO
  }

  if (process.env.NODE_ENV !== "production") {
    shippingRate = process.env.STRIPE_SHIPPING_RATE_TEST;
  } else {
    shippingRate = process.env.STRIPE_SHIPPING_RATE_PROD; //TODO
  }

  let total = 0;
  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  } else {
    token = {
      mongoId: "6410ace3850a8aeb92bcbc9e",
      email: "test10@gmail.it",
    };
  }

  const cart = await Cart.findOne({
    userId: token?.mongoId,
    "shopInfo.id": shopId,
  });

  if (!cart) {
    customError({
      code: "404",
      path: "cart",
      message: "cart not found",
    });
  }

  if (process.env.NODE_ENV !== "production") {
    successUrl = `http://localhost:3000/orders?shop=${cart.shopInfo.name}`;
    cancelUrl = `http://localhost:3000/checkout/${shopId}`;
  } else {
    successUrl = `https://www.veplo.it/orders?shop=${cart.shopInfo.name}`;
    cancelUrl = `https://www.veplo.it/checkout/${shopId}`;
  }

  const user = await userById(token?.mongoId);
  const business = await businessById(cart.shopInfo.businessId);

  //get variationsids
  cart.productVariations.forEach((variation: CartProductVariation) => {
    variationsIds.push(variation.variationId);
  });

  // //insert the variations fields inside variations array
  // for (let productVariation of cart.productVariations) {
  //   const product = await Product.findOne({
  //     "variations._id": productVariation.variationId,
  //   });

  //   for (let id of variationsIds) {
  //     let ok = false;
  //     for (let variation of product.variations) {
  //       if (variation._id.toString() === id.toString()) {
  //         for (let cartVariation of cart.productVariations) {
  //           if (cartVariation.variationId.toString() === id.toString()) {
  //             variations.push({
  //               name: product.name,
  //               price: product.price,
  //               color: variation.color,
  //               quantity: cartVariation.quantity,
  //               size: cartVariation.size,
  //               brand: product.info.brand,
  //               photo: variation.photos[0],
  //               lots: variation.lots,
  //             });
  //             ok = true;
  //             break;
  //           }
  //         }
  //         if (ok) break;
  //       }
  //       if (ok) break;
  //     }
  //   }
  // }

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
        name: product.name,
        color: variation.color,
        photos: variation.photos,
        productId: product._id,
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
        // variationsInCartWithSize.push({
        //   productId: variation.productId,
        //   variationId: variation._id,
        //   photo: variation.photos[0],
        //   name: variation.name,
        //   price: variation.price,
        //   quantity: cartVariation.quantity,
        //   size: cartVariation.size,
        //   color: variation.color,
        // });
        let price;
        if (variation.price.v2 != null) {
          price = variation.price.v2;
        } else {
          price = variation.price.v1;
        }

        total = total + price;

        lineItems.push({
          price_data: {
            currency: "eur",
            unit_amount: Math.round(price * 100),
            product_data: {
              name: `${variation.name} - colore ${variation.color}`,
              description: `taglia ${cartVariation.size.toUpperCase()}, brand ${
                variation.brand
              }`,
              images: [
                `https://ik.imagekit.io/veploimages/${variation.photos[0]}?tr=w-171,h-247"`,
              ],
            },
          },
          quantity: cartVariation.quantity,
          tax_rates: [IVA],
        });
        break;
      }
    }
  }

  if (total < 5) {
    customError({
      code: "400",
      path: "total",
      message: "total must be grather than 5 euros",
    });
  }
  const applicationFeeAmount = Math.round(
    (total * veploFee +
      total * transactionFeePercentage +
      transactionFeeFixed) *
      100
  );

  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    // payment_method_types: ['card', 'klarna'],
    //customer_email: 'customer@example.com',
    currency: "eur",
    locale: "it",
    customer: user.stripeId,
    // automatic_payment_methods: { enabled: true },

    payment_intent_data: {
      description: `checkout ordine di user ${token?.mongoId}`,
      metadata: {
        userId: token?.mongoId,
        shopId: cart.shopInfo.id.toString(),
        businessId: cart.shopInfo.businessId.toString(),
        cartId: cart._id.toString(),
      },
      receipt_email: token?.email,
      setup_future_usage: "off_session",
      application_fee_amount: applicationFeeAmount,
      transfer_data: {
        destination: business.stripe.id,
      },
    },

    invoice_creation: {
      enabled: true,
      invoice_data: {
        description: "Acquisto con Veplo",
        metadata: { order: "order-xyz" },
        custom_fields: [{ name: "Purchase Order", value: "PO-XYZ" }],
        rendering_options: { amount_tax_display: "include_inclusive_tax" },
        footer: "Veplo",
      },
    },

    line_items: lineItems,
    mode: "payment",

    //TODO ricordarsi di inserire i termini nel servizio
    // consent_collection: {
    //   terms_of_service: 'required',
    // },
    shipping_address_collection: { allowed_countries: ["IT"] },
    custom_text: {
      shipping_address: {
        message: "La preghiamo di inserire il suo indirizzo completo.",
      },
      submit: {
        message: "Ricevera' un'email con la fattura dell'ordine",
      },
    },
    shipping_options: [{ shipping_rate: shippingRate }], //TODO shippingrate -> mettere su .env (test/prod)
    phone_number_collection: {
      enabled: true,
    },

    //TODO da utilizzare quando inseriremo le promozioni
    //allow_promotion_codes: true,
    expires_at: Math.floor(Date.now() / 1000) + 3600 * 0.5, // Configured to expire after 30 minutes
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  //TODO DOPO fare l'ordine in mongodb
  return session.url;
};
