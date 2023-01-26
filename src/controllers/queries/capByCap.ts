import getRequestedFields from "../getRequestedFields";
import checkObjectID from "../checkObjectID";
import Product from "../../schemas/Product.model";
import Cap from "../../schemas/Cap.model";

const capByCap = async (cap) => {
  const searchedCap = await Cap.findOne({
    cap: cap,
  });

  if (!searchedCap) {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "404",
        customPath: "cap",
        customMessage: "cap not found",
      },
    });
  }

  return searchedCap;
};

export default capByCap;
