import { Context } from "../../../../../apollo/context";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import businessById from "../../../../controllers/queries/businessById";
import Business from "../../../../schemas/Business.model";

export const createStripeAccount = async (
  _,
  { businessName, vatNumber, phone },
  { admin, req, stripe }: Context
) => {
  let token;

  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  } else {
    token = {
      mongoId: "641f178dca22d34c3ca1ec01",
      isBusiness: true,
      email: "prova@prova.it",
      user_id: "firebaseId",
    };
  }

  if (!token.isBusiness && process.env.NODE_ENV !== "development") {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "403",
        customPath: "token",
        customMessage: "token's owner is not a business",
      },
    });
  }

  const business = await businessById(token.mongoId);

  if (business.stripe.id != null) {
    return business.stripe.id;
  }

  const account = await stripe.accounts.create({
    type: "express",
    country: "IT",
    email: token.email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    // business_type: Object.freeze({
    //   individual: "individual",
    //   company: "company",
    // }),
    // company: {
    //   name: businessName,
    //   vat_id: vatNumber,
    //   tax_id: vatNumber,
    // },
    metadata: {
      firebaseId: token.user_id,
      mongoId: token.mongoId,
    },
    settings: {
      payouts: {
        schedule: {
          delay_days: 30,
          interval: "weekly",
          weekly_anchor: "monday",
        },
      },
    },
  });

  await Business.updateOne(
    { _id: token.mongoId },
    {
      businessName,
      phone,
      vatNumber,
      status: "onboarding_KYC_requested",
      stripe: {
        id: account.id,
      },
    }
  );

  return account.id;
};
