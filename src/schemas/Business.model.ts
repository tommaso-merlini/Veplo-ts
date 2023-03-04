const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema({
  firebaseId: { type: String, required: true },
  businessName: {
    type: String,
    required: false,
  },
  vatNumber: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  stripe: {
    id: {
      type: String,
      required: false,
    },
  },
});

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

const Business = mongoose.model("business", BusinessSchema);
export default Business;
