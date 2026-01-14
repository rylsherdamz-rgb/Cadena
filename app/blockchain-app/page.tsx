"use client"

import { useState } from "react"
import VotingComponent from "@/components/VotingComponent"
import RockPaperScissorsComponent from "@/components/RockPaperScissorsComponent"
import MessagingComponent from "@/components/MessagingComponent"
import BudgetDashboardComponent from "@/components/BudgetDashboardComponent"

export default function BlockchainAppPage() {
  const [activeSection, setActiveSection] = useState<"voting" | "rps" | "messaging" | "budget">("voting")

  const sections: Array<{ id: "voting" | "rps" | "messaging" | "budget"; label: string; icon: string }> = [
    { id: "voting", label: "🗳️ Voting", icon: "🗳️" },
    { id: "rps", label: "🎮 Gaming", icon: "🎮" },
    { id: "messaging", label: "💬 Messaging", icon: "💬" },
    { id: "budget", label: "💰 Budget", icon: "💰" },
  ]

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Cadena Platform</h1>
          <p className="text-gray-600">Complete blockchain solution for voting, gaming, messaging, and budget transparency</p>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`py-4 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                activeSection === section.id
                  ? "bg-white text-blue-600 shadow-lg"
                  : "bg-white/70 text-gray-700 hover:bg-white"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="transition-all">
          {activeSection === "voting" && <VotingComponent />}
          {activeSection === "rps" && <RockPaperScissorsComponent />}
          {activeSection === "messaging" && <MessagingComponent />}
          {activeSection === "budget" && <BudgetDashboardComponent />}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">Cadena - Transparent Blockchain Solutions</p>
          <p className="text-sm">Inspired by principles of public transparency and accountability</p>
        </div>
      </div>
    </div>
  )
}
