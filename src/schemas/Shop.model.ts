import mongoose from "mongoose";

// mongoose.set("useCreateIndex", true);

const ShopSchema = new mongoose.Schema({
  businessId: { type: mongoose.Types.ObjectId, required: true },
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
  photo: { type: String, required: false },
  isDigitalOnly: { type: Boolean, required: false },
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
