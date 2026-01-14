"use client"

import { useReadContract, useWriteContract } from "wagmi"
import { MESSAGING_CONTRACT_ABI, MESSAGING_CONTRACT_ADDRESS } from "@/app/constants/messagingContract"

export function useMessagingContract() {
  const { writeContract, isPending } = useWriteContract()

  const sendMessage = (recipient: string, content: string) => {
    return writeContract({
      address: (MESSAGING_CONTRACT_ADDRESS as `0x${string}`) || undefined,
      abi: MESSAGING_CONTRACT_ABI,
      functionName: "sendMessage",
      args: [(recipient as `0x${string}`), content],
    })
  }

  const markAsRead = (messageId: number) => {
    return writeContract({
      address: (MESSAGING_CONTRACT_ADDRESS as `0x${string}`) || undefined,
      abi: MESSAGING_CONTRACT_ABI,
      functionName: "markAsRead",
      args: [BigInt(messageId)],
    })
  }

  return {
    sendMessage,
    markAsRead,
    isPending,
  }
}

export function useUserConversations(userAddress: string) {
  const { data: conversationIds, isLoading } = useReadContract({
    address: (MESSAGING_CONTRACT_ADDRESS as `0x${string}`) || undefined,
    abi: MESSAGING_CONTRACT_ABI,
    functionName: "getUserConversations",
    args: [(userAddress as `0x${string}`) || "0x0"],
    query: { enabled: !!userAddress },
  })

  return { conversationIds: conversationIds || [], isLoading }
}

export function useConversation(conversationId: number) {
  const { data: conversation, isLoading } = useReadContract({
    address: (MESSAGING_CONTRACT_ADDRESS as `0x${string}`) || undefined,
    abi: MESSAGING_CONTRACT_ABI,
    functionName: "getConversation",
    args: [BigInt(conversationId)],
    query: { enabled: conversationId > 0 },
  })

  return { conversation, isLoading }
}

export function useUnreadCount(userAddress: string) {
  const { data: unreadCount, isLoading } = useReadContract({
    address: (MESSAGING_CONTRACT_ADDRESS as `0x${string}`) || undefined,
    abi: MESSAGING_CONTRACT_ABI,
    functionName: "getUnreadCount",
    args: [(userAddress as `0x${string}`) || "0x0"],
    query: { enabled: !!userAddress },
  })

  return { unreadCount: unreadCount ? Number(unreadCount) : 0, isLoading }
}
