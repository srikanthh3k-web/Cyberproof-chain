// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EvidenceRegistry {
    struct EvidenceRecord {
        string evidenceId;
        string fileHash;
        address uploader;
        string investigationId;
        uint256 timestamp;
        bool verified;
        address custodian;
    }

    struct CustodyEvent {
        string evidenceId;
        address from;
        address to;
        uint256 timestamp;
        string action;
    }

    mapping(string => EvidenceRecord) private evidenceMap;
    mapping(string => CustodyEvent[]) private custodyHistory;

    event EvidenceRegistered(string evidenceId, string fileHash, string investigationId, uint256 timestamp);
    event EvidenceVerified(string evidenceId, string fileHash, bool verified, uint256 timestamp);
    event CustodyTransferred(string evidenceId, address from, address to, string action, uint256 timestamp);
    event EvidenceAccessed(string evidenceId, address accessor, uint256 timestamp);

    function registerEvidence(
        string calldata evidenceId,
        string calldata fileHash,
        string calldata investigationId,
        address custodian
    ) external {
        require(bytes(evidenceId).length > 0, "Evidence ID is required");
        require(bytes(fileHash).length > 0, "Hash is required");

        evidenceMap[evidenceId] = EvidenceRecord({
            evidenceId: evidenceId,
            fileHash: fileHash,
            uploader: msg.sender,
            investigationId: investigationId,
            timestamp: block.timestamp,
            verified: false,
            custodian: custodian
        });

        emit EvidenceRegistered(evidenceId, fileHash, investigationId, block.timestamp);
    }

    function verifyEvidence(string calldata evidenceId, string calldata fileHash) external returns (bool) {
        EvidenceRecord storage record = evidenceMap[evidenceId];
        require(bytes(record.evidenceId).length > 0, "Evidence not found");

        bool isValid = keccak256(abi.encodePacked(record.fileHash)) == keccak256(abi.encodePacked(fileHash));
        record.verified = isValid;

        emit EvidenceVerified(evidenceId, fileHash, isValid, block.timestamp);
        return isValid;
    }

    function transferCustody(
        string calldata evidenceId,
        address to,
        string calldata action
    ) external {
        EvidenceRecord storage record = evidenceMap[evidenceId];
        require(bytes(record.evidenceId).length > 0, "Evidence not found");

        address previous = record.custodian;
        record.custodian = to;

        custodyHistory[evidenceId].push(CustodyEvent({
            evidenceId: evidenceId,
            from: previous,
            to: to,
            timestamp: block.timestamp,
            action: action
        }));

        emit CustodyTransferred(evidenceId, previous, to, action, block.timestamp);
    }

    function recordAccess(string calldata evidenceId) external {
        require(bytes(evidenceMap[evidenceId].evidenceId).length > 0, "Evidence not found");
        emit EvidenceAccessed(evidenceId, msg.sender, block.timestamp);
    }

    function getEvidence(string calldata evidenceId) external view returns (EvidenceRecord memory) {
        return evidenceMap[evidenceId];
    }

    function getCustodyHistory(string calldata evidenceId) external view returns (CustodyEvent[] memory) {
        return custodyHistory[evidenceId];
    }
}
