const mongoose = require('mongoose');

// Create a Schema for complaints
const complaintSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  statusHash: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  description: {  // Add description field here
    type: String,
    required: true,
  },
});

// Create a model from the schema
const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
