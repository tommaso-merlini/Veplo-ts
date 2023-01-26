import getRequestedFields from "../getRequestedFields";
import checkObjectID from "../checkObjectID";
import Product from "../../schemas/Product.model";

const productById = async (id, info?) => {
  let requestedFields = {};
  checkObjectID(id);

  if (info) {
    requestedFields = getRequestedFields(info);
  }

  const product = await Product.findById(id, requestedFields);

  if (!product) {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "404",
        customPath: "id",
        customMessage: "product not found",
      },
    });
  }

  return product;
};

export default productById;
