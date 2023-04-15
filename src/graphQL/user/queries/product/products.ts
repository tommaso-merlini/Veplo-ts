import { QueryProductsArgs } from "src/graphQL/types/types.js";
import customError from "../../../../controllers/errors/customError.js";
import getRequestedFields from "../../../../controllers/getRequestedFields.js";
// import capByCap from "../../../../controllers/queries/capByCap";
import Product from "../../../../schemas/Product.model.js";

export const products = async (
  _: any,
  { limit, sort, offset, filters }: QueryProductsArgs,
  __: any,
  info: any
) => {
  const gender = filters?.gender;
  const macroCategory = filters?.macroCategory;
  const microCategory = filters?.microCategory;
  const brand = filters?.brand;
  const sizes = filters?.sizes;
  const colors = filters?.colors;
  const daysPivot = 90;
  const datePivot = daysPivot * 24 * 60 * 60 * 1000;
  const datePivotMs = datePivot * 24 * 60 * 60 * 1000;
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
      return {
        text: {
          query: gender,
          path: "info.gender",
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
          query: microCategory,
          path: "info.microCategory",
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
  const checkMacroCategory = () => {
    if (filters?.macroCategory != null && filters?.macroCategory != "") {
      return {
        text: {
          query: macroCategory,
          path: "info.macroCategory",
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

  const checkQuantity = () => {
    if (sizes !== null) {
      return { $or: [{ quantity: null }, { quantity: { $gt: 0 } }] };
    } else {
      return {};
    }
  };

  const today = new Date();
  let products: any = await Product.aggregate([
    {
      $search: {
        index: "ProductSearchIndex",
        compound: {
          must: [
            checkMacroCategory(),
            checkMicroCategory(),
            checkBrands(),
            // checkMaxPrice(),
            // checkMinPrice(),
            {
              embeddedDocument: {
                path: "variations",
                operator: {
                  compound: {
                    must: [
                      checkColors(),
                      {
                        embeddedDocument: {
                          path: "variations.lots",
                          operator: {
                            compound: {
                              must: [checkSizes()],
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
          ],
        },
      },
    },
    //!!
    // {
    //   $match: {
    //     "shopInfo.status": "active",
    //   },
    // },

    // {
    //   $match: {
    //     $and: [
    //       checkMinPrice(),
    //       checkMaxPrice(),
    //       {
    //         variations: {
    //           $elemMatch: {
    //             $and: [
    //               checkColors(),
    //               {
    //                 lots: {
    //                   $elemMatch: {
    //                     $and: [checkSizes(), checkQuantity()],
    //                   },
    //                 },
    //               },
    //             ],
    //           },
    //         },
    //       },
    //     ],
    //   },
    // },
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

  // console.log("==================");
  // console.log(products);
  // console.log("==================");

  return products;
};
