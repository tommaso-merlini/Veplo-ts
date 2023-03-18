const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema({
  firebaseId: { type: String, required: true },
  total: {
    type: Number,
    required: true,
  },
  chargeId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: false,
  },
  user: {
    id: { type: mongoose.Types.ObjectId, required: true },
    name: {
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
      postal_code: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
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
  productVariations: {
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
});

const Business = mongoose.model("business", BusinessSchema);
export default Business;
