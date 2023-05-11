import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema({
  businessId: { type: mongoose.Types.ObjectId, required: true },
  businessStatus: { type: String, required: true },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  profileCover: { type: String, required: true },
  profilePhoto: { type: String, required: true },
  isDigitalOnly: { type: Boolean, required: false },
  minimumAmountForFreeShipping: { type: Number, required: false },
  categories: [{ type: String, required: true }],
  info: {
    phone: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    opening: {
      days: [{ type: Number, required: true }],
      hours: [{ type: String, required: true }],
    },
  },
  address: {
    postcode: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    street: {
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
  },
});

// ShopSchema.index({
//   "address.location": "2dsphere",
// });

// ShopSchema.index({
//   name: "ShopSearchIndex",

//   mappings: {
//     dynamic: false,
//     fields: {
//       address: {
//         fields: {
//           location: {
//             type: "geo",
//           },
//         },
//         type: "document",
//       },
//       name: {
//         type: "string",
//         analyzer: "lucene.italian",
//       },
//       createdAt: {
//         type: "date",
//       },
//     },
//   },
// });

// {
//   "mappings": {
//     "dynamic": false,
//     "fields": {
//       "address": {
//         "fields": {
//           "location": {
//             "type": "geo"
//           }
//         },
//         "type": "document"
//       },
//       "name": {
//         "analyzer": "lucene.italian",
//         "type": "string"
//       },
//       "createdAt": {
//         "type": "date"
//       }
//     }
//   }
// }

const Shop = mongoose.model("shop", ShopSchema);
export default Shop;
