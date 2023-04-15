import { Context } from "../../../../../apollo/context.js";
import authenticateToken from "../../../../controllers/authenticateToken.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import orderById from "../../../../controllers/queries/orderById.js";
import lodash from "lodash";
import Order from "../../../../schemas/Order.model.js";
import customError from "../../../../controllers/errors/customError.js";
import { MutationEditOrderArgs } from "../../../../graphQL/types/types.js";
import { DecodedIdToken } from "firebase-admin/auth";

export const editOrder = async (
  _: any,
  { id, options }: MutationEditOrderArgs,
  { admin, req }: Context
) => {
  let token;
  let status = "SHIP01";
  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  } else {
    token = {
      mongoId: "641f209eca22d34c3ca1ec1s",
      isBusiness: true,
      isAdmin: false,
    };
  }

  //if the user is not an amdin
  if (token?.isAdmin !== true) {
    if (options.url != null) {
      //can't modify the url
      delete options.url;
    }
    if (options.courier == null || options.code == null) {
      customError({
        code: "400",
        path: "input",
        message: "you need to input the code and the courier",
      });
    }
  }

  if (options.url != null) {
    //if the admin inputted the url
    status = "SHIP02";
  }

  const order = await orderById(id);

  //token operations
  if (process.env.NODE_ENV !== "development")
    authenticateToken({
      tokenId: token.mongoId,
      isBusiness: token.isBusiness,
      isAdmin: token.isAdmin,
      ids: [String(order?.shop?.businessId)],
    });

  const orderShipping = order?.shipping;

  const mergedShipping = lodash.merge(orderShipping, options);

  await Order.updateOne(
    { _id: id },
    {
      shipping: mergedShipping,
      status: status,
    }
  );

  return true;
};
