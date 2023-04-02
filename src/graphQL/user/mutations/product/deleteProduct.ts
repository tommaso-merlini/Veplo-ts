import { MutationDeleteProductArgs } from "src/graphQL/types/types";
import { Context } from "../../../../../apollo/context";
import authenticateToken from "../../../../controllers/authenticateToken";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import productById from "../../../../controllers/queries/productById";
import Product from "../../../../schemas/Product.model";

export const deleteProduct = async (
  _: any,
  { id }: MutationDeleteProductArgs,
  { admin, req }: Context
) => {
  let token;
  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  } else {
    token = {
      mongoId: "6410a4d66c8721c863f3d1c8",
      isBusiness: true,
    };
  }

  const product = await productById(id);

  //TODO check dei gender dei prodotti prodotti => se non ci sono piu' prodotti con quel gender eliminare il gender

  // if (process.env.NODE_ENV !== "development")
  //token operations
  authenticateToken(
    token?.mongoId,
    product.shopInfo.businessId,
    token?.isBusiness
  );

  await Product.findByIdAndRemove(id);

  return product.id;
};
