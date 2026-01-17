'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
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
import { ShieldCheck, CheckCircle2, LayoutGrid } from 'lucide-react';

export default function BallotPage() {
  const { address, isConnected } = useAccount();
  const [selectedSenators, setSelectedSenators] = useState<number[]>([]);
  const [selectedParty, setSelectedParty] = useState<number | null>(null);
  const containerRef = useRef(null);

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
    return candidatesData
      .map((r: any, id: number) => {
        const c = r.result;
        if (!c) return null;
        return {
          id,
          name: c[0],
          party: c[1],
          position: Number(c[2]),
        };
      })
      .filter(Boolean);
  }, [candidatesData]);

  const senators = candidates.filter((c) => c?.position === 2);
  const partyLists = candidates.filter((c) => c?.position === 3);

  useEffect(() => {
    if (!isLoading && candidates.length > 0) {
      gsap.fromTo(".ballot-card", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.8, ease: "power4.out" }
      );
    }
  }, [isLoading, candidates.length]);

  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const submitVote = async () => {
    if (!isConnected) return toast.error('Connect wallet');
    if (hasVoted) return toast.error('Already voted');
    if (!selectedParty) return toast.error('Select a party-list');
    
    writeContract({
      address: ElectionContractAddress,
      abi: ELECTION_ABI,
      functionName: 'voteBatch',
      args: [selectedSenators, selectedParty],
    });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black pb-32">
      <header className="border-b-4 border-black sticky top-0 bg-white/90 backdrop-blur-md z-50 px-6 py-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black uppercase tracking-tighter">Decentralized Ballot</h1>
          <ConnectButton />
        </div>
      </header>

      <main className="container mx-auto px-6 mt-16">
        {/* Senators Section */}
        <section className="mb-24">
          <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-10">Senators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {senators.map((c) => (
              <label key={c!.id} className={`ballot-card border-2 p-6 flex items-center gap-4 cursor-pointer transition-all ${selectedSenators.includes(c!.id) ? 'bg-black text-white border-black' : 'border-gray-100 hover:border-black'}`}>
                <input type="checkbox" className="hidden" onChange={() => {
                  setSelectedSenators(prev => prev.includes(c!.id) ? prev.filter(x => x !== c!.id) : prev.length < 12 ? [...prev, c!.id] : prev);
                }} />
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                   <img src={`/candidateImages/${c!.name.toUpperCase().replace(/ /g, "-")}.webp`} alt="" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-bold uppercase">{c!.name}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Party-List Section */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-6xl font-black uppercase italic tracking-tighter">Party-List</h2>
            <div className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest">Select One</div>
          </div>
          
          {partyLists.length === 0 && !isLoading && (
            <div className="p-10 border-2 border-dashed border-gray-200 text-center uppercase font-bold text-gray-400">
              No Party-List Nodes Detected on Chain
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partyLists.map((c) => (
              <label
                key={c!.id}
                className={`ballot-card group border-4 p-8 flex flex-col items-center gap-6 cursor-pointer transition-all relative ${
                  selectedParty === c!.id ? 'bg-black text-white border-black' : 'bg-white border-gray-100 hover:border-black'
                }`}
              >
                <div className="w-24 h-24 flex items-center justify-center bg-gray-50 rounded-xl group-hover:bg-white transition-colors">
                  <img
                    src={`/images/partylist/${c!.id}.png`}
                    alt={c!.name}
                    className="max-w-[80%] max-h-[80%] object-contain grayscale group-hover:grayscale-0"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100?text=LOGO'; }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black uppercase tracking-tight mb-1">{c!.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{c!.party}</p>
                </div>
                <input
                  type="radio"
                  name="party"
                  className="hidden"
                  checked={selectedParty === c!.id}
                  onChange={() => setSelectedParty(c!.id)}
                />
                {selectedParty === c!.id && <CheckCircle2 className="absolute top-4 right-4 text-white" size={20} />}
              </label>
            ))}
          </div>
        </section>

        {/* Action Bar */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6">
          <button
            onClick={submitVote}
            disabled={!selectedParty || isConfirming || hasVoted}
            className="w-full py-6 bg-black text-white font-black uppercase tracking-[0.4em] text-sm shadow-[15px_15px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none transition-all active:scale-95 disabled:bg-gray-100 disabled:text-gray-300"
          >
            {isConfirming ? 'Propagating to Nodes...' : hasVoted ? 'Ballot Recorded' : 'Seal & Submit Vote'}
          </button>
        </div>
      </main>
    </div>
  );
}