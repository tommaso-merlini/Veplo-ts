import { QueryBusinessArgs } from "src/graphQL/types/types.js";
import businessById from "../../../../controllers/queries/businessById.js";

export const business = async (_: any, { id }: QueryBusinessArgs) => {
  const business = await businessById(id);
  return business;
};
