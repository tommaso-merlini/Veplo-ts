import { Context } from "../../apollo/context";
import { GraphQLError } from "graphql";
import checkConstants from "../controllers/checkConstants";
import authenticateToken from "../controllers/authenticateToken";
import { reverseGeocoding } from "../controllers/reverseGeocoding";
import { checkPostCode } from "../controllers/checkPostCode";
import { createPostCode } from "../controllers/createPostCode";
import Product from "../schemas/Product.model";
import Cap from "../schemas/Cap.model";
import getRequestedFields from "../controllers/getRequestedFields";
import Shop from "../schemas/Shop.model";
import getDiffs from "../controllers/getDiffs";

const resolvers = {
  Query: {
    prova: () => {
      return "ciao";
    },
    product: async (_, { id }) => {
      const product = await Product.findById(id);
      return product;
    },
    products: async (_, { range, limit, offset, filters }, __, info) => {
      try {
        const searchedCap = await Cap.findOne({
          cap: filters.cap,
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
                //TODO decomment when implementing the score
                //score: { boost: { value: 1 } },
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

        let products: any = await Product.aggregate([
          {
            $search: {
              index: "ProductSearchIndex",
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
          //! NOT WORKING
          // {
          //   $match: {
          //     updatedAt: {
          //       $lte: new Date().toDateString(),
          //     },
          //     score: { boost: { value: 1 } },
          //   },
          // },

          { $match: checkGender() },
          { $match: checkMacroCategory() },
          { $match: checkBrands() },
          { $match: checkSizes() },
          { $match: checkMinPrice() },
          { $match: checkMaxPrice() },
          { $match: checkColors() },

          // { $limit: limit },
          // { $skip: offset },
          { $sort: { updatedAt: -1 } },

          //     //TODO decomment when creating the score system
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

        // console.log("=====================================");
        // console.log(products);
        // console.log("=====================================");

        return products;
      } catch (e: any) {
        console.log(e.message);
        throw new GraphQLError(e.message);
      }
    },
    shop: async (_, { id }) => {
      const shop = await Shop.findById(id);

      return shop;
    },
    shopByFirebaseId: async (_, { firebaseId }) => {
      const shop = await Shop.findOne({ firebaseId });

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
    shops: async (_, { cap, range, limit, offset }, __, info) => {
      const searchedCap = await Cap.findOne({ cap });

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

      const shops = await Shop.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: coordinates },
            spherical: true,
            maxDistance: range,
            distanceField: "distance",
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
    },
  },

  Mutation: {
    createProduct: async (_, { shopId, options }, { admin, req }: Context) => {
      checkConstants(options, "product");

      const shop = await Shop.findById(shopId);

      if (shop === null || shop === undefined) {
        throw new Error(`can't find a shop with id ${shopId}`);
      }

      //token operations
      const token = await admin.auth().verifyIdToken(req.headers.authorization);
      authenticateToken(token.uid, shop.firebaseId, token.isShop);

      //TODO handling the macroCategories => insert macroCategory into shop

      const newProduct = await Product.create({
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
      });
      return newProduct.id;
    },
    editProduct: async (_, { id, options }, { admin, req }: Context) => {
      const product = await Product.findById(id);

      if (product === null || product === undefined) {
        throw new Error(`can't find a product with id ${id}`);
      }

      //token operations
      const token = await admin.auth().verifyIdToken(req.headers.authorization);
      authenticateToken(token.uid, product.firebaseShopId, token.isShop);

      //merging product with options (overwrite equal values)
      const { merge, diffs, isDifferent } = getDiffs(product, options);

      //check if the editedProduct = product
      if (!isDifferent) {
        throw new Error("you didn't edit any fields");
      }

      //check the fields with the constants
      checkConstants(merge, "product");

      await Product.updateOne({ _id: id }, diffs);

      return product.id;
    },

    deleteProduct: async (_, { id }, { admin, req }: Context) => {
      const product = await Product.findById(id);

      //TODO check dei gender dei prodotti prodotti => se non ci sono piu' prodotti con quel gender eliminare il gender

      //token operations
      const token = await admin.auth().verifyIdToken(req.headers.authorization);
      authenticateToken(token.uid, product.firebaseShopId, token.isShop);

      await Product.findByIdAndRemove(id);

      return product.id;
    },
    createShop: async (_, { options }, { req, admin }: Context) => {
      //token operations
      const token = await admin.auth().verifyIdToken(req.headers.authorization);
      if (!token.isShop) {
        throw new Error("you are not logged in as a shop");
      }

      const alreadyExists = await Shop.findOne({
        firebaseId: token.uid,
      });

      if (alreadyExists) {
        throw new Error(`an user with firebaseId ${token.uid} already exists`);
      }

      checkConstants(options, "shop");

      let { center, city, postCode }: any = await reverseGeocoding(
        options.address.location.coordinates[0],
        options.address.location.coordinates[1]
      );

      const postCodeExists = await checkPostCode(Cap, postCode);
      if (!postCodeExists) {
        createPostCode(Cap, postCode, city, center);
      }

      options.address.postcode = postCode;
      const newShop = await Shop.create({
        ...options,
        firebaseId: "token.uid",
        status: "inactive",
        createdAt: new Date(),
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
    products: async (shop) => {
      const products = await Product.find({
        shopId: shop.id,
      });

      return products;
    },
  },
  // ISODate: DateResolver,
};

export default resolvers;
