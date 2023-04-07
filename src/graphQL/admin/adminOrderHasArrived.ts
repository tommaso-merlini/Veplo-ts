import checkFirebaseErrors from "../../controllers/checkFirebaseErrors.js";
import { Context } from "../../../apollo/context.js";
import { MutationAdminOrderHasArrivedArgs } from "../types/types.js";
import customError from "../../controllers/errors/customError.js";
import orderById from "../../controllers/queries/orderById.js";
import Order from "../../schemas/Order.model.js";

export const adminOrderHasArrived = async (
  _,
  { id }: MutationAdminOrderHasArrivedArgs,
  { admin, req }: Context
) => {
  const status = "SHIP03";

  let token;

  try {
    token = await admin.auth().verifyIdToken(req.headers.authorization);
  } catch (e) {
    checkFirebaseErrors(e);
  }

  if (!token.isAdmin || token.isAdmin === null) {
    customError({
      code: "403",
      path: "admin",
      message: "you must be an admin to access this function",
    });
  }

  const order = await orderById(id);

  if (order.status != "SHIP02") {
    customError({
      code: "400",
      path: "order status",
      message:
        "order status must be CANC02 in order to make it SHIP03 (arrived)",
    });
  }
  await Order.updateOne(
    {
      _id: id,
    },
    {
      status,
      $push: {
        history: {
          status,
          date: new Date(),
        },
      },
    }
  );

  return true;

  //TODO mandare email all'utente
};
