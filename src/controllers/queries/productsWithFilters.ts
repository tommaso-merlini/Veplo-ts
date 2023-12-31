import { ObjectId } from "mongoose";
import { QueryProductsArgs } from "../../graphQL/types/types.js";
import Product from "../../schemas/Product.model.js";
import customError from "../errors/customError.js";
import getRequestedFields from "../getRequestedFields.js";
import graphqlFields from "graphql-fields";

interface Args extends QueryProductsArgs {
  info: any;
  shopId?: string | ObjectId;
  statuses?: string[];
  canSeeAllStatuses: Boolean;
}

export const productsWithFilters = async ({
  limit,
  sort,
  offset,
  filters,
  info,
  shopId,
  statuses,
  canSeeAllStatuses,
}: Args) => {
  const query = filters?.query;
  const gender = filters?.gender;
  const macroCategory = filters?.macroCategory;
  const microCategory = filters?.microCategory;
  const brand = filters?.brand;
  const sizes = filters?.sizes;
  const colors = filters?.colors;
  const fit = filters?.fit;
  const traits = filters?.traits;
  const daysPivot = 90;
  const datePivot = daysPivot * 24 * 60 * 60 * 1000;
  const datePivotMs = datePivot * 24 * 60 * 60 * 1000;
  const today = new Date();

  const filtersInfo: any[] = [];
  const filtersVariations: any[] = [];
  const filtersLots: any[] = [];

  const scoreParams = [
    //boost score based on how young the product is
    {
      near: {
        path: "updatedAt",
        origin: today,
        pivot: datePivotMs, //the first number is the days
        score: {
          boost: {
            value: 1,
          },
        },
      },
    },
    //boost products with higher discount percentage
    {
      range: {
        path: "price.discountPercentage",
        gte: 10,
        lt: 30,
        score: {
          boost: {
            value: 1,
          },
        },
      },
    },
    {
      range: {
        path: "price.discountPercentage",
        gte: 30,
        lt: 50,
        score: {
          boost: {
            value: 2,
          },
        },
      },
    },
    {
      range: {
        path: "price.discountPercentage",
        gte: 50,
        lte: 100,
        score: {
          boost: {
            value: 3,
          },
        },
      },
    },
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
  ];
  let checkSort: any = { score: -1 };

  if (canSeeAllStatuses) {
    checkSort = { updatedAt: -1 };
  }

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

  const checkScoreParams = () => {
    if (canSeeAllStatuses != null) {
      return [];
    } else {
      return scoreParams;
    }
  };

  const checkName = () => {
    if (query != null) {
      return {
        text: {
          query: query,
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

  const checkStatuses = () => {
    if (canSeeAllStatuses) {
      if (statuses != null) {
        filtersInfo.push({
          phrase: {
            query: statuses,
            path: "status",
            score: {
              constant: {
                value: 0,
              },
            },
          },
        });
      }
    } else {
      filtersInfo.push({
        text: {
          query: "active",
          path: "status",
          score: { constant: { value: 0 } },
        },
      });
    }
  };

  const checkShopId = () => {
    if (shopId != null) {
      filtersInfo.push({
        equals: {
          value: shopId,
          path: "shopInfo.id",
          score: { constant: { value: 0 } },
        },
      });
    }
  };

  const checkBusinessStatus = () => {
    if (shopId != null) {
      return {
        exists: {
          path: "shopInfo.businessStatus",
          score: { constant: { value: 0 } },
        },
      };
    } else {
      return {
        text: {
          query: "active",
          path: "shopInfo.businessStatus",
          score: { constant: { value: 0 } },
        },
      };
    }
  };

  const checkShopStatus = () => {
    if (shopId == null) {
      filtersInfo.push({
        text: {
          query: "active",
          path: "shopInfo.status",
          score: { constant: { value: 0 } },
        },
      });
    }
  };

  const checkGender = () => {
    if (gender != null) {
      filtersInfo.push({
        phrase: {
          query: gender,
          path: "info.gender",
          score: {
            constant: {
              value: 0,
            },
          },
        },
      });
    }
  };
  const checkBrands = () => {
    if (brand != null) {
      filtersInfo.push({
        phrase: {
          query: brand,
          path: "info.brand",
          score: {
            constant: {
              value: 0,
            },
          },
        },
      });
    }
  };
  const checkFit = () => {
    if (fit != null) {
      filtersInfo.push({
        phrase: {
          query: fit,
          path: "info.fit",
          score: {
            constant: {
              value: 0,
            },
          },
        },
      });
    }
  };

  const checkTraits = () => {
    //per fare una cosa in cui ogni trait ce debba essere si potrebbe usare "minimumShouldMatch"
    if (traits != null) {
      filtersInfo.push({
        phrase: {
          query: traits,
          path: "info.traits",
          score: {
            boost: {
              value: 2,
            },
          },
        },
      });
    }
  };
  const checkSizes = () => {
    if (sizes != null) {
      filtersLots.push({
        phrase: {
          query: sizes,
          path: "variations.lots.size",
          score: {
            constant: {
              value: 0,
            },
          },
        },
      });
    }
  };

  const checkQuantity = () => {
    if (sizes != null) {
      return {
        range: {
          path: "variations.lots.quantity",
          gt: 0,
          score: {
            constant: {
              value: 0,
            },
          },
        },
      };
    } else {
      return {
        exists: {
          path: "variations.lots.quantity",
          score: {
            constant: {
              value: 0,
            },
          },
        },
      };
    }
  };

  const checkMacroCategory = () => {
    if (filters?.macroCategory != null && filters?.macroCategory != "") {
      filtersInfo.push({
        phrase: {
          query: macroCategory,
          path: "info.macroCategory",
          score: {
            constant: {
              value: 0,
            },
          },
        },
      });
    }
  };

  const checkMicroCategory = () => {
    if (filters?.microCategory != null && filters?.microCategory != "") {
      filtersInfo.push({
        phrase: {
          query: microCategory,
          path: "info.microCategory",
          score: {
            constant: {
              value: 0,
            },
          },
        },
      });
    }
  };

  const checkMaxPrice = () => {
    if (filters?.maxPrice != null) {
      return {
        range: {
          path: {
            value: {
              $ifNull: ["$price.v2", "$price.v1"],
            },
          },
          lte: filters.maxPrice,
          score: {
            constant: {
              value: 0,
            },
          },
        },
      };
    } else {
      return {
        exists: {
          path: "price",
          score: {
            constant: {
              value: 0,
            },
          },
        },
      };
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
      return {
        exists: {
          path: "price",
          score: {
            constant: {
              value: 0,
            },
          },
        },
      };
    }
  };

  const checkColors = () => {
    if (colors != null) {
      filtersVariations.push({
        phrase: {
          query: colors,
          path: "variations.color",
          score: {
            constant: {
              value: 0,
            },
          },
        },
      });
    }
  };

  const checkAllFilters = () => {
    checkStatuses(),
      checkShopStatus(),
      checkShopId(),
      checkGender(),
      checkMacroCategory(),
      checkMicroCategory(),
      checkBrands(),
      checkFit(),
      checkTraits(),
      // checkMaxPrice(),
      // checkMinPrice(),
      checkColors(),
      checkSizes();
  };

  checkAllFilters();

  let products: any = await Product.aggregate([
    {
      $search: {
        index: "ProductSearchIndex",
        compound: {
          filter: [
            ...filtersInfo,
            {
              embeddedDocument: {
                path: "variations",
                operator: {
                  compound: {
                    filter: [
                      ...filtersVariations,
                      {
                        embeddedDocument: {
                          path: "variations.lots",
                          operator: {
                            compound: {
                              filter: [...filtersLots],
                              should: [
                                {
                                  range: {
                                    path: "variations.lots.quantity",
                                    gt: 0,
                                    score: {
                                      constant: {
                                        value: 0,
                                      },
                                    },
                                  },
                                },
                              ],
                              minimumShouldMatch: 1, //se cerchi un prodotto deve avere almeno un lotto con quantity > 0
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          ],
          should: [
            //get the best ranked name on the top of the list
            checkName(),

            //score params
            ...checkScoreParams(),
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

        ...getRequestedFields(info, "products"),
        _id: 0,
        id: "$_id",
      },
    },

    { $sort: checkSort },
  ]);

  return {
    products,
    filters: {
      ...filters,
      colors: [filters?.colors],
    },
  };
};
