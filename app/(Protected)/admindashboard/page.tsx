"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useAddCandidate } from "@/utils/useElectionContract"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AdminDashBoard() {
  const { isConnected, address } = useAccount()
  const [candidateName, setCandidateName] = useState("")
  const [candidateParty, setCandidateParty] = useState("")
  const { addCandidate, isPending } = useAddCandidate()
  const [submittedCandidates, setSubmittedCandidates] = useState<Array<{ name: string; party: string }>>([])

  const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault()

    if (!candidateName.trim() || !candidateParty.trim()) {
      alert("Please enter both name and party")
      return
    }

    addCandidate(candidateName, candidateParty)
    
    // Add to submitted list for UI feedback
    setSubmittedCandidates([...submittedCandidates, { name: candidateName, party: candidateParty }])
    
    // Clear form
    setCandidateName("")
    setCandidateParty("")
  }

  if (!isConnected) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600 mb-6">Please connect your wallet to access the admin dashboard</p>
          <Link href="/cadena" className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition">
            Back to Voting
          </Link>
        </div>
      </div>
    )
  }

  const isAdmin = !ADMIN_ADDRESS || address?.toLowerCase() === ADMIN_ADDRESS?.toLowerCase()

  if (!isAdmin) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-2">Your wallet is not authorized as admin</p>
          <p className="text-gray-500 text-sm mb-6">Current: {address}</p>
          <Link href="/cadena" className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition">
            Back to Voting
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/cadena">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition">
                <ArrowLeft size={20} />
                Back
              </button>
            </Link>
            <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-semibold">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
          </div>
        </div>

        {/* Add Candidate Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Plus size={24} />
            Add New Candidate
          </h2>

          <form onSubmit={handleAddCandidate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Candidate Name</label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="e.g., John Smith"
                  disabled={isPending}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Political Party</label>
                <input
                  type="text"
                  value={candidateParty}
                  onChange={(e) => setCandidateParty(e.target.value)}
                  placeholder="e.g., Democratic Party"
                  disabled={isPending}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                isPending
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600 active:scale-95"
              }`}
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding Candidate...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Add Candidate
                </>
              )}
            </button>
          </form>
        </div>

        {/* Recently Added Candidates */}
        {submittedCandidates.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recently Added Candidates</h2>
            <div className="space-y-4">
              {submittedCandidates.map((candidate, index) => (
                <div key={index} className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{candidate.name}</p>
                      <p className="text-gray-600 text-sm">{candidate.party}</p>
                    </div>
                    <div className="text-green-600 font-semibold">✓ Submitted</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}