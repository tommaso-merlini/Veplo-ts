const mongoose = require("mongoose");

const InformationSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: false,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const Information = mongoose.model("information", InformationSchema);
export default Information;
