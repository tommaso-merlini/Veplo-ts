import { QueryProductArgs } from "src/graphQL/types/types.js";
import productById from "../../../../controllers/queries/productById.js";

export const product = async (
  _: any,
  { id }: QueryProductArgs,
  __: any,
  info: any
) => {
  const product = await productById(id);

  return product;
};
