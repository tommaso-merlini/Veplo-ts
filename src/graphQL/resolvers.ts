import { Context } from "../../apollo/context";

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
  },
};

export default resolvers;
