require("dotenv").config(); // This must be at the VERY TOP

// Debug: Check if environment variables are loading
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Loaded' : 'MISSING');
console.log('PRIVATE_KEY:', process.env.PRIVATE_KEY ? 'Loaded' : 'MISSING');
console.log('PROVIDER_URL:', process.env.PROVIDER_URL ? 'Loaded' : 'MISSING');
console.log('CONTRACT_ADDRESS:', process.env.CONTRACT_ADDRESS ? 'Loaded' : 'MISSING');

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
const protectedRoute = require('./routes/protectedRoute');

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
  secret: process.env.JWT_SECRET || 'mySecret123', // Use env variable for secret
  resave: false,
  saveUninitialized: true
}));

// MongoDB Connection with better error handling
if (!process.env.MONGO_URI) {
  console.error("ERROR: MONGO_URI environment variable is missing!");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // 5 second timeout
  socketTimeoutMS: 45000 // 45 second socket timeout
})
.then(() => console.log("Connected to MongoDB successfully"))
.catch((err) => {
  console.error("MongoDB connection failed:", err.message);
  console.log("Attempted connection string:", process.env.MONGO_URI);
});

// Initialize complaint ID counter
let complaintIdCounter = 1;

async function initializeComplaintCounter() {
  try {
    const latestComplaint = await Complaint.findOne().sort({ id: -1 });
    complaintIdCounter = latestComplaint ? latestComplaint.id + 1 : 1;
    console.log("Complaint counter initialized to:", complaintIdCounter);
  } catch (err) {
    console.error("Error initializing complaint counter:", err);
    complaintIdCounter = 1; // Reset to 1 if there's an error
  }
}

// Call this during server startup
initializeComplaintCounter().catch(console.error);

// Routes
app.use('/', signupRoute);
app.use('/', loginRoute);
app.use('/', captchaRoute);
app.use('/api', protectedRoute);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Complaint Routes
app.get("/complaints", async (req, res) => {
  const { username, isAdmin } = req.query;

  try {
    const complaints = isAdmin === 'true'
      ? await getAdminComplaints()
      : await getUserComplaints(username);

    res.json(complaints);
  } catch (err) {
    console.error("Error fetching complaints:", err);
    res.status(500).json({ error: "Error fetching complaints", details: err.message });
  }
});

app.post("/complaint", async (req, res) => {
  const { description, location, complaintType, username } = req.body;

  if (!description || !location || !complaintType || !username) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const id = complaintIdCounter++;
    console.log("Registering complaint with ID:", id);

    const statusHash = await registerComplaint(id, description, location, complaintType, username);

    const newComplaint = new Complaint({
      id,
      timestamp: Date.now(),
      description,
      location,
      complaintType,
      status: "Pending",
      statusHash,
      username
    });

    await newComplaint.save();
    console.log("Complaint saved to database:", id);

    res.status(201).json({ 
      message: "Complaint registered successfully", 
      statusHash,
      complaintId: id
    });
  } catch (err) {
    console.error("Error registering complaint:", err);
    res.status(500).json({ error: "Error registering complaint", details: err.message });
  }
});

app.put("/complaint/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { newStatus } = req.body;

  const allowedStatuses = ["Pending", "In Progress", "Resolved"];
  if (!allowedStatuses.includes(newStatus)) {
    return res.status(400).json({ 
      error: "Invalid status update", 
      allowed: allowedStatuses 
    });
  }

  try {
    const newStatusHash = await updateComplaintStatus(id, newStatus);

    await Complaint.findOneAndUpdate(
      { id },
      { status: newStatus, statusHash: newStatusHash },
      { new: true }
    );

    res.json({ 
      message: "Complaint status updated and synced with blockchain",
      status: newStatus,
      statusHash: newStatusHash
    });
  } catch (err) {
    console.error("Error updating complaint status:", err);
    res.status(500).json({ error: "Error updating complaint status", details: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});