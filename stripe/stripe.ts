import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
if (process.env.NODE_ENV !== "production") {
  var stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY || "", {
    apiVersion: "2022-11-15",
  });
} else {
  var stripe = new Stripe(process.env.STRIPE_PROD_SECRET_KEY || "", {
    apiVersion: "2022-11-15",
  });
}

export default stripe;
