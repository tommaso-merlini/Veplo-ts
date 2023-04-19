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
    fit: { type: String, required: true },
    traits: [{ type: String, required: true }],
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
//             "analyzer": "lucene.whitespace",
//             "type": "string"
//           },
//           "fit": {
//             "analyzer": "lucene.whitespace",
//             "type": "string"
//           },
//           "gender": {
//             "analyzer": "lucene.whitespace",
//             "type": "string"
//           },
//           "macroCategory": {
//             "analyzer": "lucene.whitespace",
//             "type": "string"
//           },
//           "microCategory": {
//             "analyzer": "lucene.whitespace",
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
//       "name": [
//         {
//           "analyzer": "lucene.italian",
//           "type": "string"
//         },
//         {
//           "analyzer": "lucene.standard",
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
//             "analyzer": "lucene.whitespace",
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
