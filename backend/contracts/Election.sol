// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Election {
    enum Position {
        President,
        VicePresident,
        Senator,
        Partylist
    }

    struct Candidate {
        string name;
        string party;
        Position position;
        uint256 voteCount;
    }

    Candidate[] public candidates;

    // --- VOTER TRACKING ---
    mapping(address => bool) public hasVoted;
    mapping(address => uint256[]) private votedSenators;
    mapping(address => uint256) private votedParty;

    event VoteCast(address indexed voter, uint256[] senatorIds, uint256 partyId);
    event CandidateAdded(uint256 id, string name, string party, Position position);

    constructor(
        string[] memory names,
        string[] memory parties,
        Position[] memory positions
    ) {
        require(
            names.length == parties.length && parties.length == positions.length,
            "Length mismatch"
        );

        for (uint256 i = 0; i < names.length; i++) {
            candidates.push(
                Candidate({
                    name: names[i],
                    party: parties[i],
                    position: positions[i],
                    voteCount: 0
                })
            );

            emit CandidateAdded(i, names[i], parties[i], positions[i]);
        }
    }

    /// @notice Cast votes for multiple senators and a party-list
    function voteBatch(uint256[] calldata senatorIds, uint256 partyId) external {
        require(!hasVoted[msg.sender], "Already voted");
        require(senatorIds.length > 0, "No senators selected");
        require(senatorIds.length <= 12, "Cannot vote for more than 12 senators");

        hasVoted[msg.sender] = true;

        // Store voter choices
        votedSenators[msg.sender] = senatorIds;
        votedParty[msg.sender] = partyId;

        // Count senator votes
        for (uint256 i = 0; i < senatorIds.length; i++) {
            uint256 id = senatorIds[i];
            require(id < candidates.length, "Invalid senator ID");
            require(candidates[id].position == Position.Senator, "Not a senator");
            candidates[id].voteCount++;
        }

        // Count party-list vote
        require(partyId < candidates.length, "Invalid party ID");
        require(candidates[partyId].position == Position.Partylist, "Not a party-list");
        candidates[partyId].voteCount++;

        emit VoteCast(msg.sender, senatorIds, partyId);
    }

    /// @notice Get candidate info
    function getCandidate(uint256 id)
        external
        view
        returns (string memory, string memory, Position, uint256)
    {
        require(id < candidates.length, "Invalid candidate ID");
        Candidate memory c = candidates[id];
        return (c.name, c.party, c.position, c.voteCount);
    }

    /// @notice Total number of candidates
    function getCandidatesCount() external view returns (uint256) {
        return candidates.length;
    }

    /// -----------------------------
    /// NEW GETTERS FOR FRONTEND
    /// -----------------------------

    /// @notice Get senators voted by an address
    function getVotedSenators(address voter)
        external
        view
        returns (uint256[] memory)
    {
        require(hasVoted[voter], "Voter has not voted");
        return votedSenators[voter];
    }

    /// @notice Get party-list voted by an address
    function getVotedParty(address voter)
        external
        view
        returns (uint256)
    {
        require(hasVoted[voter], "Voter has not voted");
        return votedParty[voter];
    }
}
