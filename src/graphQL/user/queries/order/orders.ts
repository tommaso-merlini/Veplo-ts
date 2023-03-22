import Cart from "../../../../schemas/Cart.model";
import Order from "../../../../schemas/Order.model";
import Product from "../../../../schemas/Product.model";

export const orders = async (user, { _ }) => {
  const orders = await Order.find({
    "user.id": user.id,
  });

  const reversedOrders = orders.reverse();

  return orders;
};
