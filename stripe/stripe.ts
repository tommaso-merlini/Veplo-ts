require("dotenv").config();
import Stripe from "stripe";
let stripe;

if (process.env.NODE_ENV !== "production") {
  stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY, {
    apiVersion: "2022-11-15",
  });
} else {
  stripe = new Stripe(process.env.STRIPE_PROD_SECRET_KEY, {
    apiVersion: "2022-11-15",
  });
}

export default stripe;
