import Variation from "../../schemas/Variation.model";

export const createVariations = async (product) => {
  let variations = [];
  product.variations.forEach((variation) => {
    variations.push({
      color: variation.color,
      uniqueId: variation.uniqueId,
      name: product.name,
      updatedAt: product.updatedAt,
      status: variation.status,
      price: variation.price,
      photos: variation.photos,
      lots: variation.lots,
      product: {
        id: product._id,
        status: product.status,
        canBuy: product.canBuy,
        info: product.info,
      },
      shopInfo: {
        id: product.shopInfo.id,
        name: product.shopInfo.name,
        status: product.shopInfo.status,
      },
      location: product.location,
    });
  });

  await Variation.insertMany(variations);
  return;
};
