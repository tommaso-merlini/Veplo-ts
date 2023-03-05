const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true },
  status: { type: String, required: true },
  shopInfo: {
    id: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    status: { type: String, required: true },
  },
  productVariations: [
    {
      variationId: { type: mongoose.Types.ObjectId, required: true },
      photo: { type: String, required: true },
      name: { type: String, required: true },
      price: {
        v1: {
          type: Number,
          required: true,
        },
        v2: {
          type: Number,
          required: false,
        },
        discountPercentage: { type: Number, required: false },
      },
      quantity: { type: Number, required: true },
      color: { type: String, required: true },
      size: { type: String, required: true },
      status: { type: String, required: true },
    },
  ],
});

const Cart = mongoose.model("cart", CartSchema);
export default Cart;
