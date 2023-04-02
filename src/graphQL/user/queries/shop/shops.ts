import { QueryShopsArgs } from "src/graphQL/types/types";
import getRequestedFields from "../../../../controllers/getRequestedFields";
// import capByCap from "../../../../controllers/queries/capByCap";
import Shop from "../../../../schemas/Shop.model";

export const shops = async (
  _: any,
  { limit, offset, filters }: QueryShopsArgs,
  __: any,
  info: any
) => {
  // const searchedCap = await capByCap(filters.cap);

  // const coordinates = searchedCap.location.coordinates;

  const checkName = () => {
    if (filters.name != null) {
      return {
        text: {
          query: filters.name,
          path: "name",
          score: { boost: { value: 1 } },
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

  const shops = await Shop.aggregate([
    {
      $search: {
        index: "ShopSearchIndex",
        compound: {
          must: [
            checkName(),
            // {
            //   geoWithin: {
            //     path: "address.location",
            //     score: {
            //       boost: {
            //         value: 3,
            //       },
            //     },
            //     circle: {
            //       center: {
            //         type: "Point",
            //         coordinates: [coordinates[0], coordinates[1]],
            //       },
            //       radius: range,
            //     },
            //   },
            // },
          ],
          should: [
            //!get the best ranked name on the top of the list
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
      $match: {
        status: "active",
      },
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
  ])
    .skip(offset)
    .limit(limit);

  return shops;
};
