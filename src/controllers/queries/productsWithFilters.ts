import { ObjectId } from "mongoose";
import { QueryProductsArgs } from "../../graphQL/types/types.js";
import Product from "../../schemas/Product.model.js";
import customError from "../errors/customError.js";
import getRequestedFields from "../getRequestedFields.js";

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

  const fullTextSearchParams = [
    "info.fit",
    "info.macroCategory",
    "info.microCategory",
    "info.brand",
    "info.traits",
  ];

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
    if (shopId != null) {
      return [
        //boost score based on how young the product is
        {
          near: {
            path: "updatedAt",
            origin: today,
            pivot: datePivotMs, //the first number is the days
            score: {
              boost: {
                value: 3,
              },
            },
          },
        },
      ];
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
          score: { boost: { value: 30 } },
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
        return {
          phrase: {
            query: statuses,
            path: "status",
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
            path: "status",
            score: { constant: { value: 0 } },
          },
        };
      }
    } else {
      return {
        text: {
          query: "active",
          path: "status",
          score: { constant: { value: 0 } },
        },
      };
    }
  };

  const checkShopId = () => {
    if (shopId != null) {
      return {
        equals: {
          value: shopId,
          path: "shopInfo.id",
          score: { constant: { value: 0 } },
        },
      };
    } else {
      return {
        exists: {
          path: "shopInfo.id",
          score: { constant: { value: 0 } },
        },
      };
    }
  };

  const checkShopStatus = () => {
    if (shopId != null) {
      return {
        exists: {
          path: "shopInfo.status",
          score: { constant: { value: 0 } },
        },
      };
    } else {
      return {
        text: {
          query: "active",
          path: "shopInfo.status",
          score: { constant: { value: 0 } },
        },
      };
    }
  };

  const checkGender = () => {
    if (gender != null) {
      return {
        text: {
          query: gender,
          path: "info.gender",
          // score: {
          //   constant: {
          //     value: 0,
          //   },
          // },
        },
      };
    } else {
      return {
        exists: {
          path: "info.gender",
          score: {
            constant: {
              value: 0,
            },
          },
        },
      };
    }
  };
  const checkBrands = () => {
    if (brand != null) {
      return {
        text: {
          query: brand,
          path: "info.brand",
          // score: {
          //   constant: {
          //     value: 0,
          //   },
          // },
        },
      };
    } else {
      return {
        exists: {
          path: "info.brand",
          score: {
            constant: {
              value: 0,
            },
          },
        },
      };
    }
  };
  const checkFit = () => {
    if (fit != null) {
      return {
        text: {
          query: fit,
          path: "info.fit",
          // score: {
          //   constant: {
          //     value: 0,
          //   },
          // },
        },
      };
    } else {
      return {
        exists: {
          path: "info.fit",
          score: {
            constant: {
              value: 0,
            },
          },
        },
      };
    }
  };

  const checkTraits = () => {
    //per fare una cosa in cui ogni trait ce debba essere si potrebbe usare "minimumShouldMatch"
    if (traits != null) {
      return {
        phrase: {
          query: traits,
          path: "info.traits",
          score: {
            boost: {
              value: 2,
            },
          },
        },
      };
    } else {
      return {
        exists: {
          path: "info.traits",
          score: {
            constant: {
              value: 0,
            },
          },
        },
      };
    }
  };
  const checkSizes = () => {
    if (sizes != null) {
      return {
        text: {
          query: sizes,
          path: "variations.lots.size",
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
          path: "variations.lots.size",
          score: {
            constant: {
              value: 0,
            },
          },
        },
      };
    }
  };

  const checkQuantity = () => {
    if (sizes != null) {
      return {
        range: {
          path: "variations.lots.quantity",
          gt: 0,
          // score: {
          //   constant: {
          //     value: 0,
          //   },
          // },
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
      return {
        text: {
          query: macroCategory,
          path: "info.macroCategory",
          // score: {
          //   constant: {
          //     value: 0,
          //   },
          // },
        },
      };
    } else {
      return {
        exists: {
          path: "info.macroCategory",
          score: {
            constant: {
              value: 0,
            },
          },
        },
      };
    }
  };

  const checkMicroCategory = () => {
    if (filters?.microCategory != null && filters?.microCategory != "") {
      return {
        text: {
          query: microCategory,
          path: "info.microCategory",
          // score: {
          //   constant: {
          //     value: 0,
          //   },
          // },
        },
      };
    } else {
      return {
        exists: {
          path: "info.microCategory",
          score: {
            constant: {
              value: 0,
            },
          },
        },
      };
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
      return {
        text: {
          query: colors,
          path: "variations.color",
          // score: {
          //   constant: {
          //     value: 0,
          //   },
          // },
        },
      };
    } else {
      return {
        exists: {
          path: "variations.color",
          score: {
            constant: {
              value: 0,
            },
          },
        },
      };
    }
  };

  let products: any = await Product.aggregate([
    {
      $search: {
        index: "ProductSearchIndex",
        compound: {
          filter: [
            checkStatuses(),
            checkShopStatus(),
            checkShopId(),
            checkGender(),
          ],
          should: [
            checkMacroCategory(),
            checkMicroCategory(),
            checkBrands(),
            checkFit(),
            checkTraits(),
            checkMaxPrice(),
            checkMinPrice(),
            //get the best ranked name on the top of the list
            checkName(),

            //score params
            ...checkScoreParams(),
            {
              embeddedDocument: {
                path: "variations",
                operator: {
                  compound: {
                    should: [
                      checkColors(),
                      {
                        embeddedDocument: {
                          path: "variations.lots",
                          operator: {
                            compound: {
                              filter: [checkSizes(), checkQuantity()],
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

        ...getRequestedFields(info),
        _id: 0,
        id: "$_id",
      },
    },

    { $sort: checkSort },
  ]);
  return products;
};
