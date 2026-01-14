"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract } from "wagmi"
import { useVote } from "@/utils/useElectionContract"
import { ELECTION_CONTRACT_ABI, ELECTION_CONTRACT_ADDRESS } from "@/app/constants/electionContract"
import { CheckCircle, Loader } from "lucide-react"

interface VotingComponentProps {
  contractAddress?: string
}

export default function VotingComponent({ contractAddress = ELECTION_CONTRACT_ADDRESS }: VotingComponentProps) {
  const { isConnected, address } = useAccount()
  const [candidates, setCandidates] = useState<Array<{ id: number; name: string; party: string; voteCount: number }>>([])
  const [loading, setLoading] = useState(true)
  const [voted, setVoted] = useState(false)
  const { vote, isPending } = useVote()

  const { data: candidatesCount } = useReadContract({
    address: (contractAddress as `0x${string}`) || undefined,
    abi: ELECTION_CONTRACT_ABI,
    functionName: "candidatesCount",
  })

  const { data: hasVotedData } = useReadContract({
    address: (contractAddress as `0x${string}`) || undefined,
    abi: ELECTION_CONTRACT_ABI,
    functionName: "hasVoted",
    args: [address || "0x0"],
    query: { enabled: !!address },
  })

  // Fetch candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!candidatesCount) return

      setLoading(true)
      const fetchedCandidates = []

      for (let i = 0; i < Number(candidatesCount); i++) {
        try {
          // Mock data for demonstration
          // In production, you would fetch from the contract
          fetchedCandidates.push({
            id: i,
            name: `Candidate ${i + 1}`,
            party: `Party ${String.fromCharCode(65 + i)}`,
            voteCount: Math.floor(Math.random() * 100),
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

  useEffect(() => {
    setVoted(Boolean(hasVotedData))
  }, [hasVotedData])

  if (!isConnected) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-yellow-50 rounded-xl p-8">
        <div className="text-center">
          <p className="text-gray-700 font-semibold mb-2">Wallet Not Connected</p>
          <p className="text-gray-600 text-sm">Please connect your wallet to participate in voting</p>
        </div>
      </div>
    )
  }

  if (!contractAddress) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-xl p-8">
        <div className="text-center">
          <p className="text-red-700 font-semibold mb-2">Contract Not Configured</p>
          <p className="text-red-600 text-sm">Please set the NEXT_PUBLIC_ELECTION_CONTRACT_ADDRESS environment variable</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader className="animate-spin text-blue-500" size={32} />
      </div>
    )
  }

  if (candidates.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-blue-50 rounded-xl p-8">
        <div className="text-center">
          <p className="text-gray-700 font-semibold mb-2">No Candidates Yet</p>
          <p className="text-gray-600 text-sm">Candidates will appear here once they are added by the admin</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Election Voting</h2>
        {voted && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle size={20} />
            <span className="font-semibold">Vote Cast</span>
          </div>
        )}
      </div>

      {voted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
          You have already voted in this election
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-all"
          >
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800">{candidate.name}</h3>
              <p className="text-gray-600 text-sm mb-2">Party: {candidate.party}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">{candidate.voteCount}</span>
                <span className="text-gray-500 text-xs">votes</span>
              </div>
            </div>

            <button
              onClick={() => vote(candidate.id)}
              disabled={voted || isPending}
              className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                voted || isPending
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600 active:scale-95"
              }`}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader size={16} className="animate-spin" />
                  Voting...
                </span>
              ) : voted ? (
                "Already Voted"
              ) : (
                "Vote"
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
