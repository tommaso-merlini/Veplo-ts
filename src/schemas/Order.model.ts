const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  uniqueId: {
    type: String,
    required: false,
  },
  cartId: { type: mongoose.Types.ObjectId, required: true },
  status: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  user: {
    id: { type: mongoose.Types.ObjectId, required: true },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    address: {
      city: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      line1: {
        type: String,
        required: true,
      },
      line2: {
        type: String,
        required: false,
      },
      postalCode: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
    },
  },
  totalDetails: {
    amountDiscount: {
      type: Number,
      required: true,
    },
    amountShipping: {
      type: Number,
      required: true,
    },
    amountTax: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  shop: {
    id: { type: mongoose.Types.ObjectId, required: true },
    name: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
  },
  productVariations: [
    {
      productId: { type: mongoose.Types.ObjectId, required: true },
      variationId: { type: mongoose.Types.ObjectId, required: true },
      photo: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
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
      quantity: {
        type: Number,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
    },
  ],
});

const Order = mongoose.model("order", OrderSchema);
export default Order;