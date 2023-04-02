import { QueryProductArgs } from "src/graphQL/types/types";
import productById from "../../../../controllers/queries/productById";

export const product = async (
  _: any,
  { id }: QueryProductArgs,
  __: any,
  info: any
) => {
  const product = await productById(id, info);

  return product;
};
