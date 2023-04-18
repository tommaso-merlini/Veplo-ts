import { QueryProductsArgs } from "src/graphQL/types/types.js";
import { productsWithFilters } from "../../../../controllers/queries/productsWithFilters.js";

export const products = async (
  _: any,
  { limit, sort, offset, filters }: QueryProductsArgs,
  __: any,
  info: any
) => {
  const products: any = await productsWithFilters({
    info,
    limit,
    offset,
    filters,
    sort,
    statuses: ["active"],
  });

  // console.log("==================");
  // console.log(products);
  // console.log("==================");

  return products;
};
