import helperShopByFirebaseId from "../../../../controllers/queries/helperShopByFirebaseId";

export const shopByFirebaseId = async (_, { firebaseId }, __, info) => {
  const shop = await helperShopByFirebaseId(firebaseId, info);

  return shop;
};
