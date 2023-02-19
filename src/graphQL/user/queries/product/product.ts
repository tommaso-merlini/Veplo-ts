import productById from "../../../../controllers/queries/productById";

export const product = async (_, { id }, __, info) => {
  const product = await productById(id, info);

  return product;
};
