const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  stripeId: {
    type: String,
    required: true,
  },
  firebaseId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  location: {
    type: {
      type: String,
      required: false,
    },
    coordinates: [{ type: Number, required: false }],
  },
  gender: {
    type: String,
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
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

const User = mongoose.model("user", UserSchema);
export default User;
