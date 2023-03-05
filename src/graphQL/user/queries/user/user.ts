import userById from "../../../../controllers/queries/userById";

export const user = async (_, { id }, __, info) => {
  const user = await userById(id, info);

  return user;
};
