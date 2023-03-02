const mongoose = require("mongoose");

// mongoose.set("useCreateIndex", true);

const VariationSchema = new mongoose.Schema({
  color: { type: String, required: true },
  status: { type: String, required: true },
  name: { type: String, required: true },
  updatedAt: { type: Date, required: true },
  price: {
    v1: { type: Number, required: true },
    v2: { type: Number, required: false },
    discountPercentage: { type: Number, required: false },
  },
  photos: [{ type: String, required: true }],
  lots: [
    {
      size: { type: String, required: true },
      quantity: { type: Number, required: false },
    },
  ],
  product: {
    id: { type: mongoose.Types.ObjectId, required: true },
    status: { type: String, required: true },
    canBuy: { type: Boolean, required: true },
    info: {
      gender: { type: String, required: true },
      macroCategory: { type: String, required: true },
      microCategory: { type: String, required: true },
      brand: { type: String, required: false },
    },
  },

  shopInfo: {
    id: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    status: { type: String, required: true },
  },
  location: {
    type: { type: String, required: true },
    coordinates: [{ type: Number, required: true }],
  },
});

// VariationSchema.index({
//   name: "VariationSearchIndex",

//   mappings: {
//     dynamic: false,
//     fields: {
//       location: {
//         type: "geo",
//       },
//       name: {
//         type: "string",
//         analyzer: "lucene.italian",
//       },
//       updatedAt: {
//         type: "date",
//       },
//       status: {
//         type: "string",
//       },
//       price: {
//         type: "document",
//       },
//       lots: {
//         type: "array",
//       },
//       product: {
//         type: "document",
//       },
//       shopInfo: {
//         type: "document",
//       },
//     },
//   },
// });

const Variation = mongoose.model("variation", VariationSchema);
export default Variation;
