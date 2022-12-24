import { Context } from "../../apollo/context";
import { GraphQLError, Token } from "graphql";
import checkConstants from "../controllers/checkConstants";
import authenticateToken from "../controllers/authenticateToken";
import lodash, { identity } from "lodash";
import { CountryCodeResolver } from "graphql-scalars";
import { prisma } from "@prisma/client";
import { reverseGeocoding } from "../controllers/reverseGeocoding";
import { checkPostCode } from "../controllers/checkPostCode";
import { createPostCode } from "../controllers/createPostCode";

const fixProductsIdNaming = (products) => {
  for (let i = 0; i < products.length; i++) {
    //change _id to id
    products[i].id = products[i]["_id"]["$oid"];
    delete products[i]._id;

    //delete the $oid object
    products[i].shopId = products[i].shopId.$oid;
  }
};

const fixShopsIdNaming = (shops) => {
  for (let i = 0; i < shops.length; i++) {
    //change _id to id
    shops[i].id = shops[i]["_id"]["$oid"];

    shops[i].id = shops[i]._id.$oid;

    //delete the $oid object
    delete shops[i]._id;
  }
};

const resolvers = {
  Query: {
    prova: () => {
      return "ciao";
    },
    product: async (_, { id }, { prisma }: Context) => {
      const product = await prisma.product.findFirst({
        where: {
          id,
        },
      });
      return product;
    },
    products: async (
      _,
      { range, limit, offset, filters },
      { prisma }: Context
    ) => {
      try {
        const searchedCap = await prisma.cap.findFirst({
          where: {
            cap: filters.cap,
          },
        });
        if (!searchedCap) {
          throw new Error(`cap ${filters.cap} does not exists`);
        }
        const coordinates = searchedCap.location.coordinates;
        const latitude = coordinates[0];
        const longitude = coordinates[1];
        const gender = filters.gender;
        const macroCategory = filters.macroCategory;
        const brands = filters.brands;
        const sizes = filters.sizes;
        const checkName = () => {
          if (filters.name != null) {
            return {
              text: {
                query: filters.name,
                path: "name",
                fuzzy: {
                  maxEdits: 2,
                  prefixLength: 4,
                },
              },
            };
          } else {
            return {
              exists: {
                path: "search",
              },
            };
          }
        };
        const checkGender = () => {
          if (filters.gender != null) {
            return { gender };
          } else {
            return {};
          }
        };
        const checkBrands = () => {
          if (filters.brands != null) {
            return {
              brand: { $in: brands },
            };
          } else {
            return {};
          }
        };
        const checkSizes = () => {
          if (filters.sizes != null) {
            return {
              sizes: { $in: sizes },
            };
          } else {
            return {};
          }
        };
        const checkMacroCategory = () => {
          if (filters.macroCategory != null && filters.macroCategory != "") {
            return { macroCategory };
          } else {
            return {};
          }
        };

        const checkMaxPrice = () => {
          if (filters.maxPrice != null) {
            return { price: { $lte: filters.maxPrice } };
          } else {
            return {};
          }
        };

        const checkMinPrice = () => {
          if (filters.minPrice != null) {
            return { price: { $gte: filters.minPrice } };
          } else {
            return {};
          }
        };

        const checkColors = () => {
          if (filters.colors != null) {
            return { colors: { $in: filters.colors } };
          } else {
            return {};
          }
        };

        let products: any = await prisma.product.aggregateRaw({
          pipeline: [
            // {
            //   $search: {
            //     index: "search",
            //     compound: {
            //       must: [
            //         // {
            //         //   text: {
            //         //     query: filters.name,
            //         //     path: "name",
            //         //     fuzzy: {
            //         //       maxEdits: 2,
            //         //       prefixLength: 4,
            //         //     },
            //         //   },
            //         // },
            //         {
            //           geoWithin: {
            //             path: "location",
            //             circle: {
            //               center: {
            //                 type: "Point",
            //                 coordinates: [latitude, longitude],
            //               },
            //               radius: range,
            //             },
            //           },
            //         },
            //       ],
            //     },
            //   },
            // },
            {
              $search: {
                index: "search",
                compound: {
                  should: [
                    //!get the best ranked name on the top of the list
                    checkName(),
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
                },
              },
            },
            { $match: checkGender() },
            { $match: checkMacroCategory() },
            { $match: checkBrands() },
            { $match: checkSizes() },
            { $match: checkMinPrice() },
            { $match: checkMaxPrice() },
            { $match: checkColors() },
            { $limit: limit },
            { $skip: offset },
            // {
            //   $project: {
            //     document: ""
            //     score: { $meta: "searchScore" }
            //   }
            // }
          ],
        });

        console.log(products);
        fixProductsIdNaming(products);

        return products;
      } catch (e: any) {
        console.log(e.message);
        throw new GraphQLError(e.message);
      }
    },
    shop: async (_, { id }, { prisma }: Context) => {
      const shop = await prisma.shop.findFirst({
        where: {
          id,
        },
      });

      return shop;
    },
    shopByFirebaseId: async (_, { firebaseId }, { prisma }: Context) => {
      const shop = await prisma.shop.findFirst({
        where: {
          firebaseId,
        },
      });

      return shop;
    },
    isShop: async (_, __, { req, admin }: Context) => {
      //token operations
      const token = await admin.auth().verifyIdToken(req.headers.authorization);
      if (!token.isShop) {
        return false;
      } else {
        return true;
      }
    },
    shops: async (_, { cap, range, limit, offset }, { prisma }: Context) => {
      const searchedCap = await prisma.cap.findFirst({
        where: {
          cap,
        },
      });

      if (!searchedCap) {
        throw new Error(`${cap} non registrato`);
      }

      const coordinates = searchedCap.location.coordinates;

      // const shops = await prisma.shop.findRaw({
      //   options: {
      //     address: {
      //       location: {
      //        $near: {
      //           $geometry: { type: "Point",  coordinates: coordinates },
      //           $maxDistance: range
      //         }
      //       }
      //     }
      //   }
      // });

      const shops = await prisma.shop.aggregateRaw({
        pipeline: [
          {
            $geoNear: {
               near: { type: "Point", coordinates: coordinates },
               spherical: true,
               maxDistance: range,
               distanceField: "distance"
            }
         },
         {$limit: limit},
         {$skip: offset}
        ]
      })

      fixShopsIdNaming(shops);

      return shops;
    },
  },

  Mutation: {
    createProduct: async (
      _,
      { shopId, options },
      { prisma, admin, req }: Context
    ) => {
      checkConstants(options, "product");

      const shop = await prisma.shop.findFirst({
        where: {
          id: shopId,
        },
      });

      if (shop === null || shop === undefined) {
        throw new Error(`can't find a shop with id ${shopId}`);
      }

      //token operations
      const token = await admin.auth().verifyIdToken(req.headers.authorization);
      authenticateToken(token.uid, shop.firebaseId, token.isShop);

      //TODO handling the macroCategories => insert macroCategory into shop

      const newProduct = await prisma.product.create({
        data: {
          ...options,
          location: {
            type: "Point",
            coordinates: shop.address.location.coordinates,
          },
          shopId: shopId,
          firebaseShopId: shop.firebaseId,
          shop: {
            city: shop.address.city,
            name: shop.name,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return newProduct.id;
    },
    editProduct: async (
      _,
      { id, options },
      { prisma, admin, req }: Context
    ) => {
      const product = await prisma.product.findFirst({
        where: {
          id,
        },
      });

      if (product === null || product === undefined) {
        throw new Error(`can't find a product with id ${id}`);
      }

      //token operations
      const token = await admin.auth().verifyIdToken(req.headers.authorization);
      authenticateToken(token.uid, product.firebaseShopId, token.isShop);

      //merging product with options (overwrite equal values)
      const editedProduct = Object.assign({}, product, options);

      //check if the editedProduct = product
      if (lodash.isEqual(product, editedProduct)) {
        throw new Error("you didn't edit any fields");
      }

      //check the fields with the constants
      checkConstants(editedProduct, "product");

      await prisma.product.update({
        where: {
          id,
        },
        data: { ...options, updatedAt: new Date() },
      });

      return product.id;
    },

    deleteProduct: async (_, { id }, { prisma, admin, req }: Context) => {
      const product = await prisma.product.findFirst({
        where: {
          id,
        },
      });

      //TODO check dei gender dei prodotti prodotti => se non ci sono piu' prodotti con quel gender eliminare il gender

      //token operations
      const token = await admin.auth().verifyIdToken(req.headers.authorization);
      authenticateToken(token.uid, product.firebaseShopId, token.isShop);

      await prisma.product.delete({
        where: {
          id,
        },
      });

      return product.id;
    },
    createShop: async (_, { options }, { prisma, req, admin }: Context) => {
      //token operations
      const token = await admin.auth().verifyIdToken(req.headers.authorization);
      if (!token.isShop) {
        throw new Error("you are not logged in as a shop");
      }

      const alreadyExists = await prisma.shop.findFirst({
        where: {
          firebaseId: token.uid,
        },
      });

      if (alreadyExists) {
        throw new Error(`an user with firebaseId ${token.uid} already exists`);
      }

      checkConstants(options, "shop");

      let { center, city, postCode }: any = await reverseGeocoding(
        options.address.location.coordinates[0],
        options.address.location.coordinates[1]
      );

      const postCodeExists = await checkPostCode(prisma, postCode);
      if (!postCodeExists) {
        createPostCode(prisma, postCode, city, center);
      }

      options.address.postcode = postCode;
      const newShop = await prisma.shop.create({
        data: {
          ...options,
          firebaseId: token.uid,
          status: "inactive",
          createdAt: new Date(),
        },
      });

      return newShop.id;
    },
    setIsShop: async (_, { isShop }, { req, admin }: Context) => {
      const token = await admin.auth().verifyIdToken(req.headers.authorization);
      if (isShop === token.isShop) {
        if (isShop === false) {
          console.log("l'utente gia' non e' uno shop");
        } else {
          console.log("l'utente gia' e' uno shop");
        }
      }
      await admin.auth().setCustomUserClaims(token.uid, { isShop });

      return true;
    },
  },

  Shop: {
    products: async (shop, _, { prisma }: Context) => {
      const products = await prisma.product.findMany({
        where: {
          shopId: shop.id,
        },
      });

      return products;
    },
  },
};

export default resolvers;
