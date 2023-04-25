import { QueryProductsArgs } from "src/graphQL/types/types.js";
import { productsWithFilters } from "../../../../controllers/queries/productsWithFilters.js";
import { BetterInputGenerator } from "../../../../controllers/BetterInputGenerator.js";

export const products = async (
  _: any,
  { limit, sort, offset, filters }: QueryProductsArgs,
  __: any,
  info: any
) => {
  const betterInput = BetterInputGenerator(filters);
  console.log(betterInput);
  const products: any = await productsWithFilters({
    info,
    limit,
    offset,
    filters: betterInput,
    sort,
    canSeeAllStatuses: false,
  });

  return products;
};
