import { MutationDeleteCartArgs } from "src/graphQL/types/types.js";
import { Context } from "../../../../../apollo/context.js";
import checkFirebaseErrors from "../../../../controllers/checkFirebaseErrors.js";
import Cart from "../../../../schemas/Cart.model.js";

export const deleteCart = async (
  _: any,
  { shopId }: MutationDeleteCartArgs,
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
      mongoId: "6410ace3850a8aeb92bcbc9e",
    };
  }

  await Cart.findOneAndDelete({
    userId: token?.mongoId,
    "shopInfo.id": shopId,
  });

  return true;
};
