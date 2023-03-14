import { Context } from "../../../../../apollo/context";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import customError from "../../../../controllers/errors/customError";
import User from "../../../../schemas/User.model";

export const createUser = async (
  _,
  { options },
  { req, admin, stripe }: Context
) => {
  //token operations
  let token;
  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  } else {
    token = {
      uid: "prova",
      email: "tommaso3.prova@gmail.com",
      // mongoId: "63fcea8f60c595a4975d71dc",
    };
  }

  //check the account belongs to a user
  if (token.isBusiness && process.env.NODE_ENV !== "development") {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "403",
        customPath: "token",
        customMessage: "token's owner is a business, it must be a user",
      },
    });
  }

  //check gender is m or f
  if (
    options.gender != null &&
    options.gender !== "m" &&
    options.gender !== "f"
  ) {
    customError({
      code: "400",
      path: "user gender",
      message: `user gender can only be m or f`,
    });
  }

  //check if there are any users with se same email
  const userWithSameEmail = await User.findOne({
    email: token.email,
  });

  if (userWithSameEmail) {
    customError({
      code: "409",
      path: "user",
      message: `a user with email ${token.email} already exists`,
    });
  }

  //create user into stripe
  const customer = await stripe.customers.create({
    email: token.email,
    name: `${options.name} ${options.surname}`,
    preferred_locales: ["IT"],
    metadata: {
      firebaseId: token.uid,
    },
  });

  const newUser = await User.create({
    ...options,
    createdAt: new Date(),
    firebaseId: token.uid,
    stripeId: customer.id,
    email: token.email,
  });

  await stripe.customers.update(customer.id, {
    metadata: {
      firebaseId: token.uid,
      mongoId: newUser.id,
    },
  });

  if (process.env.NODE_ENV !== "development") {
    await admin.auth().setCustomUserClaims(token.uid, {
      isBusiness: false,
      firebaseId: token.uid,
      mongoId: newUser.id,
    });
  }

  return newUser.id;
};
