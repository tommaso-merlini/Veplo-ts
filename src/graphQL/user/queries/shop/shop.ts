import shopById from "../../../../controllers/queries/shopById";

export const shop = async (_, { id }, __, info) => {
  const shop = await shopById(id, info);

  return shop;
};
