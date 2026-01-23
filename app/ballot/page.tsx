'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {useRouter} from "next/navigation"
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


export default function BallotPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter()
  const { address, isConnected } = useAccount();
  const containerRef = useRef(null);

  const [selectedSenators, setSelectedSenators] = useState<number[]>([]);
  const [selectedParty, setSelectedParty] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        id: id,
        name: String(c[0]),
        party: String(c[1]),
        position: Number(c[2]),
      };
    }).filter(Boolean);
  }, [candidatesData]);

  const senators = candidates.filter((c) => c?.position === 2);
  const partyLists = candidates.filter((c) => c?.position === 3);

  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {

    if (mounted && !isLoading && candidates.length > 0) {
      gsap.fromTo(".ballot-item", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: "expo.out" }
      );
    }
    

  }, [mounted, isLoading, candidates.length, hasVoted], );

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
      <header className="border-b-4 border-black sticky top-0 bg-white/95 backdrop-blur-sm z-50 px-4 md:px-6 py-4 md:py-6">
        <div className="container mx-auto flex justify-end items-center gap-2">
          <div className="scale-75 md:scale-100 origin-right">
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 mt-8 md:mt-12">
        {hasVoted as boolean && (
          <div className="mb-8 md:mb-12 border-4 border-black p-4 md:p-8 bg-black text-white flex items-center gap-4 md:gap-6">
            <CheckCircle2 size={32} className="md:w-12 md:h-12 text-green-500 shrink-0" />
            <div>
              <p className="text-xl md:text-2xl font-black uppercase tracking-tighter">VOTE_RECORDED</p>
              <p className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.3em] opacity-60 uppercase">Your cryptographic proof is stored on the ledger.</p>
            </div>
          </div>
        )}

        <section className="mb-16 md:mb-24">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic underline decoration-4">Senators</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Provision up to 12 Nodes</p>
            </div>
            <div className="w-full md:w-auto px-6 py-2 bg-black text-white font-black text-sm uppercase italic text-center md:text-left">
              Selected: {selectedSenators.length} / 12
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {senators.map((c) => {
              const isActive = selectedSenators.includes(c!.id);
              return (
                <div
                  key={c!.id}
                  onClick={() => toggleSenator(c!.id)}
                  className={`ballot-item border-2 p-4 md:p-6 flex items-center gap-4 md:gap-6 cursor-pointer transition-all duration-200 ${
                    isActive 
                      ? 'bg-black text-white border-black md:scale-[1.02] shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)]' 
                      : 'bg-white border-gray-100 hover:border-black'
                  } ${hasVoted ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 overflow-hidden border-2 border-black/10 shrink-0">
                    <img
    src={`/candidateImages/${c!.name
  .trim()
  .toUpperCase()
  .replace(/\s+/g, "-")}.webp`}
                      alt=""
                      className={`w-full h-full object-cover ${isActive ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`}
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=CANDIDATE'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-black uppercase tracking-tight leading-none mb-1 truncate">{c!.name}</p>
                    <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{c!.party}</p>
                  </div>
                  {isActive && <CheckCircle2 size={18} className="md:w-5 md:h-5 text-white shrink-0" />}
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-16 md:mb-20">
          <div className="mb-8 md:mb-10">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic underline decoration-4">Party-List</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Single Identity Selection</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {partyLists.map((c) => {
              const isActive = selectedParty === c!.id;
              return (
                <div
                  key={c!.id}
                  onClick={() => !hasVoted && setSelectedParty(c!.id)}
                  className={`ballot-item border-2 md:border-4 p-4 md:p-8 flex flex-col items-center text-center gap-3 md:gap-4 cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? 'bg-black text-white border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]' 
                      : 'bg-white border-gray-100 hover:border-black'
                  } ${hasVoted ? 'opacity-30 grayscale' : ''}`}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 flex items-center justify-center p-2 rounded shrink-0">
                    <img
                      src={`/images/partylist/${c!.id}.png`}
                      alt={c!.name}
                      className={`max-w-full max-h-full object-contain ${isActive ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`}
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100?text=LOGO'; }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-[11px] font-black uppercase tracking-tight leading-tight mb-1">{c!.name}</p>
                    <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">{c!.party}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {!hasVoted && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t-4 border-black p-4 md:p-6 z-[60] shadow-[0px_-10px_30px_rgba(0,0,0,0.05)]">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="flex justify-between w-full md:w-auto md:gap-12">
               <div>
                  <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase mb-1">Senator Quota</p>
                  <p className="text-base md:text-xl font-black italic">{selectedSenators.length} / 12</p>
               </div>
               <div>
                  <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase mb-1">Party-List Status</p>
                  <p className={`text-base md:text-xl font-black italic ${selectedParty !== null ? 'text-black' : 'text-red-500'}`}>
                    {selectedParty !== null ? 'VALIDATED' : 'NULL'}
                  </p>
               </div>
            </div>
            <button
              onClick={submitVote}
              disabled={isConfirming || !selectedParty || selectedSenators.length === 0}
              className="w-full md:w-auto px-6 md:px-20 py-4 md:py-5 bg-black text-white font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-xs md:text-sm hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-300 transition-all active:scale-95 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]"
            >
              {isConfirming ? 'Finalizing Consensus...' : 'Sign and Submit Ballot'}
            </button>
          </div>
        </div>
      )}

      <footer className="mt-20 md:mt-32 border-t border-gray-100 py-12 md:py-20 text-center px-4">
         <div className="flex justify-center gap-6 md:gap-10 mb-6 opacity-20">
            <ShieldCheck size={20}  />
            <Info size={20} size={24} />
         </div>
         <p className="text-[8px] md:text-[9px] font-mono text-gray-300 uppercase tracking-widest mb-2">Protocol: ELECTION_v1.0.4</p>
         <p className="text-[8px] md:text-[9px] font-mono text-gray-300 uppercase tracking-widest italic break-all">{ElectionContractAddress}</p>
      </footer>
    </div>
  );
}
