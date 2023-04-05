import Cart from "../../schemas/Cart.model.js";

export const deleteCartById = async (id: string) => {
  await Cart.findByIdAndRemove(id);
  return;
};
