import Order from "../../schemas/Order.model.js";
import { QueryAdminSeeAllOrdersArgs } from "../types/types.js";
import { Context } from "../../../apollo/context.js";
import checkFirebaseErrors from "../../controllers/checkFirebaseErrors.js";
import customError from "../../controllers/errors/customError.js";

export const adminSeeAllOrders = async (
  _,
  { filters }: QueryAdminSeeAllOrdersArgs,
  { admin, req }: Context
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
      isAdmin: true,
    };
  }

  if (!token.isAdmin) {
    customError({
      code: "403",
      path: "admin",
      message: "you must be an admin to access this function",
    });
  }
  const orders = await Order.find({
    status: filters.status,
  });
  return orders;
};
