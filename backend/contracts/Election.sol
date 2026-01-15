// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Election {
    enum Position {
        President,
        VicePresident,
        Senator,
        PartyList,
        Governor,
        ViceGovernor,
        Representative,
        Mayor,
        ViceMayor,
        Councilor
    }

    struct Candidate {
        string name;
        string party;
        Position position;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;

    event VoteCast(address voter, uint256 candidateId);

    constructor(
        string[] memory names,
        string[] memory parties,
        Position[] memory positions
    ) {
        require(
            names.length == parties.length &&
            parties.length == positions.length,
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
        }
    }

    function vote(uint256 candidateId) external {
        require(!hasVoted[msg.sender], "Already voted");
        require(candidateId < candidates.length, "Invalid candidate");

        hasVoted[msg.sender] = true;
        candidates[candidateId].voteCount++;

        emit VoteCast(msg.sender, candidateId);
    }

    function getCandidate(uint256 id)
        external
        view
        returns (
            string memory name,
            string memory party,
            Position position,
            uint256 voteCount
        )
    {
        Candidate memory c = candidates[id];
        return (c.name, c.party, c.position, c.voteCount);
    }

    function getCandidatesCount() external view returns (uint256) {
        return candidates.length;
    }
}
