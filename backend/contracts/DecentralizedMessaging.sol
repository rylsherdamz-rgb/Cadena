// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract DecentralizedMessaging {
    struct Message {
        uint256 messageId;
        address sender;
        address recipient;
        string content;
        uint256 timestamp;
        bool isRead;
    }

    struct Conversation {
        address participant1;
        address participant2;
        uint256[] messageIds;
        uint256 lastMessageTime;
    }

    uint256 private nextMessageId = 1;
    uint256 private nextConversationId = 1;

    // Mapping: messageId => Message
    mapping(uint256 => Message) public messages;

    // Mapping: conversationId => Conversation
    mapping(uint256 => Conversation) public conversations;

    // Mapping: address => conversationIds
    mapping(address => uint256[]) public userConversations;

    // Mapping: (address1, address2) => conversationId
    mapping(address => mapping(address => uint256)) public conversationLookup;

    // Mapping: address => unread count
    mapping(address => uint256) public unreadCount;

    event MessageSent(uint256 indexed messageId, address indexed sender, address indexed recipient, uint256 timestamp);
    event MessageRead(uint256 indexed messageId, address indexed reader);
    event ConversationCreated(uint256 indexed conversationId, address indexed participant1, address indexed participant2);

    function sendMessage(address _recipient, string calldata _content) external returns (uint256) {
        require(_recipient != address(0), "Invalid recipient");
        require(bytes(_content).length > 0, "Content cannot be empty");
        require(bytes(_content).length <= 1000, "Content too long");

        uint256 messageId = nextMessageId++;
        uint256 conversationId;

        // Get or create conversation
        if (conversationLookup[msg.sender][_recipient] == 0) {
            conversationId = _createConversation(msg.sender, _recipient);
        } else {
            conversationId = conversationLookup[msg.sender][_recipient];
        }

        // Store message
        messages[messageId] = Message({
            messageId: messageId,
            sender: msg.sender,
            recipient: _recipient,
            content: _content,
            timestamp: block.timestamp,
            isRead: false
        });

        // Add to conversation
        conversations[conversationId].messageIds.push(messageId);
        conversations[conversationId].lastMessageTime = block.timestamp;

        // Increment unread count
        unreadCount[_recipient]++;

        emit MessageSent(messageId, msg.sender, _recipient, block.timestamp);
        return messageId;
    }

    function _createConversation(address _participant1, address _participant2) private returns (uint256) {
        uint256 conversationId = nextConversationId++;

        // Store both directions for easier lookup
        conversations[conversationId] = Conversation({
            participant1: _participant1,
            participant2: _participant2,
            messageIds: new uint256[](0),
            lastMessageTime: block.timestamp
        });

        conversationLookup[_participant1][_participant2] = conversationId;
        conversationLookup[_participant2][_participant1] = conversationId;

        userConversations[_participant1].push(conversationId);
        userConversations[_participant2].push(conversationId);

        emit ConversationCreated(conversationId, _participant1, _participant2);
        return conversationId;
    }

    function markAsRead(uint256 _messageId) external {
        Message storage message = messages[_messageId];

        require(message.recipient == msg.sender, "Not the recipient");
        require(!message.isRead, "Already marked as read");

        message.isRead = true;
        if (unreadCount[msg.sender] > 0) {
            unreadCount[msg.sender]--;
        }

        emit MessageRead(_messageId, msg.sender);
    }

    function getConversation(uint256 _conversationId) 
        external 
        view 
        returns (
            address participant1,
            address participant2,
            uint256[] memory messageIds,
            uint256 lastMessageTime
        ) 
    {
        Conversation storage conv = conversations[_conversationId];
        return (conv.participant1, conv.participant2, conv.messageIds, conv.lastMessageTime);
    }

    function getConversationWithOther(address _otherParty) 
        external 
        view 
        returns (uint256 conversationId) 
    {
        return conversationLookup[msg.sender][_otherParty];
    }

    function getUserConversations(address _user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userConversations[_user];
    }

    function getMessage(uint256 _messageId) 
        external 
        view 
        returns (
            address sender,
            address recipient,
            string memory content,
            uint256 timestamp,
            bool isRead
        ) 
    {
        Message storage msg = messages[_messageId];
        return (msg.sender, msg.recipient, msg.content, msg.timestamp, msg.isRead);
    }

    function getMessages(uint256[] calldata _messageIds) 
        external 
        view 
        returns (Message[] memory) 
    {
        Message[] memory result = new Message[](_messageIds.length);
        for (uint256 i = 0; i < _messageIds.length; i++) {
            result[i] = messages[_messageIds[i]];
        }
        return result;
    }

    function getUnreadCount(address _user) external view returns (uint256) {
        return unreadCount[_user];
    }

    function deleteMessage(uint256 _messageId) external {
        Message storage message = messages[_messageId];
        require(message.sender == msg.sender, "Not the sender");
        require(message.timestamp + 1 hours > block.timestamp, "Message expired");

        delete messages[_messageId];
    }
}
