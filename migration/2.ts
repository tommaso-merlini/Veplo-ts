//MIGRATION 2 | 17/04/2023

import { constants } from "../constants/constants.js";
import Product from "../src/schemas/Product.model.js";

//INTRODUCES
//  1) INFO.TRAITS (inserire come trait "vegan")

export const migration2 = async () => {
  const traits = constants.traits;
  await Product.updateMany(
    {},
    {
      $set: {
        "info.traits": [traits[Math.floor(Math.random() * traits.length)]],
      },
    }
  );
  console.log("OK!");
};
