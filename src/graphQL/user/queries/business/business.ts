import { Context } from "../../../../../apollo/context";
import businessById from "../../../../controllers/queries/businessById";

export const business = async (_, { id }, { req, admin }: Context) => {
  const business = await businessById(id);
  return business;
};
