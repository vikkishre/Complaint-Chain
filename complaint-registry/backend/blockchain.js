require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider("http://localhost:7545");

const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

const contractAddress = "0xED0EeA3BCdf824b25a9f308B984357F6Be2BeB69"; // Replace if re-deployed

const contractABI = [
  "function registerComplaint(uint256 _id, string _description, string _location, string _complaintType, address _createdBy, string _username) external returns (bytes32)",
  "function updateComplaintStatus(uint256 _id, string _newStatus) external",
  "function getComplaint(uint256 _id) external view returns (uint256, uint256, string, string, string, string, string, address, bytes32)",
  "function getAllComplaintIds() external view returns (uint256[] memory)", // ✅ ADD THIS LINE

  "event ComplaintRegistered(uint256 id, uint256 timestamp, string description, string location, string complaintType, string status, address createdBy, string username, bytes32 statusHash)",
  "event ComplaintStatusUpdated(uint256 id, string newStatus, bytes32 newStatusHash)"
];


const complaintContract = new ethers.Contract(contractAddress, contractABI, wallet);

/**
 * Registers a complaint on the blockchain.
 */
async function registerComplaint(id, description, location, complaintType, username) {
  try {
    const tx = await complaintContract.registerComplaint(
      id,
      description,
      location,
      complaintType,
      wallet.address,
      username
    );
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error registering complaint:", error);
    throw error;
  }
}

/**
 * Updates the complaint status.
 */
async function updateComplaintStatus(id, newStatus) {
  try {
    const tx = await complaintContract.updateComplaintStatus(id, newStatus);
    await tx.wait();
    const complaint = await complaintContract.getComplaint(id);
    return complaint[8]; // statusHash
  } catch (error) {
    console.error("Error updating complaint status:", error);
    throw error;
  }
}

/**
 * Gets a complaint by ID.
 */
async function getComplaint(id) {
  const comp = await complaintContract.getComplaint(id);
  return {
    id: comp[0].toString(),
    timestamp: comp[1].toString(),
    description: comp[2],
    location: comp[3],
    complaintType: comp[4],
    status: comp[5],
    username: comp[6],
    createdBy: comp[7],
    statusHash: comp[8]
  };
}
// Fetch all complaints made by a specific user (non-admin)
async function getAllComplaints() {
  const allComplaintIds = await complaintContract.getAllComplaintIds();
  const complaints = [];

  for (let id of allComplaintIds) {
    const complaint = await getComplaint(id);
    complaints.push(complaint);
  }

  return complaints;
}

// Fetch only user complaints
async function getUserComplaints(username) {
  const allComplaints = await getAllComplaints();
  return allComplaints.filter(complaint => complaint.username === username);
}

// Admin: fetch all complaints
async function getAdminComplaints() {
  return await getAllComplaints();
}


module.exports = {
  registerComplaint,
  updateComplaintStatus,
  getComplaint,
  getAllComplaints,
  getAdminComplaints,
  getUserComplaints

};
