require("dotenv").config();
const { ethers } = require("ethers");

// Set up provider (use a local Hardhat instance)
const provider = new ethers.JsonRpcProvider("http://localhost:8545");

// Your wallet private key (use environment variable securely)
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

// Address of the deployed contract
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const contractABI = [
  "function registerComplaint(uint256 _id, string _description, string _location) external returns (bytes32)",
  "function updateComplaintStatus(uint256 _id, string _newStatus) external",
  "function getComplaint(uint256 _id) external view returns (uint256, uint256, string, string, string, address, bytes32)",

  // Add the event definition for ComplaintRegistered
  "event ComplaintRegistered(uint256 id, uint256 timestamp, string description, string location, string status, address createdBy, bytes32 statusHash)"
];


const complaintContract = new ethers.Contract(contractAddress, contractABI, wallet);
complaintContract.once('ComplaintRegistered', (id, timestamp, description, location, status, createdBy, statusHash) => {
  console.log(`✅ Status hash from event: ${statusHash}`);
  return statusHash;
});
async function registerComplaint(id, description, location) {
  try {
    console.log("Starting complaint registration...");

    // Register the complaint on the blockchain
    console.log(`Registering complaint with ID: ${id}, Description: ${description}, Location: ${location}`);
    const tx = await complaintContract.registerComplaint(id, description, location);
    console.log(`Transaction sent. Waiting for confirmation...`);

    const receipt = await tx.wait(); // Wait for the transaction to be mined
    console.log("Transaction Hash",tx.hash)
    console.log("Transaction receipt:", receipt); // Log the transaction receipt
    
    // Fetching the transaction status hash from the event
    complaintContract.once('ComplaintRegistered', (id, timestamp, description, location, status, createdBy, statusHash) => {
      console.log(`✅ Status hash from event: ${statusHash}`);
      console.log(`Complaint Registered: ID=${id}, Status=${status}, CreatedBy=${createdBy}, Hash=${statusHash}`);
    });
    //console.log(`✅ Status hash from event: ${statusHash}`);
    // Return the transaction receipt with statusHash
    return receipt.hash;
  } catch (error) {
    console.error("Error during complaint registration:", error);
    throw error;
  }
}



async function updateComplaintStatus(id, newStatus) {
  const tx = await complaintContract.updateComplaintStatus(id, newStatus);
  await tx.wait();

  // Fetch updated complaint to get latest statusHash
  const complaint = await complaintContract.getComplaint(id);
  return complaint[6]; // statusHash
}

async function getComplaint(id) {
  const comp = await complaintContract.getComplaint(id);
  return {
    id: comp[0].toString(),
    timestamp: comp[1].toString(),
    description: comp[2],
    location: comp[3],
    status: comp[4],
    createdBy: comp[5],
    statusHash: comp[6]
  };
}

module.exports = { registerComplaint, updateComplaintStatus, getComplaint };
