"use client"

import { useReadContract, useWriteContract } from "wagmi"
import { BUDGET_CONTRACT_ABI, BUDGET_CONTRACT_ADDRESS } from "@/app/constants/budgetContract"

export function useBudgetContract() {
  const { writeContract, isPending } = useWriteContract()

  const createAllocation = (
    category: number,
    projectName: string,
    description: string,
    projectLead: string,
    amount: bigint,
    targetDate: number,
    docHash: string
  ) => {
    return writeContract({
      address: (BUDGET_CONTRACT_ADDRESS as `0x${string}`) || undefined,
      abi: BUDGET_CONTRACT_ABI,
      functionName: "createAllocation",
      args: [category, projectName, description, projectLead as `0x${string}`, amount, targetDate, docHash],
    })
  }

  const approveAllocation = (allocationId: number) => {
    return writeContract({
      address: (BUDGET_CONTRACT_ADDRESS as `0x${string}`) || undefined,
      abi: BUDGET_CONTRACT_ABI,
      functionName: "approveAllocation",
      args: [BigInt(allocationId)],
    })
  }

  const disburseAllocation = (allocationId: number, amount: bigint) => {
    return writeContract({
      address: (BUDGET_CONTRACT_ADDRESS as `0x${string}`) || undefined,
      abi: BUDGET_CONTRACT_ABI,
      functionName: "disburseAllocation",
      args: [BigInt(allocationId), amount],
    })
  }

  const recordExpense = (
    allocationId: number,
    vendor: string,
    amount: bigint,
    description: string,
    receiptHash: string
  ) => {
    return writeContract({
      address: (BUDGET_CONTRACT_ADDRESS as `0x${string}`) || undefined,
      abi: BUDGET_CONTRACT_ABI,
      functionName: "recordExpense",
      args: [BigInt(allocationId), vendor as `0x${string}`, amount, description, receiptHash],
    })
  }

  return {
    createAllocation,
    approveAllocation,
    disburseAllocation,
    recordExpense,
    isPending,
  }
}

export function useBudgetStatus() {
  const { data: status, isLoading } = useReadContract({
    address: (BUDGET_CONTRACT_ADDRESS as `0x${string}`) || undefined,
    abi: BUDGET_CONTRACT_ABI,
    functionName: "getBudgetStatus",
  })

  return {
    total: status ? status[0] : 0n,
    allocated: status ? status[1] : 0n,
    disbursed: status ? status[2] : 0n,
    spent: status ? status[3] : 0n,
    available: status ? status[4] : 0n,
    isLoading,
  }
}

export function useAllocation(allocationId: number) {
  const { data: allocation, isLoading } = useReadContract({
    address: (BUDGET_CONTRACT_ADDRESS as `0x${string}`) || undefined,
    abi: BUDGET_CONTRACT_ABI,
    functionName: "getAllocation",
    args: [BigInt(allocationId)],
    query: { enabled: allocationId > 0 },
  })

  return { allocation, isLoading }
}
