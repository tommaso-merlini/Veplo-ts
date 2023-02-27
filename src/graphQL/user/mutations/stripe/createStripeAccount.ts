import { Context } from "../../../../../apollo/context";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import businessById from "../../../../controllers/queries/businessById";
import Business from "../../../../schemas/Business.model";

export const createStripeAccount = async (
  _,
  { businessName, vatId, phone },
  { admin, req, stripe }: Context
) => {
  let token = {
    email: "prova@prova.it",
    uid: "firebaseId",
    mongoId: "63fcea8f60c595a4975d71dc",
    isBusiness: true,
  };
  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
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

  //TODO check that the business does not have already the stripeId from mongodb
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
    business_type: "company",
    company: {
      name: businessName,
      vat_id: vatId,
    },
    metadata: {
      firebaseId: token.uid,
      mongoId: token.mongoId,
    },
  });

  await Business.updateOne(
    { _id: token.mongoId },
    {
      businessName,
      phone,
      vatId,
      status: "first_KYC_required",
      stripe: {
        id: account.id,
      },
    }
  );

  return account.id;
};
