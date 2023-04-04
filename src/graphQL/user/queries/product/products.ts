import { QueryProductsArgs } from "src/graphQL/types/types";
import customError from "../../../../controllers/errors/customError";
import getRequestedFields from "../../../../controllers/getRequestedFields";
// import capByCap from "../../../../controllers/queries/capByCap";
import Product from "../../../../schemas/Product.model";

export const products = async (
  _: any,
  { limit, sort, offset, filters }: QueryProductsArgs,
  __: any,
  info: any
) => {
  // const searchedCap = await capByCap(filters.cap);

  // const coordinates = searchedCap.location.coordinates;
  // const latitude = coordinates[0];
  // const longitude = coordinates[1];
  const gender = filters?.gender;
  const macroCategory = filters?.macroCategory;
  const microCategory = filters?.microCategory;
  const brand = filters?.brand;
  const sizes = filters?.sizes;
  const colors = filters?.colors;
  const daysPivot = 90;
  const datePivot = daysPivot * 24 * 60 * 60 * 1000;
  let checkSort: any = { score: -1 };
  if (sort != null) {
    switch (sort.for) {
      case "price":
        checkSort = { price: sort.ascending === true ? 1 : -1 };
        break;
      case "createdAt":
        checkSort = { createdAt: sort.ascending === true ? 1 : -1 };
        break;
      case "sale":
        checkSort = { sale: sort.ascending === true ? 1 : -1 };
        break;

      default:
        customError({
          code: "400",
          path: "sort",
          message: `you can't sort for ${sort.for}`,
        });
        break;
    }
  }
  const checkName = () => {
    if (filters?.name != null) {
      return {
        text: {
          query: filters?.name,
          path: "name",
          score: { boost: { value: 10 } },
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
        size: { $in: sizes },
      };
    } else {
      return {};
    }
  };
  const checkMacroCategory = () => {
    if (filters?.macroCategory != null && filters?.macroCategory != "") {
      return { "info.macroCategory": macroCategory };
    } else {
      return {};
    }
  };

  const checkMicroCategory = () => {
    if (filters?.microCategory != null && filters?.microCategory != "") {
      return { "info.microCategory": microCategory };
    } else {
      return {};
    }
  };

  const checkMaxPrice = () => {
    if (filters?.maxPrice != null) {
      return {
        $expr: {
          $lte: [
            {
              $ifNull: ["$price.v2", "$price.v1"],
            },
            filters.maxPrice,
          ],
        },
      };
    } else {
      return {};
    }
  };

  const checkMinPrice = () => {
    if (filters?.minPrice != null) {
      return {
        $expr: {
          $gte: [
            {
              $ifNull: ["$price.v2", "$price.v1"],
            },
            filters.minPrice,
          ],
        },
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

  const checkQuantity = () => {
    if (sizes !== null) {
      return { $or: [{ quantity: null }, { quantity: { $gt: 0 } }] };
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
              text: {
                path: "status",
                query: "active",
              },
            },
          ],

          should: [
            //get the best ranked name on the top of the list
            checkName(),
            //boost score based on how young the product is
            {
              near: {
                path: "updatedAt",
                origin: new Date(),
                pivot: datePivot * 24 * 60 * 60 * 1000, //the first number is the days
                score: {
                  boost: {
                    value: 3,
                  },
                },
              },
            },
            //boost products with higher discount percentage
            {
              near: {
                path: "price.discountPercentage",
                origin: 100,
                pivot: 1,
                score: {
                  boost: {
                    value: 5,
                  },
                },
              },
            },
            //boost products based on how many times it has been bought
            {
              near: {
                path: "orderCounter",
                origin: 100,
                pivot: 1,
                score: {
                  boost: {
                    value: 10,
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
        "shopInfo.status": "active",
      },
    },

    {
      $match: {
        $and: [
          {
            variations: {
              $elemMatch: {
                $and: [
                  checkColors(),
                  {
                    lots: {
                      $elemMatch: {
                        $and: [checkSizes(), checkQuantity()],
                      },
                    },
                  },
                ],
              },
            },
          },
          checkGender(),
          checkMacroCategory(),
          checkMicroCategory(),
          checkBrands(),
          checkMinPrice(),
          checkMaxPrice(),
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
    { $sort: checkSort },
  ])
    .skip(offset)
    .limit(limit);

  console.log("==================");
  console.log(products);
  console.log("==================");

  return products;
};
