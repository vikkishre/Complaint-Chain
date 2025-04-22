const express = require("express");
const mongoose = require("mongoose");
const { getComplaint, registerComplaint, updateComplaintStatus } = require("./blockchain");
const Complaint = require("./models/Complaint"); // Import the complaint model
require('dotenv').config();

const app = express();
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Route to get complaint data from blockchain and MongoDB
app.get("/complaint/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const complaint = await getComplaint(id);
    res.json(complaint);
  } catch (err) {
    res.status(500).send("Error fetching complaint data");
  }
});

// Route to register a new complaint in blockchain and MongoDB
app.post("/complaint", async (req, res) => {
  const { id, description, createdBy } = req.body;

  try {
    // Register complaint on blockchain and get the status hash (transaction hash)
    const statusHash = await registerComplaint(id, description);

    // Create a new complaint document in MongoDB
    const newComplaint = new Complaint({
      id: id,
      timestamp: Date.now(),
      statusHash: statusHash, // Blockchain status hash
      createdBy: createdBy,  // Assuming you pass 'createdBy' in the request body
      description: description,
    });

    // Save the complaint to MongoDB
    await newComplaint.save();

    res.status(201).send("Complaint registered successfully");
  } catch (err) {
    console.error("Error registering complaint:", err);
    res.status(500).send("Error registering complaint");
  }
});


// Route to update complaint status on blockchain and MongoDB
app.put("/complaint/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { newStatusHash } = req.body;

  try {
    // Update complaint status on blockchain
    await updateComplaintStatus(id, newStatusHash);

    // Update complaint status in MongoDB
    await Complaint.findOneAndUpdate({ id: id }, { statusHash: newStatusHash });

    res.send("Complaint status updated successfully");
  } catch (err) {
    res.status(500).send("Error updating complaint status");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
