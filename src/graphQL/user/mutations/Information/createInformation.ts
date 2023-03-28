import Information from "../../../../schemas/Information.model";

export const createInformation = async (_, { options }) => {
  await Information.create({ ...options, status: "pending" });
  return true;
};
