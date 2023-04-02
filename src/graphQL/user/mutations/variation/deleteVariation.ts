import { MutationDeleteVariationArgs } from "src/graphQL/types/types";
import { Context } from "../../../../../apollo/context";
import authenticateToken from "../../../../controllers/authenticateToken";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors";
import customError from "../../../../controllers/errors/customError";
import Product from "../../../../schemas/Product.model";

export const deleteVariation = async (
  _: any,
  { id }: MutationDeleteVariationArgs,
  { admin, req }: Context
) => {
  let token;
  if (process.env.NODE_ENV !== "development") {
    try {
      token = await admin.auth().verifyIdToken(req.headers.authorization);
    } catch (e) {
      checkFirebaseErrors(e);
    }
  }

  const product = await Product.findOne({
    "variations._id": id,
  });

  if (!product) {
    customError({
      code: "404",
      path: "variation and product",
      message: "there is no product with this variation",
    });
  }

  if (product.variations.length === 1) {
    customError({
      code: "400",
      path: "variation",
      message:
        "you are trying to remove the only variation that this product has",
    });
  }

  //TODO check dei gender dei prodotti prodotti => se non ci sono piu' prodotti con quel gender eliminare il gender

  if (process.env.NODE_ENV !== "development")
    //token operations
    authenticateToken(
      token?.mongoId,
      product.shopInfo.businessId,
      token?.isBusiness
    );

  await Product.updateOne(
    { "variations._id": id },
    { $pull: { variations: { _id: id } } }
  );

  return true;
};
