import { QueryOrderArgs } from "src/graphQL/types/types.js";
import { Context } from "../../../../../apollo/context.js";
import authenticateToken from "../../../../controllers/authenticateToken.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import orderById from "../../../../controllers/queries/orderById.js";

export const order = async (
  _: any,
  { id }: QueryOrderArgs,
  { admin, req }: Context
) => {
  const order = await orderById(id);

  return order;
};
