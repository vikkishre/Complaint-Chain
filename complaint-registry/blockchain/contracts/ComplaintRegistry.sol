// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ComplaintContract {
    struct Complaint {
        uint256 id;
        uint256 timestamp;
        string description;
        string location;
        string status;
        address createdBy;
        bytes32 statusHash;
    }

    mapping(uint256 => Complaint) public complaints;

    event ComplaintRegistered(
    uint256 id,
    uint256 timestamp,
    string description,
    string location,
    string status,
    address indexed createdBy,
    bytes32 statusHash
);

    event ComplaintStatusUpdated(
        uint256 id,
        string newStatus,
        bytes32 newStatusHash
    );

    function registerComplaint(
        uint256 _id,
        string memory _description,
        string memory _location
    ) external returns (bytes32) {
        require(complaints[_id].timestamp == 0, "Complaint already exists");

        bytes32 computedStatusHash = keccak256(abi.encodePacked(_id, _description, _location, "Registered", block.timestamp));

        complaints[_id] = Complaint({
            id: _id,
            timestamp: block.timestamp,
            description: _description,
            location: _location,
            status: "Registered",
            createdBy: msg.sender,
            statusHash: computedStatusHash
        });

        emit ComplaintRegistered(_id, block.timestamp, _description, _location, "Registered", msg.sender, computedStatusHash);
        return computedStatusHash;
    }

    function updateComplaintStatus(uint256 _id, string memory _newStatus) external {
        require(complaints[_id].timestamp != 0, "Complaint does not exist");
        require(complaints[_id].createdBy == msg.sender, "Only creator can update");

        bytes32 newStatusHash = keccak256(abi.encodePacked(_id, complaints[_id].description, complaints[_id].location, _newStatus, block.timestamp));
        complaints[_id].status = _newStatus;
        complaints[_id].statusHash = newStatusHash;

        emit ComplaintStatusUpdated(_id, _newStatus, newStatusHash);
    }

    function getComplaint(uint256 _id) external view returns (
        uint256, uint256, string memory, string memory, string memory, address, bytes32
    ) {
        Complaint memory comp = complaints[_id];
        return (comp.id, comp.timestamp, comp.description, comp.location, comp.status, comp.createdBy, comp.statusHash);
    }
}
