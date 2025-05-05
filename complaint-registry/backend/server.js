const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
const {
  registerComplaint,
  updateComplaintStatus,
  getComplaint,
  getAllComplaints,
  getAdminComplaints,
  getUserComplaints
} = require("./blockchain");
const Complaint = require("./models/Complaint");
const User = require("./models/User");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const loginRoute = require("./routes/login");
const signupRoute = require("./routes/signup");
const captchaRoute = require("./routes/captcha");
const protectedRoute = require('./routes/protectedRoute');  // Adjust the path as necessary

require("dotenv").config();

const app = express();

// CORS setup
app.use(cors({
  origin: 'http://localhost:5173',  // Frontend URL
  credentials: true
}));

// Middleware
app.use(express.json());  // Parse JSON in request body
app.use(cookieParser());  // Cookie parser middleware

// Session setup (Optional)
app.use(session({
  secret: 'mySecret123',
  resave: false,
  saveUninitialized: true
}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection failed", err));

// Initialize complaint ID counter
let complaintIdCounter = 1;

async function initializeComplaintCounter() {
  const latestComplaint = await Complaint.findOne().sort({ id: -1 });
  complaintIdCounter = latestComplaint ? latestComplaint.id + 1 : 1;
}

// Call this during server startup
initializeComplaintCounter();

// Routes
app.use('/', signupRoute);  // Handle signup requests
app.use('/', loginRoute);    // Handle login requests
app.use('/', captchaRoute);
app.use('/api', protectedRoute);  // This ensures that the routes from protectedRoute are prefixed with /api

  // Handle captcha requests

// Complaint Routes
app.get("/complaints", async (req, res) => {
  const { username, isAdmin } = req.query;

  try {
    const complaints = isAdmin === 'true'
      ? await getAdminComplaints()
      : await getUserComplaints(username);

    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching complaints");
  }
});


app.post("/complaint", async (req, res) => {
  const { description, location, complaintType, username } = req.body;

  try {
    const id = complaintIdCounter++;  // Use and increment the global counter

    const statusHash = await registerComplaint(id, description, location, complaintType, username);

    const newComplaint = new Complaint({
      id,
      timestamp: Date.now(),
      description,
      location,
      complaintType,
      status: "Pending",  // Always "Pending" initially
      statusHash,
      username // Save who created it
    });

    await newComplaint.save();

    res.status(201).json({ message: "Complaint registered successfully", statusHash });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering complaint");
  }
});

app.put("/complaint/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { newStatus } = req.body;

  const allowedStatuses = ["Pending", "In Progress", "Resolved"];
  if (!allowedStatuses.includes(newStatus)) {
    return res.status(400).send("Invalid status update. Allowed: Pending, In Progress, Resolved");
  }

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


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
