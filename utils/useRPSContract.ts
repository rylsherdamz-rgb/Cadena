"use client"

import { useReadContract, useWriteContract } from "wagmi"
import { RPS_CONTRACT_ABI, RPS_CONTRACT_ADDRESS, RPSChoice, RPSGameType } from "@/app/constants/rpsContract"

export function useRPSContract() {
  const { writeContract, isPending } = useWriteContract()

  const createGame = (gameType: RPSGameType, amount: bigint) => {
    return writeContract({
      address: (RPS_CONTRACT_ADDRESS as `0x${string}`) || undefined,
      abi: RPS_CONTRACT_ABI,
      functionName: "createGame",
      args: [gameType],
      value: amount,
    })
  }

  const joinGame = (gameId: number, amount: bigint) => {
    return writeContract({
      address: (RPS_CONTRACT_ADDRESS as `0x${string}`) || undefined,
      abi: RPS_CONTRACT_ABI,
      functionName: "joinGame",
      args: [BigInt(gameId)],
      value: amount,
    })
  }

  const submitMove = (gameId: number, choice: RPSChoice) => {
    return writeContract({
      address: (RPS_CONTRACT_ADDRESS as `0x${string}`) || undefined,
      abi: RPS_CONTRACT_ABI,
      functionName: "submitMove",
      args: [BigInt(gameId), choice],
    })
  }

  return {
    createGame,
    joinGame,
    submitMove,
    isPending,
  }
}

export function useRPSGameDetails(gameId: number) {
  const { data: game, isLoading, error } = useReadContract({
    address: (RPS_CONTRACT_ADDRESS as `0x${string}`) || undefined,
    abi: RPS_CONTRACT_ABI,
    functionName: "getGame",
    args: [BigInt(gameId)],
    query: { enabled: gameId > 0 },
  })

  return { game, isLoading, error }
}

export function usePlayerGames(playerAddress: string) {
  const { data: gameIds, isLoading } = useReadContract({
    address: (RPS_CONTRACT_ADDRESS as `0x${string}`) || undefined,
    abi: RPS_CONTRACT_ABI,
    functionName: "getPlayerGames",
    args: [(playerAddress as `0x${string}`) || "0x0"],
    query: { enabled: !!playerAddress },
  })

  return { gameIds: gameIds || [], isLoading }
}
