// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Election {
    address public admin;

    struct Candidate {
        string name;
        string party;
        uint256 voteCount;
    }

    mapping(uint256 => Candidate) public candidates;
    uint256 public candidatesCount;

    mapping(address => bool) public hasVoted;

    event CandidateAdded(uint256 id, string name, string party);
    event VoteCast(address voter, uint256 candidateId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addCandidate(
        string memory name,
        string memory party
    ) external onlyAdmin {
        candidates[candidatesCount] = Candidate(name, party, 0);
        emit CandidateAdded(candidatesCount, name, party);
        candidatesCount++;
    }

    function vote(uint256 candidateId) external {
        require(!hasVoted[msg.sender], "Already voted");
        require(candidateId < candidatesCount, "Invalid candidate");

        hasVoted[msg.sender] = true;
        candidates[candidateId].voteCount++;

        emit VoteCast(msg.sender, candidateId);
    }

    function getCandidate(uint256 id)
        external
        view
        returns (string memory, string memory, uint256)
    {
        Candidate memory c = candidates[id];
        return (c.name, c.party, c.voteCount);
    }
}
