import Product from "../src/schemas/Product.model";

//MIGRATION 1 | 29/01/2022
//CHANGES
//  1) PRICE -> PRICE: {V1}

//INTRODUCES
//  1) STATUS (FOR EVERYONE WILL BE "ACTIVE")
//  2) SHOPOPTIONS.STATUS (FOR EVERYONE WILL BE "NOT_ACTIVE")

const migration1 = async () => {
  await Product.updateMany(
    {},
    [
      {
        $set: {
          price: {
            v1: "$price",
          },
          status: "active",
          "shopOptions.status": "not_active",
        },
      },
    ],
    {
      multi: true,
    }
  );
};

export default migration1;
