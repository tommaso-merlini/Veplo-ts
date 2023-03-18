import { Context } from "../../../../../apollo/context";
import authenticateToken from "../../../../controllers/authenticateToken";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import Business from "../../../../schemas/Business.model";
import Cart from "../../../../schemas/Cart.model";
import Product from "../../../../schemas/Product.model";
require("dotenv").config();

export const checkout = async (
  _,
  { cartId },
  { admin, req, stripe }: Context
) => {
  //TODO calcolare amount
  let token;
  const lineItems = [];
  const variations = [];
  const variationsIds = [];
  let IVA;
  if (process.env.NODE_ENV !== "production") {
    IVA = process.env.STRIPE_IVA_TEST;
  } else {
    IVA = process.env.STRIPE_IVA_PROD; //TODO
  }
  let successUrl;
  if (process.env.NODE_ENV !== "production") {
    successUrl = "http://localhost:3000/checkout?success=true";
  } else {
    successUrl = "https://www.veplo.it/checkout?success=true";
  }

  let cancelUrl;
  if (process.env.NODE_ENV !== "production") {
    cancelUrl = "http://localhost:3000/checkout?cancelled=true";
  } else {
    cancelUrl = "https://www.veplo.it/checkout?cancelled=true";
  }

  let shippingRate;
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

  const cart = await Cart.findById(cartId);
  const business = await Business.findById(cart.shopInfo.businessId);

  //get variationsids
  cart.productVariations.forEach((variation) => {
    variationsIds.push(variation.variationId);
  });

  for (let productVariation of cart.productVariations) {
    const product = await Product.findOne({
      "variations._id": productVariation.variationId,
    });

    for (let id of variationsIds) {
      let ok = false;
      for (let variation of product.variations) {
        if (variation._id.toString() === id.toString()) {
          for (let cartVariation of cart.productVariations) {
            if (cartVariation.variationId.toString() === id.toString()) {
              variations.push({
                name: product.name,
                price: product.price,
                quantity: cartVariation.quantity,
                size: cartVariation.size,
                photo: variation.photos[0],
              });
              ok = true;
              break;
            }
          }
          if (ok) break;
        }
        if (ok) break;
      }
    }
  }

  //insert variations into lineItems
  for (let variation of variations) {
    let price;
    if (variation.price.v2) {
      price = variation.price.v2;
    } else {
      price = variation.price.v1;
    }

    total = total + price * variation.quantity;

    lineItems.push({
      price_data: {
        currency: "eur",
        unit_amount: price * 100,
        product_data: {
          name: `${variation.brand} - ${variation.name} (colore: ${variation.color}, taglia: ${variation.size})`,
          images: [
            `https://ik.imagekit.io/veploimages/${variation.photo}?tr=w-171,h-247"`,
          ],
        },
      },
      quantity: variation.quantity,
      tax_rates: IVA,
    });
  }

  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    // payment_method_types: ['card', 'klarna'],
    //customer_email: 'customer@example.com',
    currency: "eur",
    locale: "it",
    customer: "cus_NQHMcnKSEq3n2J", //user.stripeId
    payment_intent_data: {
      automatic_payment_methods: { enabled: true },
      description: `checkout ordine di user ${token.mongoId}`,
      metadata: {
        userId: token.mongoId,
        shopId: cart.shopInfo.id,
        businessId: cart.shopInfo.businessId,
      },
      receipt_email: token.email,
      setup_future_usage: "off_session",
      application_fee_amount: 1500, //TODO la fee di veplo + commissioni (costo della transazione 2% + 30c)
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
  return;
};
