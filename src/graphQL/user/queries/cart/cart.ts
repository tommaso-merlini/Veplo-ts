import { QueryCartArgs } from "src/graphQL/types/types";
import cartById from "../../../../controllers/queries/cartById";

export const cart = async (
  _: any,
  { id }: QueryCartArgs,
  __: any,
  info: any
) => {
  const cart = await cartById(id, info);

  return cart;
};
