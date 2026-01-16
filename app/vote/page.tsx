'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useReadContract, useReadContracts } from 'wagmi';
import { ElectionContractAddress, ELECTION_ABI } from '../../constants/ElectionContract';

type Candidate = {
  id: number;
  name: string;
  party: string;
  position: number; // 2 = Senator, 3 = Partylist
  voteCount: bigint;
};

export default function OnboardingPage() {
  /* ---------------- FETCH TOTAL CANDIDATES ---------------- */
  const { data: countData } = useReadContract({
    address: ElectionContractAddress,
    abi: ELECTION_ABI,
    functionName: 'getCandidatesCount',
    watch: true,
  });

  const count = Number(countData ?? 0);

  /* ---------------- FETCH ALL CANDIDATES ---------------- */
  const { data: candidatesRaw } = useReadContracts({
    contracts: Array.from({ length: count }, (_, id) => ({
      address: ElectionContractAddress,
      abi: ELECTION_ABI,
      functionName: 'getCandidate',
      args: [id],
    })),
    watch: true,
    query: { enabled: count > 0 },
  });

  const candidates: Candidate[] = useMemo(() => {
    if (!candidatesRaw) return [];
    return candidatesRaw.map((res: any, id: number) => {
      const c = res.result;
      return {
        id,
        name: c[0],
        party: c[1],
        position: Number(c[2]),
        voteCount: BigInt(c[3]),
      };
    });
  }, [candidatesRaw]);

  /* ---------------- FILTER BY POSITION ---------------- */
  const senators = candidates.filter((c) => c.position === 2);
  const partylists = candidates.filter((c) => c.position === 3);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between">
      {/* ---------------- HEADER ---------------- */}
      <header className="px-8 py-6 border-b flex justify-between items-center">
        <h1 className="text-4xl font-bold">Decentralized Voting Simulation 2025</h1>
        <ConnectButton />
      </header>

      {/* ---------------- MAIN CTA ---------------- */}
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

      {/* ---------------- LIVE CANDIDATE COUNT ---------------- */}
      <section className="py-12 bg-gray-50 text-black text-center">
        <h2 className="text-2xl font-semibold mb-6">Live Candidate Count</h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {/* Senators */}
          {senators.map((c) => (
            <div
              key={c.id}
              className="flex items-center space-x-3 p-4 border rounded shadow-sm hover:shadow-md transition"
            >
              <img
                src={`/candidateImages/${c.name.toUpperCase().replace(/ /g, "-")}.webp`}
                alt={c.name}
                className="w-16 h-16 object-cover rounded-full border"
              />
              <div className="text-left">
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-gray-600">{c.party}</p>
                <p className="mt-1 font-semibold">Votes: {c.voteCount.toString()}</p>
              </div>
            </div>
          ))}

          <p>Partylist</p>
          <div className="flex ">
          {partylists.map((c) => (
            <div
              key={c.id}
              className="flex items-center space-x-3 p-4 border rounded shadow-sm hover:shadow-md transition"
            >
              <div className="text-left">
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-gray-600">{c.party}</p>
                <p className="mt-1 font-semibold">Votes: {c.voteCount.toString()}</p>
              </div>
            </div>
          ))}
 
          </div>
          {/* Party-Lists */}
       </div>
      </section>
    </div>
  );
}
