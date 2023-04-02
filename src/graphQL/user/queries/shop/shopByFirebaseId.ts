import { QueryShopByFirebaseIdArgs } from "src/graphQL/types/types";
import helperShopByFirebaseId from "../../../../controllers/queries/helperShopByFirebaseId";

export const shopByFirebaseId = async (
  _: any,
  { firebaseId }: QueryShopByFirebaseIdArgs,
  __: any,
  info: any
) => {
  const shop = await helperShopByFirebaseId(firebaseId, info);

  return shop;
};
