// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ComplaintContract {
    struct Complaint {
        uint256 id;
        uint256 timestamp;
        string description;
        string status;
        address createdBy;
        bytes32 statusHash;  // Add a field for statusHash
    }

    mapping(uint256 => Complaint) public complaints;

    event ComplaintRegistered(
        uint256 id,
        uint256 timestamp,
        string description,
        string status,
        address indexed createdBy,
        bytes32 statusHash  // Add statusHash to the event
    );

    event ComplaintStatusUpdated(
        uint256 id,
        string newStatus
    );

    function registerComplaint(uint256 _id, string memory _description) external returns (bytes32) {
        require(complaints[_id].timestamp == 0, "Complaint already exists");

        // Compute the statusHash
        bytes32 computedStatusHash = keccak256(abi.encodePacked(_id, _description, block.timestamp));

        complaints[_id] = Complaint({
            id: _id,
            timestamp: block.timestamp,
            description: _description,
            status: "Registered",
            createdBy: msg.sender,
            statusHash: computedStatusHash  // Store the statusHash in the struct
        });

        emit ComplaintRegistered(_id, block.timestamp, _description, "Registered", msg.sender, computedStatusHash);
        
        return computedStatusHash;  // Return statusHash to the caller
    }

    function updateComplaintStatus(uint256 _id, string memory _newStatus) external {
        require(complaints[_id].timestamp != 0, "Complaint does not exist");
        require(complaints[_id].createdBy == msg.sender, "Only creator can update");

        complaints[_id].status = _newStatus;

        emit ComplaintStatusUpdated(_id, _newStatus);
    }

    function getComplaint(uint256 _id) external view returns (uint256, uint256, string memory, string memory, address, bytes32) {
        Complaint memory comp = complaints[_id];
        return (comp.id, comp.timestamp, comp.description, comp.status, comp.createdBy, comp.statusHash);  // Return statusHash as well
    }
}
