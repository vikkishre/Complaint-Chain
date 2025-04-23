require("dotenv").config();
const { ethers } = require("ethers");
// Set up provider (use a local Hardhat instance)
const provider = new ethers.JsonRpcProvider("http://localhost:8545");

// Your wallet private key (make sure to use an environment variable or secure way to handle it)
const privateKey = process.env.PRIVATE_KEY; // Replace with your actual private key

// Create a wallet signer using the private key and the provider
const wallet = new ethers.Wallet(privateKey, provider);

// Address of the deployed contract
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// ABI of the contract
const contractABI = [
  "function registerComplaint(uint256 _id, string _description) external returns (bytes32)",
  "function updateComplaintStatus(uint256 _id, bytes32 _newStatusHash) external",
  "function getComplaint(uint256 _id) external view returns (uint256, uint256, bytes32, address, string)"
];

// Create a contract instance connected to the signer
const complaintContract = new ethers.Contract(contractAddress, contractABI, wallet);

// Function to register complaint and return the transaction hash
async function registerComplaint(id, description) {
  const tx = await complaintContract.registerComplaint(id, description);
  const receipt = await tx.wait(); // Wait for the transaction to be mined
  return receipt.transactionHash;  // Return the transaction hash
}

// Function to update complaint status (this would also be a transaction on the blockchain)
async function updateComplaintStatus(id, newStatusHash) {
  const tx = await complaintContract.updateComplaintStatus(id, newStatusHash);
  const receipt = await tx.wait(); // Wait for the transaction to be mined
  return receipt.transactionHash;  // Return the transaction hash
}

// Function to get complaint data (read-only)
async function getComplaint(id) {
  const complaint = await complaintContract.getComplaint(id);
  console.log(`Complaint ID: ${complaint[0]}, Timestamp: ${complaint[1]}, Status Hash: ${complaint[2]}, Created By: ${complaint[3]}, Description: ${complaint[4]}`);
}

module.exports = { registerComplaint, updateComplaintStatus, getComplaint };
