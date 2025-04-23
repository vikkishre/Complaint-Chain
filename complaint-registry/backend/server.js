const express = require("express");
const mongoose = require("mongoose");
const { getComplaint, registerComplaint, updateComplaintStatus } = require("./blockchain");
const Complaint = require("./models/Complaint");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection failed", err));

app.get("/complaint/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const complaint = await getComplaint(id);
    res.json(complaint);
  } catch (err) {
    res.status(500).send("Error fetching complaint");
  }
});

app.post("/complaint", async (req, res) => {
  const { id, description, createdBy, location } = req.body;

  try {
    const statusHash = await registerComplaint(id, description, location);

    const newComplaint = new Complaint({
      id,
      timestamp: Date.now(),
      description,
      location,
      status: "Registered",
      createdBy,
      statusHash
    });

    await newComplaint.save();
    res.status(201).send("Complaint registered successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering complaint");
  }
});

app.put("/complaint/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { newStatus } = req.body;

  try {
    const newStatusHash = await updateComplaintStatus(id, newStatus);

    await Complaint.findOneAndUpdate(
      { id },
      { status: newStatus, statusHash: newStatusHash }
    );

    res.send("Complaint status updated and synced with blockchain");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating complaint status");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
