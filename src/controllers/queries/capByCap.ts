import Cap from "../../schemas/Cap.model";
import customError from "../errors/customError";

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
