export const checkPostCode = async (Cap, postCode) => {
  const searchedCap = await Cap.findOne({
    cap: postCode,
  });
  if (searchedCap) {
    return true;
  } else {
    return false;
  }
};
