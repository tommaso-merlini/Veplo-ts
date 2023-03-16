const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true },
  status: { type: String, required: true },
  shopInfo: {
    id: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    status: { type: String, required: true },
    businessId: { type: mongoose.Types.ObjectId, required: true },
  },
  productVariations: [
    {
      variationId: { type: mongoose.Types.ObjectId, required: true },
      quantity: { type: Number, required: true },
      size: { type: String, required: true },
    },
  ],
});

CartSchema.index({ userId: 1 });

const Cart = mongoose.model("cart", CartSchema);
export default Cart;
