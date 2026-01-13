export const MESSAGING_CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_recipient", type: "address" },
      { internalType: "string", name: "_content", type: "string" },
    ],
    name: "sendMessage",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_messageId", type: "uint256" }],
    name: "markAsRead",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_conversationId", type: "uint256" }],
    name: "getConversation",
    outputs: [
      { internalType: "address", name: "participant1", type: "address" },
      { internalType: "address", name: "participant2", type: "address" },
      { internalType: "uint256[]", name: "messageIds", type: "uint256[]" },
      { internalType: "uint256", name: "lastMessageTime", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_otherParty", type: "address" }],
    name: "getConversationWithOther",
    outputs: [{ internalType: "uint256", name: "conversationId", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getUserConversations",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_messageId", type: "uint256" }],
    name: "getMessage",
    outputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "string", name: "content", type: "string" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "bool", name: "isRead", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256[]", name: "_messageIds", type: "uint256[]" }],
    name: "getMessages",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "messageId", type: "uint256" },
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "string", name: "content", type: "string" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "bool", name: "isRead", type: "bool" },
        ],
        internalType: "struct DecentralizedMessaging.Message[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getUnreadCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "messageId", type: "uint256" },
      { indexed: true, internalType: "address", name: "sender", type: "address" },
      { indexed: true, internalType: "address", name: "recipient", type: "address" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "MessageSent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "messageId", type: "uint256" },
      { indexed: true, internalType: "address", name: "reader", type: "address" },
    ],
    name: "MessageRead",
    type: "event",
  },
] as const;

export const MESSAGING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MESSAGING_CONTRACT_ADDRESS || "";
