import getRequestedFields from "../getRequestedFields";
import checkObjectID from "../checkObjectID";
import Product from "../../schemas/Product.model";
import customError from "../errors/customError";

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
