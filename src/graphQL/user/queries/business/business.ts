import { QueryBusinessArgs } from "src/graphQL/types/types";
import businessById from "../../../../controllers/queries/businessById";

export const business = async (_: any, { id }: QueryBusinessArgs) => {
  const business = await businessById(id);
  return business;
};
