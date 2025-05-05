// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ComplaintContract {
    struct Complaint {
        uint256 id;
        uint256 timestamp;
        string description;
        string location;
        string complaintType;
        string username;          // Username stored in complaint
        string status;
        address createdBy;
        bytes32 statusHash;
    }

    mapping(uint256 => Complaint) public complaints;   // Maps complaint ID to complaint data
    uint256[] public allComplaintIds;                   // Tracks all complaint IDs for admin access

    string[] public allowedStatuses = ["Pending", "In Progress", "Resolved"];

    event ComplaintRegistered(
        uint256 id,
        uint256 timestamp,
        string description,
        string location,
        string complaintType,
        string status,
        address createdBy,
        string username,
        bytes32 statusHash
    );

    event ComplaintStatusUpdated(
        uint256 id,
        string newStatus,
        bytes32 newStatusHash
    );

    // Register a new complaint with user details
    function registerComplaint(
        uint256 _id,
        string memory _description,
        string memory _location,
        string memory _complaintType,
        address _createdBy,
        string memory _username
    ) external returns (bytes32) {
        require(complaints[_id].timestamp == 0, "Complaint already exists");

        bytes32 computedStatusHash = sha256(
            abi.encodePacked(_id, _description, _location, _complaintType, "Pending", block.timestamp)
        );

        complaints[_id] = Complaint({
            id: _id,
            timestamp: block.timestamp,
            description: _description,
            location: _location,
            complaintType: _complaintType,
            username: _username,
            status: "Pending",
            createdBy: _createdBy,
            statusHash: computedStatusHash
        });

        allComplaintIds.push(_id);  // Track all complaint IDs for admin

        emit ComplaintRegistered(
            _id,
            block.timestamp,
            _description,
            _location,
            _complaintType,
            "Pending",
            _createdBy,
            _username,
            computedStatusHash
        );

        return computedStatusHash;
    }

    // Update the status of a complaint
    function updateComplaintStatus(uint256 _id, string memory _newStatus) external {
        require(complaints[_id].timestamp != 0, "Complaint does not exist");
        require(isValidStatus(_newStatus), "Invalid status value");

        bytes32 newStatusHash = sha256(
            abi.encodePacked(
                _id,
                complaints[_id].description,
                complaints[_id].location,
                complaints[_id].complaintType,
                _newStatus,
                block.timestamp
            )
        );

        complaints[_id].status = _newStatus;
        complaints[_id].statusHash = newStatusHash;

        emit ComplaintStatusUpdated(_id, _newStatus, newStatusHash);
    }

    // Get a specific complaint by ID
   function getComplaint(uint256 _id) external view returns (
    uint256, uint256, string memory, string memory, string memory, string memory, string memory, address, bytes32
) {
    Complaint memory comp = complaints[_id];
    return (
        comp.id,
        comp.timestamp,
        comp.description,
        comp.location,
        comp.complaintType,
        comp.status,    // ✅ status first
        comp.username,  // ✅ username second
        comp.createdBy,
        comp.statusHash
    );
}


    // Get all complaint IDs (admin-only functionality)
    function getAllComplaintIds() external view returns (uint256[] memory) {
        return allComplaintIds;
    }

    // Helper function to check if a status is valid
    function isValidStatus(string memory status) internal view returns (bool) {
        for (uint i = 0; i < allowedStatuses.length; i++) {
            if (keccak256(bytes(allowedStatuses[i])) == keccak256(bytes(status))) {
                return true;
            }
        }
        return false;
    }
}
