const mongoose = require("mongoose");

// mongoose.set("useCreateIndex", true);

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  colors: [{ type: String, required: true }],
  sizes: [{ type: String, required: true }],
  macroCategory: {
    type: String,
    required: true,
  },
  microCategory: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      required: true,
    },
    coordinates: [{ type: Number, required: true }],
  },
  brand: { type: String, required: false },
  shopId: { type: mongoose.Types.ObjectId, required: true },
  firebaseShopId: { type: String, required: true },
  shopOptions: {
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  photos: [{ type: String, required: true }],
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  discount: {
    type: Number,
    required: false
  },
  discountedPrice: {
    type: Number,
    required: false
  }

  //   status: { type: String, required: true },
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
    },
  },
});

const Product = mongoose.model("product", ProductSchema);
export default Product;
