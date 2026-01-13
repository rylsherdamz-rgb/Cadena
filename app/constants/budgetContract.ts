export const BUDGET_CONTRACT_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "_initialBudget", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "totalBudget",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "allocatedBudget",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "disbursedBudget",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "spentBudget",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "enum NationalBudgetTracker.BudgetCategory", name: "_category", type: "uint8" },
      { internalType: "string", name: "_projectName", type: "string" },
      { internalType: "string", name: "_description", type: "string" },
      { internalType: "address", name: "_projectLead", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "uint256", name: "_targetCompletionDate", type: "uint256" },
      { internalType: "string", name: "_documentHash", type: "string" },
    ],
    name: "createAllocation",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_allocationId", type: "uint256" }],
    name: "approveAllocation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_allocationId", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "disburseAllocation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_allocationId", type: "uint256" },
      { internalType: "address", name: "_vendor", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "string", name: "_description", type: "string" },
      { internalType: "string", name: "_receiptHash", type: "string" },
    ],
    name: "recordExpense",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_allocationId", type: "uint256" }],
    name: "getAllocation",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "allocationId", type: "uint256" },
          { internalType: "enum NationalBudgetTracker.BudgetCategory", name: "category", type: "uint8" },
          { internalType: "string", name: "projectName", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "address", name: "projectLead", type: "address" },
          { internalType: "uint256", name: "allocatedAmount", type: "uint256" },
          { internalType: "uint256", name: "disbursedAmount", type: "uint256" },
          { internalType: "uint256", name: "spentAmount", type: "uint256" },
          { internalType: "enum NationalBudgetTracker.AllocationStatus", name: "status", type: "uint8" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "uint256", name: "approvedAt", type: "uint256" },
          { internalType: "uint256", name: "targetCompletionDate", type: "uint256" },
          { internalType: "string", name: "documentHash", type: "string" },
          { internalType: "bool", name: "isActive", type: "bool" },
        ],
        internalType: "struct NationalBudgetTracker.BudgetAllocation",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBudgetStatus",
    outputs: [
      { internalType: "uint256", name: "total", type: "uint256" },
      { internalType: "uint256", name: "allocated", type: "uint256" },
      { internalType: "uint256", name: "disbursed", type: "uint256" },
      { internalType: "uint256", name: "spent", type: "uint256" },
      { internalType: "uint256", name: "available", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "uint256", name: "totalBudget", type: "uint256" }],
    name: "BudgetSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "allocationId", type: "uint256" },
      { indexed: false, internalType: "enum NationalBudgetTracker.BudgetCategory", name: "category", type: "uint8" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "AllocationCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "allocationId", type: "uint256" },
      { indexed: false, internalType: "address", name: "approver", type: "address" },
    ],
    name: "AllocationApproved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "allocationId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "AllocationDisbursed",
    type: "event",
  },
] as const;

export const BUDGET_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BUDGET_CONTRACT_ADDRESS || "";

export enum BudgetCategory {
  Healthcare = 0,
  Education = 1,
  Infrastructure = 2,
  PublicWorks = 3,
  Defense = 4,
  Agriculture = 5,
  SocialWelfare = 6,
  Environment = 7,
  Tourism = 8,
  Other = 9,
}

export enum AllocationStatus {
  Proposed = 0,
  Approved = 1,
  Disbursed = 2,
  Completed = 3,
  Disputed = 4,
}

export const CATEGORY_NAMES: Record<BudgetCategory, string> = {
  [BudgetCategory.Healthcare]: "🏥 Healthcare",
  [BudgetCategory.Education]: "🎓 Education",
  [BudgetCategory.Infrastructure]: "🏗️ Infrastructure",
  [BudgetCategory.PublicWorks]: "🛣️ Public Works",
  [BudgetCategory.Defense]: "🛡️ Defense",
  [BudgetCategory.Agriculture]: "🌾 Agriculture",
  [BudgetCategory.SocialWelfare]: "👥 Social Welfare",
  [BudgetCategory.Environment]: "🌱 Environment",
  [BudgetCategory.Tourism]: "✈️ Tourism",
  [BudgetCategory.Other]: "📋 Other",
};

export const STATUS_NAMES: Record<AllocationStatus, string> = {
  [AllocationStatus.Proposed]: "Proposed",
  [AllocationStatus.Approved]: "Approved",
  [AllocationStatus.Disbursed]: "Disbursed",
  [AllocationStatus.Completed]: "Completed",
  [AllocationStatus.Disputed]: "Disputed",
};
