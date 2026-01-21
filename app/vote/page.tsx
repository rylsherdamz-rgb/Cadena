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

  const { data: countData } = useReadContract({
    address: ElectionContractAddress,
    abi: ELECTION_ABI,
    functionName: 'getCandidatesCount',
  });

  const count = Number(countData ?? 0);

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

  const senators = candidates.filter((c: any) => c.position === 2);
  const partylists = candidates.filter((c: any) => c.position === 3);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-x-hidden">
      <header className="px-4 md:px-8 py-6 md:py-8 border-b-4 border-black sticky top-0 bg-white/90 backdrop-blur-md z-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-auto flex justify-end">
          <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon" />
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12 md:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="flex-1 space-y-6 md:space-y-8 text-left">
          <div className="inline-block px-3 py-1 bg-black text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">
            Permissionless_Voting_Protocol
          </div>
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic">
            Your Vote, <br />
            <span className="text-gray-300 underline decoration-black decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8">On-Chain.</span>
          </h2>
          <p className="max-w-lg font-bold text-gray-500 uppercase tracking-widest text-[10px] md:text-xs leading-relaxed">
            Participate in the decentralized simulation of the 2025 Philippine Elections. 
            Cryptographically secured by blockchain technology. 12 Senators. 1 Party-List.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/ballot"
              className="group bg-black text-white px-6 md:px-10 py-4 md:py-5 font-black uppercase text-xs md:text-sm tracking-widest hover:bg-white hover:text-black border-4 border-black transition-all flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none active:translate-x-1 active:translate-y-1"
            >
              Enter Ballot Node <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            {!isConnected && (
              <div className="flex items-center justify-center gap-3 px-6 py-4 border-4 border-gray-100 italic font-black text-[10px] md:text-xs uppercase text-gray-400 text-center">
                <Zap size={14} /> Connection Required
              </div>
            )}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
          <div className="border-4 border-black p-6 md:p-8 space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <Globe size={28} className="md:w-8 md:h-8" />
            <p className="text-xl md:text-2xl font-black uppercase italic">Immutable</p>
            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase">Records cannot be altered once stored on the ledger.</p>
          </div>
          <div className="border-4 border-black p-6 md:p-8 space-y-4 sm:mt-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <ShieldCheck size={28} className="md:w-8 md:h-8" />
            <p className="text-xl md:text-2xl font-black uppercase italic">Verified</p>
            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase">Every vote is signed by a unique cryptographic key.</p>
          </div>
        </div>
      </main>

      <section className="py-16 md:py-24 bg-gray-50 border-t-4 border-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 md:mb-16 border-l-4 md:border-l-8 border-black pl-4 md:pl-8">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">Live_Vote</h2>
            <p className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.4em] mt-2">Real-time Node Status</p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center py-20">
              <Loader2 className="animate-spin mb-4" />
              <p className="font-black text-[10px] uppercase tracking-widest">Awaiting Block Confirmation...</p>
            </div>
          ) : (
            <>
              <div className="mb-16 md:mb-20">
                <h3 className="text-lg md:text-xl font-black uppercase italic mb-6 md:mb-8 flex items-center gap-2">
                  <span className="w-6 md:w-10 h-1 bg-black" /> Top_Senator_Nodes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {senators.slice(0, 8).map((c: any) => (
                    <div
                      key={c.id}
                      className="bg-white border-2 border-black p-4 md:p-5 hover:bg-black hover:text-white transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 border border-black overflow-hidden rounded-full shrink-0">
                          <img
  src={`/candidateImages/${c!.name
  .trim()
  .toUpperCase()
  .replace(/\s+/g, "-")}.webp`}
                            alt=""
                            className="w-full h-full object-cover "
                            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100?text=C'; }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] md:text-[11px] font-black uppercase leading-tight truncate">{c.name}</p>
                          <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">{c.party}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-black/5 flex justify-between items-baseline">
                        <span className="text-[8px] md:text-[9px] font-black uppercase opacity-40">Cumulative</span>
                        <span className="text-lg md:text-xl font-black italic">{c.voteCount.toString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Party-List Grid */}
              <div>
                <h3 className="text-lg md:text-xl font-black uppercase italic mb-6 md:mb-8 flex items-center gap-2">
                  <span className="w-6 md:w-10 h-1 bg-black" /> Party_List_Nodes
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                  {partylists.map((c: any) => (
                    <div
                      key={c.id}
                      className="border-2 border-black p-3 md:p-4 flex flex-col justify-between hover:invert transition-all bg-white min-h-[80px] md:min-h-[100px]"
                    >
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-tight leading-tight mb-4 break-words">{c.name}</p>
                      <div className="flex justify-between items-end">
                         <span className="text-[7px] md:text-[8px] font-bold opacity-30">VOTES</span>
                         <span className="text-base md:text-lg font-black italic">{c.voteCount.toString()}</span>
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
      <footer className="bg-black text-white py-10 md:py-12 px-6 md:px-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Cpu className="opacity-50 w-6 h-6" />
            <p className="text-[8px] md:text-[10px] font-mono opacity-50 uppercase tracking-widest">
              Built with Wagmi / RainbowKit / Next.js <br className="hidden md:block" />
              Secure Election Simulation Protocol v2.0
            </p>
          </div>
          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">© 2026 Decentralized_Ledger_Systems</p>
        </div>
      </footer>
    </div>
  );
}

export default dynamic(() => Promise.resolve(OnboardingPage), { ssr: false });
