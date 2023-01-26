import getRequestedFields from "../getRequestedFields";
import checkObjectID from "../checkObjectID";
import Product from "../../schemas/Product.model";
import Cap from "../../schemas/Cap.model";
import customError from "../errors/customError";

const capByCap = async (cap) => {
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
