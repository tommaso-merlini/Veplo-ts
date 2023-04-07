import { generateCode } from "../../src/controllers/generateCode.js";
import {
  constants,
  shoes_sizes,
  clothes_sizes,
} from "../../constants/constants.js";
import Shop from "../../src/schemas/Shop.model.js";
import Product from "../../src/schemas/Product.model.js";

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

const HOW_MANY_PRODUCTS = 200;

export const generateProducts = async () => {
  const products = [];
  const macroCategories = constants.genders.uomo.abbigliamento;
  const shops = await Shop.find();
  const shoeSizes = shoes_sizes;
  const clothesSizes = clothes_sizes;

  try {
    for (let i = 0; i < HOW_MANY_PRODUCTS; i++) {
      var macroCategory =
        macroCategories[Math.floor(Math.random() * macroCategories.length)];
      let product: any = {};
      const createdAt = randomDate(new Date(2022, 0, 1), new Date());
      const priceV1 = Math.floor(Math.random() * 200) + 5;
      if (Math.random() < 0.5) {
        var priceV2: any = null;
        var discountPercentage: any = null;
      } else {
        var priceV2: any = Math.floor(Math.random() * (priceV1 - 1)) + 5;
        var discountPercentage: any = +(
          100 -
          (100 * priceV2) / priceV1
        ).toFixed(2);
      }
      const microCategory =
        macroCategory.types[
          Math.floor(Math.random() * macroCategory.types.length)
        ];
      const shop = shops[Math.floor(Math.random() * shops.length)];

      const variations = [];
      const numberOfVariations = Math.floor(Math.random() * 7) + 1;

      const colors = [...constants.colors];

      for (let k = 0; k < numberOfVariations; k++) {
        let variation: any = {};
        const indexColor = Math.floor(Math.random() * colors.length);
        variation.color = colors[indexColor];
        colors.splice(indexColor, 1);

        variation.status = "active";
        variation.photos = [
          "1899e85f-3bc8-47cd-ac44-86c27ec76688",
          "1cf1347a-4270-43e9-9fc7-a0951b1a5cb7",
          "27a47187-509e-411d-845b-8b36f0566548",
        ];

        const lots = [];
        const numberOfLots = Math.floor(Math.random() * 8) + 1;
        let sizes;
        if (macroCategory.name === "Scarpe") {
          sizes = [...shoeSizes];
        } else {
          sizes = [...clothesSizes];
        }

        for (let j = 0; j < numberOfLots; j++) {
          const lot: any = {};

          const indexSize = Math.floor(Math.random() * sizes.length);
          lot.size = sizes[indexSize];
          sizes.splice(indexSize, 1);

          lot.quantity = Math.floor(Math.random() * 20) + 1;

          lots.push(lot);
        }

        variation.lots = lots;
        variations.push(variation);
      }

      product.name = `${macroCategory.name} ${generateCode()}`;
      product.status = "active";
      product.canBuy = true;
      product.createdAt = createdAt;
      product.updatedAt = randomDate(createdAt, new Date());
      product.price = {
        v1: priceV1,
        v2: priceV2,
        discountPercentage: discountPercentage,
      };
      (product.info = {
        gender: "m",
        macroCategory: macroCategory.name,
        microCategory,
        fit: constants.fits[Math.floor(Math.random() * constants.fits.length)],
        brand:
          constants.brands[Math.floor(Math.random() * constants.brands.length)],
      }),
        (product.location = {
          type: "Point",
          coordinates: [12, 42],
        }),
        (product.shopInfo = {
          id: shop.id,
          businessId: shop.businessId,
          name: shop.name,
          city: shop.address.city,
          status: shop.status,
          businessStatus: shop.businessStatus || "active",
        });
      product.orderCounter = Math.floor(Math.random() * 300) + 1;
      product.variations = variations;
      products.push(product);
    }

    // console.dir(products, { depth: null });
    await Product.insertMany(products);
    console.log("OK!");
  } catch (e) {
    console.log("errore generateProducts");
    console.log(e);
  }
};
