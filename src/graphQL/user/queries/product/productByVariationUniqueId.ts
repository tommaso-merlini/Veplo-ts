import getRequestedFields from "../../../../controllers/getRequestedFields";
import Product from "../../../../schemas/Product.model";
import customError from "../../../../controllers/errors/customError";

const productByVariationUniqueId = async (_, { uniqueId }, __, info) => {
  let requestedFields = {};

  if (info) {
    requestedFields = getRequestedFields(info);
  }

  const product = await Product.findOne({
    "variations.uniqueId": uniqueId,
  });

  if (!product) {
    customError({
      code: "404",
      path: "id",
      message: `product not found (id: ${uniqueId})`,
    });
  }

  console.log(product);

  return product;
};

export default productByVariationUniqueId;
