import Cart from "../../schemas/Cart.model";

export const deleteCartById = async (id: string) => {
  await Cart.findByIdAndRemove(id);
  return;
};
