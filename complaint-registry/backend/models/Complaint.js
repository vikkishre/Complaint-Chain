const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  timestamp: Number,
  description: String,
  location: String,
  status: { type: String, default: "Registered" },
  createdBy: String,
  statusHash: String,
  username: { type: String, required: true }, // Added username field
});

module.exports = mongoose.model("Complaint", complaintSchema);
