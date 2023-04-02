import { QueryShopArgs } from "src/graphQL/types/types";
import shopById from "../../../../controllers/queries/shopById";

export const shop = async (
  _: any,
  { id }: QueryShopArgs,
  __: any,
  info: any
) => {
  const shop = await shopById(id, info);

  return shop;
};
