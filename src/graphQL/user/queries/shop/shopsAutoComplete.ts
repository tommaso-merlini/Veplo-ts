import { QueryShopsAutoCompleteArgs } from "../../../../graphQL/types/types.js";
import getRequestedFields from "../../../../controllers/getRequestedFields.js";
import customError from "../../../../controllers/errors/customError.js";
import Shop from "../../../../schemas/Shop.model.js";

export const shopsAutoComplete = async (
  _: any,
  { query }: QueryShopsAutoCompleteArgs,
  __: any,
  info: any
) => {
  const LIMIT = 3;
  if (query.length <= 2) {
    customError({
      code: "400",
      path: "query",
      message: "query too short",
    });
  }
  const shops: any = await Shop.aggregate([
    {
      $search: {
        index: "ShopSearchIndex",
        compound: {
          filter: [
            {
              autocomplete: {
                path: "name",
                query: query,
              },
            },
            {
              text: {
                query: "active",
                path: "status",
                score: { constant: { value: 0 } },
              },
            },
          ],
        },
      },
    },
    {
      $limit: LIMIT,
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

  return shops;
};
