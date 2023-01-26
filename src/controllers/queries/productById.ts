import getRequestedFields from "../getRequestedFields";
import checkObjectID from "../checkObjectID";
import Product from "../../schemas/Product.model";
import customError from "../errors/customError";

const productById = async (id, info?) => {
  let requestedFields = {};
  checkObjectID(id);

  if (info) {
    requestedFields = getRequestedFields(info);
  }

  const product = await Product.findById(id, requestedFields);

  if (!product) {
    customError({
      code: "404",
      path: "id",
      message: "product not found",
    });
  }

  return product;
};

export default productById;
