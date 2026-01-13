"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useBudgetContract, useBudgetStatus } from "@/utils/useMessagingContract"
import { CATEGORY_NAMES, STATUS_NAMES, BudgetCategory, AllocationStatus } from "@/app/constants/budgetContract"
import { BarChart3, TrendingUp, DollarSign, Loader } from "lucide-react"
import { formatEther } from "viem"

export default function BudgetDashboardComponent() {
  const { isConnected, address } = useAccount()
  const { createAllocation, approveAllocation, disburseAllocation, isPending } = useBudgetContract()
  const { total, allocated, disbursed, spent, available, isLoading } = useBudgetStatus()

  const [activeTab, setActiveTab] = useState<"overview" | "create" | "track">("overview")
  const [formData, setFormData] = useState({
    category: BudgetCategory.Healthcare,
    projectName: "",
    description: "",
    amount: "0",
    targetDate: "",
    docHash: "",
  })

  const handleCreateAllocation = async () => {
    if (!formData.projectName || !formData.amount) return

    try {
      const targetDate = Math.floor(new Date(formData.targetDate).getTime() / 1000)
      createAllocation(
        formData.category,
        formData.projectName,
        formData.description,
        address || "",
        BigInt(parseFloat(formData.amount) * 1e18),
        targetDate,
        formData.docHash
      )

      setFormData({
        category: BudgetCategory.Healthcare,
        projectName: "",
        description: "",
        amount: "0",
        targetDate: "",
        docHash: "",
      })
    } catch (error) {
      console.error("Failed to create allocation:", error)
    }
  }

  if (!isConnected) {
    return (
      <div className="w-full bg-blue-50 rounded-lg p-8 text-center">
        <p className="text-blue-800 font-semibold">Please connect your wallet to access the budget dashboard</p>
      </div>
    )
  }

  const allocationPercentage = total > 0n ? Number((allocated * 100n) / total) : 0
  const spentPercentage = disbursed > 0n ? Number((spent * 100n) / disbursed) : 0

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 size={32} className="text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-800">National Budget Tracker</h2>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <p className="text-sm text-gray-700">Total Budget</p>
          <p className="text-2xl font-bold text-blue-900">{isLoading ? "..." : formatEther(total)} ETH</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
          <p className="text-sm text-gray-700">Allocated</p>
          <p className="text-2xl font-bold text-yellow-900">{formatEther(allocated)} ETH</p>
          <p className="text-xs text-gray-600 mt-1">{allocationPercentage}% of total</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
          <p className="text-sm text-gray-700">Disbursed</p>
          <p className="text-2xl font-bold text-purple-900">{formatEther(disbursed)} ETH</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
          <p className="text-sm text-gray-700">Spent</p>
          <p className="text-2xl font-bold text-green-900">{formatEther(spent)} ETH</p>
          {disbursed > 0n && <p className="text-xs text-gray-600 mt-1">{spentPercentage}% of disbursed</p>}
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
          <p className="text-sm text-gray-700">Available</p>
          <p className="text-2xl font-bold text-orange-900">{formatEther(available)} ETH</p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4 mb-8">
        <div>
          <div className="flex justify-between mb-2">
            <p className="font-semibold text-gray-700">Budget Allocation Progress</p>
            <p className="text-sm text-gray-600">{allocationPercentage}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${allocationPercentage}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <p className="font-semibold text-gray-700">Spending Progress</p>
            <p className="text-sm text-gray-600">{spentPercentage}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-green-600 h-3 rounded-full" style={{ width: `${spentPercentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        {(["overview", "create", "track"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold capitalize transition-all ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab === "overview" && "Overview"}
            {tab === "create" && "Create Allocation"}
            {tab === "track" && "Track Spending"}
          </button>
        ))}
      </div>

      {/* Create Allocation Tab */}
      {activeTab === "create" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Budget Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: Number(e.target.value) as BudgetCategory })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {Object.entries(CATEGORY_NAMES).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
            <input
              type="text"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              placeholder="Enter project name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Project details"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Allocation Amount (ETH)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Target Completion Date</label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Documentation Hash (IPFS)</label>
            <input
              type="text"
              value={formData.docHash}
              onChange={(e) => setFormData({ ...formData, docHash: e.target.value })}
              placeholder="Qm..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            onClick={handleCreateAllocation}
            disabled={isPending || !formData.projectName}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader size={20} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <DollarSign size={20} />
                Create Allocation
              </>
            )}
          </button>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={20} /> Budget Health Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Allocation Rate</p>
                <p className="text-lg font-bold">{allocationPercentage.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-600">Spending Rate</p>
                <p className="text-lg font-bold">{spentPercentage.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-600">Utilization</p>
                <p className="text-lg font-bold text-green-600">Optimal</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="text-lg font-bold text-blue-600">Active</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              📊 <strong>Transparency Note:</strong> This budget system follows principles of full transparency and accountability, inspired by Bam Aquino's vision for public fund management. All allocations, expenditures, and audits are recorded on-chain for public verification.
            </p>
          </div>
        </div>
      )}

      {/* Track Tab */}
      {activeTab === "track" && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600 text-center py-8">Spending tracking features coming soon...</p>
        </div>
      )}
    </div>
  )
}
