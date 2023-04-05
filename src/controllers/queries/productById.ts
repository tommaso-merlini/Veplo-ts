import getRequestedFields from "../getRequestedFields.js";
import checkObjectID from "../checkObjectID.js";
import Product from "../../schemas/Product.model.js";
import customError from "../errors/customError.js";

const productById = async (id: string, info?: any) => {
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
      message: `product not found (id: ${id})`,
    });
  }

  return product;
};

export default productById;
