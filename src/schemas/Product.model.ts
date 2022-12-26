const mongoose = require("mongoose");

mongoose.set("useCreateIndex", true);

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
  shop: {
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },

  //   status: { type: String, required: true },
});

// Duplicate the ID field.
ProductSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
ProductSchema.set("toJSON", {
  virtuals: true,
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
    },
  },
});

const Product = mongoose.model("product", ProductSchema);
export default Product;
