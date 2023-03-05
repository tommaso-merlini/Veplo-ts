import cartById from "../../../../controllers/queries/cartById";

export const cart = async (_, { id }, __, info) => {
  const cart = await cartById(id, info);

  return cart;
};
