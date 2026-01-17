'use client';

import { useMemo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useReadContract, useReadContracts, useAccount } from 'wagmi';
import { ElectionContractAddress, ELECTION_ABI } from '../../constants/ElectionContract';
import { ChevronRight, Cpu, Globe, ShieldCheck, Zap, Loader2 } from 'lucide-react';

function OnboardingPage() {
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------------- FETCH TOTAL CANDIDATES ---------------- */
  const { data: countData } = useReadContract({
    address: ElectionContractAddress,
    abi: ELECTION_ABI,
    functionName: 'getCandidatesCount',
  });

  const count = Number(countData ?? 0);

  /* ---------------- FETCH ALL CANDIDATES ---------------- */
  const { data: candidatesRaw, isLoading } = useReadContracts({
    contracts: Array.from({ length: count }, (_, id) => ({
      address: ElectionContractAddress,
      abi: ELECTION_ABI,
      functionName: 'getCandidate',
      args: [id],
    })),
    query: { enabled: count > 0 },
  });

  const candidates = useMemo(() => {
    if (!candidatesRaw) return [];
    return candidatesRaw.map((res: any, id: number) => {
      const c = res.result;
      if (!c) return null;
      return {
        id,
        name: String(c[0]),
        party: String(c[1]),
        position: Number(c[2]),
        voteCount: BigInt(c[3] ?? 0),
      };
    }).filter(Boolean);
  }, [candidatesRaw]);

  /* ---------------- FILTER BY POSITION ---------------- */
  const senators = candidates.filter((c: any) => c.position === 2);
  const partylists = candidates.filter((c: any) => c.position === 3);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* ---------------- HEADER ---------------- */}
      <header className="px-8 py-8 border-b-4 border-black sticky top-0 bg-white/90 backdrop-blur-md z-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Cpu className="w-8 h-8" />
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none">
            Consensus <br /> <span className="text-gray-400">2025_Simulation</span>
          </h1>
        </div>
        <ConnectButton showBalance={false} />
      </header>

      {/* ---------------- HERO SECTION ---------------- */}
      <main className="container mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <div className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em]">
            Permissionless_Voting_Protocol
          </div>
          <h2 className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic">
            Your Vote, <br />
            <span className="text-gray-300 underline decoration-black decoration-8 underline-offset-8">On-Chain.</span>
          </h2>
          <p className="max-w-lg font-bold text-gray-500 uppercase tracking-widest text-xs leading-relaxed">
            Participate in the decentralized simulation of the 2025 Philippine Elections. 
            Cryptographically secured by blockchain technology. 12 Senators. 1 Party-List.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/ballot"
              className="group bg-black text-white px-10 py-5 font-black uppercase text-sm tracking-widest hover:bg-white hover:text-black border-4 border-black transition-all flex items-center justify-center gap-3 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none active:translate-x-1 active:translate-y-1"
            >
              Enter Ballot Node <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            {!isConnected && (
              <div className="flex items-center gap-3 px-6 py-4 border-4 border-gray-100 italic font-black text-xs uppercase text-gray-400">
                <Zap size={16} /> Wallet Connection Required
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="border-4 border-black p-8 space-y-4 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <Globe size={32} />
            <p className="text-2xl font-black uppercase italic">Immutable</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Records cannot be altered once stored on the ledger.</p>
          </div>
          <div className="border-4 border-black p-8 space-y-4 mt-8">
            <ShieldCheck size={32} />
            <p className="text-2xl font-black uppercase italic">Verified</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Every vote is signed by a unique cryptographic key.</p>
          </div>
        </div>
      </main>

      {/* ---------------- LIVE CANDIDATE COUNT ---------------- */}
      <section className="py-24 bg-gray-50 border-t-4 border-black">
        <div className="container mx-auto px-6">
          <div className="mb-16 border-l-8 border-black pl-8">
            <h2 className="text-5xl font-black uppercase tracking-tighter italic">Live_Aggregation</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.4em] mt-2">Real-time Node Status</p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center py-20">
              <Loader2 className="animate-spin mb-4" />
              <p className="font-black text-[10px] uppercase tracking-widest">Awaiting Block Confirmation...</p>
            </div>
          ) : (
            <>
              {/* Senators Grid */}
              <div className="mb-20">
                <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-2">
                  <span className="w-10 h-1 bg-black" /> Top_Senator_Nodes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {senators.slice(0, 8).map((c: any) => (
                    <div
                      key={c.id}
                      className="bg-white border-2 border-black p-5 hover:bg-black hover:text-white transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 border border-black overflow-hidden rounded-full">
                          <img
                            src={`/candidateImages/${c.name.toUpperCase().replace(/ /g, "-")}.webp`}
                            alt=""
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100?text=C'; }}
                          />
                        </div>
                        <div>
                          <p className="text-[11px] font-black uppercase leading-tight">{c.name}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{c.party}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-black/5 flex justify-between items-baseline">
                        <span className="text-[9px] font-black uppercase opacity-40">Cumulative_Votes</span>
                        <span className="text-xl font-black italic">{c.voteCount.toString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Party-List Grid */}
              <div>
                <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-2">
                  <span className="w-10 h-1 bg-black" /> Party_List_Nodes
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {partylists.map((c: any) => (
                    <div
                      key={c.id}
                      className="border-2 border-black p-4 flex flex-col justify-between hover:invert transition-all bg-white"
                    >
                      <p className="text-[10px] font-black uppercase tracking-tight leading-tight mb-4">{c.name}</p>
                      <div className="flex justify-between items-end">
                         <span className="text-[8px] font-bold opacity-30">VOTES</span>
                         <span className="text-lg font-black italic">{c.voteCount.toString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="bg-black text-white py-12 px-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <Cpu className="opacity-50" />
            <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">
              Built with Wagmi / RainbowKit / Next.js <br />
              Secure Election Simulation Protocol v2.0
            </p>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest">© 2026 Decentralized_Ledger_Systems</p>
        </div>
      </footer>
    </div>
  );
}

export default dynamic(() => Promise.resolve(OnboardingPage), { ssr: false });