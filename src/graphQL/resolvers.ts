import { Context } from "../../apollo/context";
import { GraphQLError } from "graphql";
import { ProvidedRequiredArgumentsOnDirectivesRule } from "graphql/validation/rules/ProvidedRequiredArgumentsRule";

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
      console.log(id);
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
