"use client"

import { useEffect, useState } from "react"
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { ELECTION_CONTRACT_ABI, ELECTION_CONTRACT_ADDRESS } from "@/app/constants/electionContract"

export interface Candidate {
  id: number
  name: string
  party: string
  voteCount: number
}

export function useElectionContract() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  // Read candidates count
  const { data: candidatesCount } = useReadContract({
    address: (ELECTION_CONTRACT_ADDRESS as `0x${string}`) || undefined,
    abi: ELECTION_CONTRACT_ABI,
    functionName: "candidatesCount",
  })

  // Fetch all candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!candidatesCount) return
      
      setLoading(true)
      const fetchedCandidates: Candidate[] = []
      
      for (let i = 0; i < Number(candidatesCount); i++) {
        try {
          // This would require individual calls - simplified for now
          fetchedCandidates.push({
            id: i,
            name: `Candidate ${i + 1}`,
            party: `Party ${i + 1}`,
            voteCount: 0,
          })
        } catch (error) {
          console.error(`Failed to fetch candidate ${i}:`, error)
        }
      }
      
      setCandidates(fetchedCandidates)
      setLoading(false)
    }

    fetchCandidates()
  }, [candidatesCount])

  return {
    candidates,
    loading,
    candidatesCount: Number(candidatesCount || 0),
  }
}

export function useVote() {
  const { writeContract, isPending } = useWriteContract()

  const vote = (candidateId: number) => {
    writeContract({
      address: (ELECTION_CONTRACT_ADDRESS as `0x${string}`) || undefined,
      abi: ELECTION_CONTRACT_ABI,
      functionName: "vote",
      args: [BigInt(candidateId)],
    })
  }

  return { vote, isPending }
}

export function useAddCandidate() {
  const { writeContract, isPending } = useWriteContract()

  const addCandidate = (name: string, party: string) => {
    writeContract({
      address: (ELECTION_CONTRACT_ADDRESS as `0x${string}`) || undefined,
      abi: ELECTION_CONTRACT_ABI,
      functionName: "addCandidate",
      args: [name, party],
    })
  }

  return { addCandidate, isPending }
}
