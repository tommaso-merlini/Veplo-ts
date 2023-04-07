import { Context } from "../../../../../apollo/context.js";
import { MutationReturnOrderArgs } from "src/graphQL/types/types.js";
import orderById from "../../../../controllers/queries/orderById.js";
import customError from "../../../../controllers/errors/customError.js";
import { dateDiffInDays } from "../../../../controllers/dateDiffInDays.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import authenticateToken from "../../../../controllers/authenticateToken.js";
import Order from "../../../../schemas/Order.model.js";

export const returnOrder = async (
  _,
  { id, why }: MutationReturnOrderArgs,
  { admin, req }: Context
) => {
  const status = "RET01";
  let token;
  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  } else {
    token = {
      firebaseId: "prova",
      mongoId: "",
      isBusiness: false,
    };
  }

  if (token.isBusiness) {
    customError({
      code: "400",
      path: "role",
      message: "this function is only accessible buy a user",
    });
  }

  const order = await orderById(id);

  if (order.status !== "SHIP03") {
    customError({
      code: "400",
      path: "order status",
      message: "the order status must be SHIP03 in order to return it",
    });
  }

  //token operations
  if (process.env.NODE_ENV !== "development")
    authenticateToken(
      token?.mongoId,
      [String(order.user.id)],
      token?.isBusiness,
      false
    );

  const diffDays = dateDiffInDays(order.createdAt, new Date());

  if (diffDays > 15) {
    customError({
      code: "406",
      path: "order date",
      message: "the order was created more than 15 days ago",
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

  console.log(diffDays);
  //TODO mandare email all'utente
  return true;
};
