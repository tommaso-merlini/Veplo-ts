import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  checkoutSessionId: {
    type: String,
    required: true,
  },
  user: {
    id: { type: mongoose.Types.ObjectId, required: true },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
    firebaseId: {
      type: String,
      required: true,
    },
  },
  recipient: {
    name: {
      type: String,
      required: true,
    },
    phone: {
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
  shipping: {
    url: {
      type: String,
      required: false,
    },
    courier: {
      type: String,
      required: false,
    },
    code: {
      type: String,
      required: false,
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
    businessId: { type: mongoose.Types.ObjectId, required: true },
    businessFirebaseId: {
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
      brand: {
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
