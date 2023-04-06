import Order from "../../schemas/Order.model.js";
import { QueryAdminSeeAllOrdersArgs } from "../types/types.js";
import { Context } from "../../../apollo/context.js";
import checkFirebaseErrors from "../../controllers/checkFirebaseErrors.js";
import customError from "../../controllers/errors/customError.js";
import getRequestedFields from "../../controllers/getRequestedFields.js";

export const adminSeeAllOrders = async (
  _,
  { offset, limit, filters }: QueryAdminSeeAllOrdersArgs,
  { admin, req }: Context,
  info
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

  // const orders = await Order.find({
  //   status: filters?.status || { $exists: true },
  //   code: filters?.code || { $exists: true },
  //   _id: filters?.id || { $exists: true },
  //   "user.email": filters?.user?.email || { $exists: true },
  //   "user.id": filters?.user?.id || { $exists: true },
  //   "user.firebaseID": filters?.user?.firebaseId || { $exists: true },
  //   "shop.id": filters?.shop?.id || { $exists: true },
  //   "shop.businessId": filters?.business?.id || { $exists: true },
  //   "shop.businessFirebaseId": filters?.business?.firebaseId || {
  //     $exists: true,
  //   },
  // });
  const orders = await Order.aggregate([
    {
      $match: {
        $and: [
          {
            status: filters?.status || { $exists: true },
          },
          // { code: filters?.code || {} },
          // {
          //   _id: filters?.id || {},
          // },
          // {
          //   "user.email": filters?.user?.email || {},
          // },
          // { "user.email": filters?.user?.email || { $exists: true } },
          // { "user.id": filters?.user?.id || {} },
          // { "user.firebaseID": filters?.user?.firebaseId || {} },
          // { "shop.id": filters?.shop?.id || {} },
          // { "shop.businessId": filters?.business?.id || {} },
          // { "shop.businessFirebaseId": filters?.business?.firebaseId || {} },
        ],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        ...getRequestedFields(info),
        _id: 0,
        id: "$_id",
      },
    },
  ])
    .skip(offset)
    .limit(limit);
  return orders;
};
