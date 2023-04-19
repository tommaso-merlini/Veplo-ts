import {
  QueryProductsArgs,
  QueryProductsAutoCompleteArgs,
} from "../../../../graphQL/types/types.js";
import { productsWithFilters } from "../../../../controllers/queries/productsWithFilters.js";
import Product from "../../../../schemas/Product.model.js";
import getRequestedFields from "../../../../controllers/getRequestedFields.js";
import customError from "../../../../controllers/errors/customError.js";

export const productsAutoComplete = async (
  _: any,
  { query }: QueryProductsAutoCompleteArgs,
  __: any,
  info: any
) => {
  if (query.length <= 2) {
    customError({
      code: "400",
      path: "query",
      message: "query too short",
    });
  }
  const products: any = await Product.aggregate([
    {
      $search: {
        index: "ProductSearchIndex",
        compound: {
          filter: [
            {
              autocomplete: {
                path: "name",
                query: query,
              },
            },
          ],
          should: [
            //boost products based on how many times it has been bought
            {
              range: {
                path: "orderCounter",
                gt: 0,
                lt: 20,
                score: {
                  boost: {
                    value: 1,
                  },
                },
              },
            },
            {
              range: {
                path: "orderCounter",
                gte: 20,
                lt: 80,
                score: {
                  boost: {
                    value: 2,
                  },
                },
              },
            },
            {
              range: {
                path: "orderCounter",
                gte: 80,
                score: {
                  boost: {
                    value: 3,
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      $limit: 3,
    },

    {
      $project: {
        score: { $meta: "searchScore" },

        ...getRequestedFields(info),
        _id: 0,
        id: "$_id",
      },
    },
  ]);

  return products;
};
