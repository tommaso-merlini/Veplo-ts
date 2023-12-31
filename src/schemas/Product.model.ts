import mongoose from "mongoose";

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
    traits: [{ type: String, required: true }],
    fit: { type: String, required: false },
    occasions: [{ type: String, required: false }],
    materials: [{ type: String, required: false }],
    length: { type: String, required: false },
    making: { type: String, required: false },
    collar: { type: String, required: false },
    keywords: [{ type: String, required: false }],
    description: { type: String, required: false },
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
    profilePhoto: { type: String, required: true },
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    status: { type: String, required: true },
    businessStatus: { type: String, required: true },
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

// {
//   "mappings": {
//     "dynamic": false,
//     "fields": {
//       "info": {
//         "dynamic": false,
//         "fields": {
//           "brand": {
//             "type": "string"
//           },
//           "fit": {
//             "type": "string"
//           },
//           "gender": {
//             "type": "string"
//           },
//           "macroCategory": {
//             "type": "string"
//           },
//           "microCategory": {
//             "type": "string"
//           },
//           "traits": {
//             "analyzer": "lucene.keyword",
//             "searchAnalyzer": "lucene.keyword",
//             "type": "string"
//           }
//         },
//         "type": "document"
//       },
//       "location": {
//         "type": "geo"
//       },
//       "_id": {
//         "type": "objectId"
//       },
//       "name": [
//         {
//           "analyzer": "lucene.italian",
//           "type": "string"
//         },
//         {
//           "type": "autocomplete"
//         }
//       ],
//       "orderCounter": {
//         "type": "number"
//       },
//       "price": {
//         "dynamic": false,
//         "fields": {
//           "discountPercentage": {
//             "type": "number"
//           }
//         },
//         "type": "document"
//       },
//       "shopInfo": {
//         "dynamic": false,
//         "fields": {
//           "businessStatus": {
//             "type": "string"
//           },
//           "id": {
//             "type": "objectId"
//           },
//           "status": {
//             "type": "string"
//           }
//         },
//         "type": "document"
//       },
//       "status": {
//         "analyzer": "lucene.keyword",
//         "searchAnalyzer": "lucene.keyword",
//         "type": "string"
//       },
//       "updatedAt": {
//         "type": "date"
//       },
//       "variations": {
//         "dynamic": false,
//         "fields": {
//           "color": {
//             "type": "string"
//           },
//           "lots": {
//             "dynamic": false,
//             "fields": {
//               "quantity": {
//                 "type": "number"
//               },
//               "size": {
//                 "type": "string"
//               }
//             },
//             "type": "embeddedDocuments"
//           }
//         },
//         "type": "embeddedDocuments"
//       }
//     }
//   }
// }

const Product = mongoose.model("product", ProductSchema);
export default Product;
