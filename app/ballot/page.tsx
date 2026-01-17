'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { ElectionContractAddress, ELECTION_ABI } from '../../constants/ElectionContract';
import toast from 'react-hot-toast';
import { gsap } from 'gsap';
import { ShieldCheck, CheckCircle2, AlertCircle, Info, Cpu } from 'lucide-react';

function BallotPage() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const containerRef = useRef(null);

  // Voting State
  const [selectedSenators, setSelectedSenators] = useState<number[]>([]);
  const [selectedParty, setSelectedParty] = useState<number | null>(null);

  // 1. Prevents Hydration Mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------------- BLOCKCHAIN READS ---------------- */
  const { data: hasVoted } = useReadContract({
    address: ElectionContractAddress,
    abi: ELECTION_ABI,
    functionName: 'hasVoted',
    args: [address!],
    query: { enabled: !!address },
  });

  const { data: countData } = useReadContract({
    address: ElectionContractAddress,
    abi: ELECTION_ABI,
    functionName: 'getCandidatesCount',
  });

  const count = Number(countData ?? 0);

  const { data: candidatesData, isLoading } = useReadContracts({
    contracts: Array.from({ length: count }, (_, id) => ({
      address: ElectionContractAddress,
      abi: ELECTION_ABI,
      functionName: 'getCandidate',
      args: [id],
    })),
    query: { enabled: count > 0 },
  });

  const candidates = useMemo(() => {
    if (!candidatesData) return [];
    return candidatesData.map((r: any, id: number) => {
      const c = r.result;
      if (!c) return null;
      return {
        id: id, // Mapping the array index as the unique ID
        name: String(c[0]),
        party: String(c[1]),
        position: Number(c[2]),
      };
    }).filter(Boolean);
  }, [candidatesData]);

  const senators = candidates.filter((c) => c?.position === 2);
  const partyLists = candidates.filter((c) => c?.position === 3);

  /* ---------------- BLOCKCHAIN WRITES ---------------- */
  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // GSAP Animations
  useEffect(() => {
    if (mounted && !isLoading && candidates.length > 0) {
      gsap.fromTo(".ballot-item", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: "expo.out" }
      );
    }
  }, [mounted, isLoading, candidates.length]);

  const toggleSenator = (id: number) => {
    if (hasVoted) return;
    setSelectedSenators((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 12 ? [...prev, id] : prev
    );
  };

  const submitVote = async () => {
    if (!isConnected) return toast.error('Connect wallet first');
    if (hasVoted) return toast.error('Account already registered a vote');
    if (!selectedParty) return toast.error('Select a Party-List');
    if (selectedSenators.length === 0) return toast.error('Select at least 1 Senator');

    try {
      writeContract({
        address: ElectionContractAddress,
        abi: ELECTION_ABI,
        functionName: 'voteBatch',
        args: [selectedSenators, selectedParty],
      });
    } catch (err: any) {
      toast.error(err?.shortMessage || 'Transaction failed');
    }
  };

  if (!mounted) return null;

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black font-sans pb-40">
      {/* HEADER */}
      <header className="border-b-4 border-black sticky top-0 bg-white/95 backdrop-blur-sm z-50 px-6 py-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <Cpu size={24} className="animate-spin [animation-duration:3s]" />
             <h1 className="text-xl font-black uppercase tracking-tighter italic">Consensus_Ballot_v2.1</h1>
          </div>
          <ConnectButton />
        </div>
      </header>

      <main className="container mx-auto px-6 mt-12">
        {hasVoted && (
          <div className="mb-12 border-4 border-black p-8 bg-black text-white flex items-center gap-6">
            <CheckCircle2 size={48} className="text-green-500" />
            <div>
              <p className="text-2xl font-black uppercase tracking-tighter">VOTE_RECORDED</p>
              <p className="text-[10px] font-bold tracking-[0.3em] opacity-60">Your cryptographic proof is stored on the ledger.</p>
            </div>
          </div>
        )}

        {/* SENATORS */}
        <section className="mb-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-5xl font-black uppercase tracking-tighter italic underline decoration-4">Senators</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Provision up to 12 Nodes</p>
            </div>
            <div className="px-6 py-2 bg-black text-white font-black text-sm uppercase italic">
              Selected: {selectedSenators.length} / 12
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {senators.map((c) => {
              const isActive = selectedSenators.includes(c!.id);
              return (
                <div
                  key={c!.id}
                  onClick={() => toggleSenator(c!.id)}
                  className={`ballot-item border-2 p-6 flex items-center gap-6 cursor-pointer transition-all duration-200 ${
                    isActive 
                      ? 'bg-black text-white border-black scale-[1.02] shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)]' 
                      : 'bg-white border-gray-100 hover:border-black'
                  } ${hasVoted ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
                >
                  <div className="w-16 h-16 bg-gray-100 overflow-hidden border-2 border-black/10">
                    <img
                      src={`/candidateImages/${c!.name.toUpperCase().replace(/ /g, "-")}.webp`}
                      alt=""
                      className={`w-full h-full object-cover ${isActive ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`}
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=CANDIDATE'; }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black uppercase tracking-tight leading-none mb-1">{c!.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{c!.party}</p>
                  </div>
                  {isActive && <CheckCircle2 size={20} className="text-white" />}
                </div>
              );
            })}
          </div>
        </section>

        {/* PARTY-LIST */}
        <section className="mb-20">
          <div className="mb-10">
            <h2 className="text-5xl font-black uppercase tracking-tighter italic underline decoration-4">Party-List</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Single Identity Selection</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {partyLists.map((c) => {
              const isActive = selectedParty === c!.id;
              return (
                <div
                  key={c!.id}
                  onClick={() => !hasVoted && setSelectedParty(c!.id)}
                  className={`ballot-item border-4 p-8 flex flex-col items-center text-center gap-4 cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? 'bg-black text-white border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]' 
                      : 'bg-white border-gray-100 hover:border-black'
                  } ${hasVoted ? 'opacity-30 grayscale' : ''}`}
                >
                  <div className="w-20 h-20 bg-gray-50 flex items-center justify-center p-2 rounded">
                    <img
                      src={`/images/partylist/${c!.id}.png`}
                      alt={c!.name}
                      className={`max-w-full max-h-full object-contain ${isActive ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`}
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100?text=LOGO'; }}
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-tight leading-tight">{c!.name}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">{c!.party}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* FLOATING ACTION BAR */}
      {!hasVoted && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t-4 border-black p-6 z-[60] shadow-[0px_-10px_30px_rgba(0,0,0,0.05)]">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex gap-12">
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Senator Quota</p>
                  <p className="text-xl font-black italic">{selectedSenators.length} / 12</p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Party-List Status</p>
                  <p className={`text-xl font-black italic ${selectedParty !== null ? 'text-black' : 'text-red-500'}`}>
                    {selectedParty !== null ? 'VALIDATED' : 'NULL'}
                  </p>
               </div>
            </div>
            <button
              onClick={submitVote}
              disabled={isConfirming || !selectedParty || selectedSenators.length === 0}
              className="w-full md:w-auto px-20 py-5 bg-black text-white font-black uppercase tracking-[0.4em] text-sm hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-300 transition-all active:scale-95 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.2)]"
            >
              {isConfirming ? 'Finalizing Consensus...' : 'Sign and Submit Ballot'}
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-32 border-t border-gray-100 py-20 text-center">
         <div className="flex justify-center gap-10 mb-6 opacity-20">
            <ShieldCheck size={24} />
            <Info size={24} />
         </div>
         <p className="text-[9px] font-mono text-gray-300 uppercase tracking-widest mb-2">Protocol: ELECTION_v1.0.4</p>
         <p className="text-[9px] font-mono text-gray-300 uppercase tracking-widest italic">{ElectionContractAddress}</p>
      </footer>
    </div>
  );
}

export default dynamic(() => Promise.resolve(BallotPage), { ssr: false });