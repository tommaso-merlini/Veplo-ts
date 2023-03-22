const mongoose = require("mongoose");

// mongoose.set("useCreateIndex", true);

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: { type: String, required: true },
  canBuy: { type: Boolean, required: true },
  orderCounter: { type: Number, required: false },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
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
  info: {
    gender: {
      type: String,
      required: true,
    },
    macroCategory: {
      type: String,
      required: true,
    },
    microCategory: {
      type: String,
      required: true,
    },
    brand: { type: String, required: true },
    fit: { type: String, required: true },
  },
  location: {
    type: {
      type: String,
      required: true,
    },
    coordinates: [{ type: Number, required: true }],
  },
  shopInfo: {
    id: { type: mongoose.Types.ObjectId, required: true },
    businessId: { type: mongoose.Types.ObjectId, required: true },
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    status: { type: String, required: true },
  },
  variations: [
    {
      color: { type: String, required: true },
      status: { type: String, required: true },
      photos: [{ type: String, required: true }],
      lots: [
        {
          size: { type: String, required: true },
          quantity: { type: Number, required: false },
        },
      ],
    },
  ],
});

ProductSchema.index({
  name: "ProductSearchIndex",

  mappings: {
    dynamic: false,
    fields: {
      location: {
        type: "geo",
      },
      name: {
        type: "string",
        analyzer: "lucene.italian",
      },
      updatedAt: {
        type: "date",
      },
      status: {
        type: "string",
      },
      variations: {
        type: "embeddedDocuments",
        dynamic: true,
      },
      price: {
        fields: {
          discountPercentage: {
            type: "number",
          },
        },
        type: "document",
        dynamic: false,
      },
    },
  },
});

const Product = mongoose.model("product", ProductSchema);
export default Product;
