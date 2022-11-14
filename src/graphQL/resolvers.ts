// @ts-nocheck

import { Context } from "../../apollo/context";
import { GraphQLError, Token } from "graphql";
import checkConstants from "../controllers/checkConstants";
import authenticateToken from "../controllers/authenticateToken";
import lodash, { identity } from "lodash";
import { CountryCodeResolver } from "graphql-scalars";

const fixIdNaming = (products) => {
  for (let i = 0; i < products.length; i++) {
    //change _id to id
    products[i].id = products[i]["_id"]["$oid"];
    delete products[i]._id;

    //delete the $oid object
    products[i].shopId = products[i].shopId.$oid;
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
    products: async (_, { name, coordinates, range }, { prisma }: Context) => {
      try {
        let products: any = await prisma.product.aggregateRaw({
          pipeline: [
            {
              $search: {
                index: "search",
                compound: {
                  must: [
                    {
                      text: {
                        query: name,
                        path: "name",
                        fuzzy: {
                          maxEdits: 2,
                          prefixLength: 4,
                        },
                      },
                    },
                    {
                      geoWithin: {
                        path: "location",
                        circle: {
                          center: {
                            type: "Point",
                            coordinates: [coordinates[0], coordinates[1]],
                          },
                          radius: range,
                        },
                      },
                    },
                  ],
                },
              },
            },
            // {
            //   $match: { colors: ["colors Product2"] },
            // },
          ],
        });
        fixIdNaming(products);

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
      // const token = await admin
      //   .auth()
      //   .verifyIdToken(req.headers.authorization);
      // authenticateToken(token.uid, shop.firebaseId, token.isShop);

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
            city: "terni", //TODO get the city field
            name: shop.name,
          },
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

      return true;
    },

    deleteProduct: async (_, { id }, { prisma, admin, req }: Context) => {
      const product = await prisma.product.findFirst({
        where: {
          id,
        },
      });

      //token operations
      const token = await admin.auth().verifyIdToken(req.headers.authorization);
      authenticateToken(token.uid, product.firebaseShopId, token.isShop);

      await prisma.product.delete({
        where: {
          id,
        },
      });

      return true;
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

      const newShop = await prisma.shop.create({
        data: {
          ...options,
          firebaseId: "token.uiciaod",
          status: "inactive",
          createdAt: new Date(),
        },
      });

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
