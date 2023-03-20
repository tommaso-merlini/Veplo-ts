import Cart from "../../schemas/Cart.model";

export const deleteCartById = async (id) => {
  await Cart.findByIdAndRemove(id);
  return;
};
