"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between">
      <header className="px-8 py-6 border-b flex justify-between items-center">
        <h1 className="text-4xl font-bold">Decentralized Voting Simulation 2025</h1>
        <ConnectButton />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <p className="max-w-xl mb-6">
          Participate in a simulation of the 2025 Philippine elections. Choose up to 12 senators and 1 party-list.  
          Your vote will be recorded on the blockchain (simulation).
        </p>
        <Link
          href="/ballot"
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
        >
          Get Started
        </Link>
      </main>

      <section className="py-12 bg-gray-50 text-black text-center">
        <h2 className="text-2xl font-semibold mb-4">Live Candidate Count</h2>
        <p>Live counts will appear here (simulated or fetched from blockchain)</p>
      </section>
    </div>
  );
}
