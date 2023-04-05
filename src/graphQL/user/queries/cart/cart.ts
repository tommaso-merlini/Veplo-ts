import { QueryCartArgs } from "src/graphQL/types/types.js";
import cartById from "../../../../controllers/queries/cartById.js";

export const cart = async (
  _: any,
  { id }: QueryCartArgs,
  __: any,
  info: any
) => {
  const cart = await cartById(id, info);

  return cart;
};
