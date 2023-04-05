import mongoose from "mongoose";

// mongoose.set("useCreateIndex", true);

const CapSchema = new mongoose.Schema({
  cap: {
    type: String,
    required: true,
  },
  city: {
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
});

// Duplicate the ID field.
CapSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
CapSchema.set("toJSON", {
  virtuals: true,
});

const Cap = mongoose.model("cap", CapSchema);
export default Cap;
