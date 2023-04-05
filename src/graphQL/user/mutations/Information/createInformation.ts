import { MutationCreateInformationArgs } from "src/graphQL/types/types.js";
import Information from "../../../../schemas/Information.model.js";

export const createInformation = async (
  _: any,
  { options }: MutationCreateInformationArgs
) => {
  await Information.create({ ...options, status: "pending" });
  return true;
};
