import { size } from "lodash";
import getRequestedFields from "../../../../controllers/getRequestedFields";
import capByCap from "../../../../controllers/queries/capByCap";
import Product from "../../../../schemas/Product.model";
import Variation from "../../../../schemas/Variation.model";

export const products = async (
  _,
  { range, limit, offset, filters },
  __,
  info
) => {
  const searchedCap = await capByCap(filters.cap);

  const coordinates = searchedCap.location.coordinates;
  const latitude = coordinates[0];
  const longitude = coordinates[1];
  const gender = filters.gender;
  const macroCategory = filters.macroCategory;
  const brand = filters.brand;
  const sizes = filters.sizes;
  const colors = filters.colors;
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
  const checkGender = () => {
    if (gender != null) {
      return { "info.gender": gender };
    } else {
      return {};
    }
  };
  const checkBrands = () => {
    if (brand != null) {
      return { "info.brand": brand };
    } else {
      return {};
    }
  };
  const checkSizes = () => {
    if (sizes != null) {
      return {
        "lots.size": { $in: sizes },
      };
    } else {
      return {};
    }
  };
  const checkMacroCategory = () => {
    if (filters.macroCategory != null && filters.macroCategory != "") {
      return { "info.macroCategory": macroCategory };
    } else {
      return {};
    }
  };

  const checkMaxPrice = () => {
    if (filters.maxPrice != null) {
      return {
        $or: [
          { "price.v2": { $lte: filters.maxPrice } },
          { "price.v1": { $lte: filters.maxPrice } },
        ],
      };
    } else {
      return {};
    }
  };

  const checkMinPrice = () => {
    if (filters.minPrice != null) {
      return {
        $or: [
          { "price.v2": { $gte: filters.minPrice } },
          { "price.v1": { $gte: filters.minPrice } },
        ],
      };
    } else {
      return {};
    }
  };

  const checkColors = () => {
    if (colors != null) {
      return { color: { $in: colors } };
    } else {
      return {};
    }
  };

  let products: any = await Product.aggregate([
    {
      $search: {
        index: "ProductSearchIndex",
        compound: {
          must: [
            {
              geoWithin: {
                path: "location",
                circle: {
                  center: {
                    type: "Point",
                    coordinates: [latitude, longitude],
                  },
                  radius: range,
                },
              },
            },
          ],

          should: [
            //!get the best ranked name on the top of the list
            checkName(),
            {
              near: {
                path: "updatedAt",
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
    //TODO check mongodb $filters(aggregation) for better filters

    // { $match: checkGender() },
    // { $match: checkMacroCategory() },
    // { $match: checkBrands() },
    // // { $match: checkMinPrice() },
    // // { $match: checkMaxPrice() },

    //!uncomment if there are problems
    // {
    //   $unwind: {
    //     path: "$variations",
    //     includeArrayIndex: "arrayIndex",
    //   },
    // },
    // { $match: checkSizes() },
    // { $match: checkColors() },
    // { $group: { _id: "$_id", variations: { $push: "$variations.color" } } },
    {
      $match: {
        status: "active",
        // "shopInfo.status": "active",
      },
    },

    {
      $match: {
        $and: [
          {
            variations: {
              $elemMatch: {
                $and: [
                  checkSizes(),
                  checkColors(),
                  checkMinPrice(),
                  checkMaxPrice(),
                ],
              },
            },
          },
          checkGender(),
          checkMacroCategory(),
          checkBrands(),
        ],
      },
    },

    {
      $project: {
        score: { $meta: "searchScore" },
        ...getRequestedFields(info),
        _id: 0,
        id: "$_id",
      },
    },
  ])
    .skip(offset)
    .limit(limit);

  console.log("==================");
  console.log(products);
  console.log("==================");

  return products;
};