import Cap from "../schemas/Cap.model.js";

export const checkPostCode = async (postCode: string) => {
  const searchedCap = await Cap.findOne({
    cap: postCode,
  });
  if (searchedCap) {
    return true;
  } else {
    return false;
  }
};
