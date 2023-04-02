import { MutationCreateInformationArgs } from "src/graphQL/types/types";
import Information from "../../../../schemas/Information.model";

export const createInformation = async (
  _: any,
  { options }: MutationCreateInformationArgs
) => {
  await Information.create({ ...options, status: "pending" });
  return true;
};
