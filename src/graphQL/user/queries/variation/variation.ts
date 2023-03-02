import variationById from "../../../../controllers/queries/variationById";

export const variation = async (_, { id }, __, info) => {
  const searchedVariation = await variationById(id, info);
  return searchedVariation;
};
