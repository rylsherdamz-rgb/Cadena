export const RPS_CONTRACT_ABI = [
  {
    inputs: [],
    name: "nextGameId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "platformFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "enum RockPaperScissors.GameType", name: "_gameType", type: "uint8" }],
    name: "createGame",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_gameId", type: "uint256" }],
    name: "joinGame",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_gameId", type: "uint256" },
      { internalType: "enum RockPaperScissors.Choice", name: "_choice", type: "uint8" },
    ],
    name: "submitMove",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_gameId", type: "uint256" }],
    name: "getGame",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "gameId", type: "uint256" },
          { internalType: "address[2]", name: "players", type: "address[2]" },
          { internalType: "uint256", name: "stake", type: "uint256" },
          { internalType: "enum RockPaperScissors.GameType", name: "gameType", type: "uint8" },
          { internalType: "uint8", name: "roundsPlayed", type: "uint8" },
          { internalType: "uint8[2]", name: "scores", type: "uint8[2]" },
          { internalType: "bool", name: "isActive", type: "bool" },
          { internalType: "address", name: "winner", type: "address" },
          { internalType: "uint256", name: "totalPot", type: "uint256" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
        ],
        internalType: "struct RockPaperScissors.Game",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_player", type: "address" }],
    name: "getPlayerGames",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "gameId", type: "uint256" },
      { indexed: true, internalType: "address", name: "player1", type: "address" },
      { indexed: false, internalType: "uint256", name: "stake", type: "uint256" },
      { indexed: false, internalType: "enum RockPaperScissors.GameType", name: "gameType", type: "uint8" },
    ],
    name: "GameCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "gameId", type: "uint256" },
      { indexed: true, internalType: "address", name: "player2", type: "address" },
    ],
    name: "GameJoined",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "gameId", type: "uint256" },
      { indexed: true, internalType: "address", name: "winner", type: "address" },
      { indexed: false, internalType: "uint256", name: "payout", type: "uint256" },
    ],
    name: "GameFinished",
    type: "event",
  },
] as const;

export const RPS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_RPS_CONTRACT_ADDRESS || "";

export enum RPSGameType {
  OneRound = 0,
  BestOfThree = 1,
  BestOfFive = 2,
}

export enum RPSChoice {
  None = 0,
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}

export const CHOICE_NAMES: Record<RPSChoice, string> = {
  [RPSChoice.None]: "None",
  [RPSChoice.Rock]: "🪨 Rock",
  [RPSChoice.Paper]: "📄 Paper",
  [RPSChoice.Scissors]: "✂️ Scissors",
};
