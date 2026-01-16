// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DecentralizedMessaging {
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
        bool read;
    }

    // mapping from recipient address to array of messages
    mapping(address => Message[]) private inbox;

    event MessageSent(address indexed sender, address indexed recipient, uint256 timestamp);

    /// @notice Send a message to a specific recipient
    function sendMessage(address _recipient, string calldata _content) external {
        require(_recipient != address(0), "Invalid recipient");

        inbox[_recipient].push(Message({
            sender: msg.sender,
            content: _content,
            timestamp: block.timestamp,
            read: false
        }));

        emit MessageSent(msg.sender, _recipient, block.timestamp);
    }

    /// @notice Get all messages sent to the caller
    function getMyMessages() external view returns (Message[] memory) {
        return inbox[msg.sender];
    }

    /// @notice Mark a message as read
    function markAsRead(uint256 _index) external {
        require(_index < inbox[msg.sender].length, "Invalid message index");
        inbox[msg.sender][_index].read = true;
    }

    /// @notice Get the number of messages the caller has
    function myMessageCount() external view returns (uint256) {
        return inbox[msg.sender].length;
    }
}
