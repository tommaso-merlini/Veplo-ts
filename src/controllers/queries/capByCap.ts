import Cap from "../../schemas/Cap.model.js";
import customError from "../errors/customError.js";

const capByCap = async (cap: string) => {
  const searchedCap = await Cap.findOne({
    cap: cap,
  });

  if (!searchedCap) {
    customError({
      code: "404",
      path: "cap",
      message: "cap not found",
    });
  }

  return searchedCap;
};

export default capByCap;
