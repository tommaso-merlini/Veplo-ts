import { QueryShopsArgs } from "src/graphQL/types/types.js";
import getRequestedFields from "../../../../controllers/getRequestedFields.js";
// import capByCap from "../../../../controllers/queries/capByCap";
import Shop from "../../../../schemas/Shop.model.js";

export const shops = async (
  _: any,
  { limit, offset, filters }: QueryShopsArgs,
  __: any,
  info: any
) => {
  // const searchedCap = await capByCap(filters.cap);

  // const coordinates = searchedCap.location.coordinates;

  const filtersInfo: any[] = [];

  const checkName = () => {
    if (filters.name != null) {
      return {
        text: {
          query: filters.name,
          path: "name",
          score: { boost: { value: 15 } },
          fuzzy: {
            maxEdits: 2,
            prefixLength: 4,
          },
        },
      };
    } else {
      return {
        exists: {
          path: "name",
        },
      };
    }
  };

  const checkCategories = () => {
    if (filters.categories != null) {
      filtersInfo.push({
        phrase: {
          query: filters.categories,
          path: "categories",
          score: {
            boost: {
              value: 2,
            },
          },
        },
      });
    }
  };

  const checkAllFilters = () => {
    checkCategories();
  };

  checkAllFilters();

  const shops = await Shop.aggregate([
    {
      $search: {
        index: "ShopSearchIndex",
        compound: {
          filter: [
            ...filtersInfo,
            {
              text: {
                query: "active",
                path: "status",
                score: { constant: { value: 0 } },
              },
            },
          ],
          should: [
            //!get the best ranked name on the top of the list
            checkName(),
            {
              near: {
                path: "createdAt",
                origin: new Date(),
                pivot: 7776000000,
                score: {
                  boost: {
                    value: 1,
                  },
                },
              },
            },
          ],
        },
      },
    },

    {
      $skip: offset,
    },

    {
      $limit: limit,
    },

    {
      $project: {
        score: { $meta: "searchScore" },
        // name: 1,
        ...getRequestedFields(info),
        _id: 0,
        id: "$_id",
      },
    },
  ]);

  return shops;
};
