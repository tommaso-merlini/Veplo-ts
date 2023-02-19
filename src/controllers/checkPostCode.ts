import Cap from "../schemas/Cap.model";

export const checkPostCode = async (postCode) => {
  const searchedCap = await Cap.findOne({
    cap: postCode,
  });
  if (searchedCap) {
    return true;
  } else {
    return false;
  }
};
