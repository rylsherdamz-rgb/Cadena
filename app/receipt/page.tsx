'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useAccount,
  useReadContract,
  useReadContracts,
} from 'wagmi';
import html2canvas from 'html2canvas';
import { ElectionContractAddress, ELECTION_ABI } from '../../constants/ElectionContract';
import { CheckCircle, Download, Users, BarChart3, Loader2, ShieldAlert, Cpu, Hash } from 'lucide-react';

function ReceiptPage() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const [showAllSenators, setShowAllSenators] = useState(false);
  const receiptRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------------- BLOCKCHAIN READS ---------------- */
  const { data: hasVoted, isLoading: checkVoteLoading } = useReadContract({
    address: ElectionContractAddress,
    abi: ELECTION_ABI,
    functionName: 'hasVoted',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: votedSenatorIds } = useReadContract({
    address: ElectionContractAddress,
    abi: ELECTION_ABI,
    functionName: 'getVotedSenators',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!hasVoted },
  });

  const { data: votedPartyId } = useReadContract({
    address: ElectionContractAddress,
    abi: ELECTION_ABI,
    functionName: 'getVotedParty',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!hasVoted },
  });

  const { data: countData } = useReadContract({
    address: ElectionContractAddress,
    abi: ELECTION_ABI,
    functionName: 'getCandidatesCount',
  });

  const count = Number(countData ?? 0);

  const { data: candidatesRaw, isLoading: candidatesLoading } = useReadContracts({
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
    return candidatesRaw.map((r: any, id: number) => {
      const c = r.result;
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

  const votedSenators = useMemo(() => {
    if (!votedSenatorIds) return [];
    const ids = (votedSenatorIds as bigint[]).map(id => Number(id));
    return candidates.filter(c => c.position === 2 && ids.includes(c.id));
  }, [candidates, votedSenatorIds]);

  const votedParty = useMemo(() => {
    if (votedPartyId === undefined) return null;
    return candidates.find(c => c.position === 3 && Number(votedPartyId) === c.id);
  }, [candidates, votedPartyId]);

  /* ---------------- THE FIX: RELIABLE PNG DOWNLOAD ---------------- */
  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    
    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        useCORS: true, // Crucial for loading images from other domains
        logging: false,
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.download = `VOTE-RECEIPT-${address?.slice(0, 8)}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error("Capture failed:", err);
    }
  };

  /* ---------------- RENDERING ---------------- */
  if (!mounted) return <div className="min-h-screen bg-white" />;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10">
        <div className="border-4 border-black p-10 text-center shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          <Cpu size={48} className="mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-black uppercase mb-6 italic">Identity Required</h2>
          <ConnectButton />
        </div>
      </div>
    );
  }

  if (checkVoteLoading || candidatesLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="animate-spin mb-4" />
        <p className="font-black uppercase text-[10px] tracking-[0.4em]">Synchronizing Ledger...</p>
      </div>
    );
  }

  if (!hasVoted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-black">
        <div className="border-4 border-black p-12 bg-white shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] max-w-md text-center">
          <ShieldAlert size={60} className="mx-auto mb-6 text-red-600" />
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Null_Record</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-8">
            No voting history found for this signature on the current contract.
          </p>
          <a href="/ballot" className="inline-block w-full py-4 bg-black text-white font-black uppercase text-xs tracking-[0.3em] hover:bg-gray-800 transition-all active:scale-95">
            Initialize Ballot
          </a>
        </div>
      </div>
    );
  }

  const senators = candidates.filter((c) => c.position === 2);
  const partylists = candidates.filter((c) => c.position === 3);
  const displayedSenators = showAllSenators ? senators : senators.slice(0, 12);

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-40">
      <header className="border-b-4 border-black bg-white/95 sticky top-0 z-50 px-6 py-6 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <Hash size={24} className="font-black" />
             <h1 className="text-xl font-black uppercase tracking-tighter italic underline decoration-2">Protocol_Receipt</h1>
          </div>
          <ConnectButton showBalance={false} />
        </div>
      </header>

      <main className="container mx-auto px-6 mt-16 max-w-6xl">
        
        {/* -------- RECEIPT WRAPPER (This part gets screenshotted) -------- */}
        <div 
          ref={receiptRef}
          id="receipt-content" 
          className="border-4 border-black bg-white p-10 mb-12 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
        >
          {/* Decorative Technical Elements */}
          <div className="absolute top-0 right-0 bg-black text-white px-6 py-2 text-[10px] font-black uppercase italic">
            Secure_Cryptographic_Proof
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-black/5" />
          
          <div className="border-b-4 border-black pb-6 mb-10">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Vote <br /> <span className="text-gray-300">Confirmed</span></h2>
            <div className="mt-6 flex flex-col md:flex-row md:items-center gap-4">
               <div className="px-3 py-1 bg-black text-white text-[9px] font-mono w-fit">VOTER_ID: {address}</div>
               <div className="px-3 py-1 border-2 border-black text-[9px] font-mono w-fit">TIMESTAMP: {new Date().toISOString()}</div>
            </div>
          </div>

          <section className="mb-12">
            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-300 mb-8 flex items-center gap-2">
              <span className="w-8 h-1 bg-gray-300" /> Senator_Choices
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {votedSenators.map((s) => (
                <div key={s.id} className="flex items-center gap-4 p-4 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors group">
                  <div className="w-12 h-12 bg-gray-100 border border-black overflow-hidden flex-shrink-0 group-hover:border-white transition-colors">
                    <img
                      src={`/candidateImages/${s.name.toUpperCase().replace(/ /g, "-")}.webp`}
                      alt=""
                      className="w-full h-full object-cover grayscale"
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100?text=NODE'; }}
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase leading-tight">{s.name}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase italic">{s.party}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-300 mb-8 flex items-center gap-2">
              <span className="w-8 h-1 bg-gray-300" /> Party_Selection
            </h3>
            {votedParty ? (
              <div className="inline-block p-6 border-4 border-black bg-black text-white">
                <p className="text-xl font-black uppercase tracking-widest italic">{votedParty.name}</p>
                <div className="h-px bg-white/20 my-2" />
                <p className="text-[10px] font-bold opacity-50 uppercase tracking-[0.3em]">{votedParty.party}</p>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border-2 border-red-600 text-red-600 font-black text-xs">NO_PARTY_DETECTED</div>
            )}
          </section>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row gap-6 mb-24">
          <button
            onClick={downloadReceipt}
            className="flex-1 py-6 bg-black text-white font-black uppercase text-sm tracking-[0.4em] hover:bg-gray-800 transition-all flex items-center justify-center gap-4 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1"
          >
            <Download size={20} /> Export_To_PNG
          </button>
        </div>

        {/* -------- LIVE STATISTICS -------- */}
        <section className="pt-20 border-t-8 border-black">
          <div className="mb-16">
            <h2 className="text-6xl font-black uppercase tracking-tighter italic">Ledger <br /> <span className="text-gray-300 underline decoration-black underline-offset-8">Statistics</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayedSenators.map((c) => {
              const isMyVote = votedSenators.some(v => v.id === c.id);
              return (
                <div key={c.id} className={`p-6 border-4 transition-all relative ${isMyVote ? 'border-black bg-black text-white' : 'border-gray-100 bg-white'}`}>
                  {isMyVote && <div className="absolute -top-3 -right-3 bg-white border-4 border-black p-1 text-black"><CheckCircle size={16} /></div>}
                  <div className="flex flex-col gap-4">
                    <p className="text-xs font-black uppercase tracking-widest">{c.name}</p>
                    <div className="flex items-baseline gap-2">
                       <span className="text-4xl font-black italic">{c.voteCount.toString()}</span>
                       <span className="text-[10px] font-bold opacity-40 uppercase">Consensus_Votes</span>
                    </div>
                    <div className={`h-1 w-full ${isMyVote ? 'bg-white/20' : 'bg-black/5'}`} />
                    <p className="text-[9px] font-bold uppercase text-gray-400">{c.party}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {senators.length > 12 && (
            <button
              onClick={() => setShowAllSenators(!showAllSenators)}
              className="px-10 py-4 border-4 border-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-colors mb-20"
            >
              {showAllSenators ? 'Hide_Extended_Nodes' : `View_All_Nodes (${senators.length})`}
            </button>
          )}

          <h3 className="text-2xl font-black uppercase italic mb-8 border-b-4 border-black w-fit pr-10 pb-2">Party-List Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partylists.map((c) => {
              const isMyVote = votedParty?.id === c.id;
              return (
                <div key={c.id} className={`flex items-center justify-between p-8 border-4 transition-all ${isMyVote ? 'bg-black text-white border-black' : 'border-gray-100'}`}>
                  <p className="font-black uppercase text-sm tracking-tighter">{c.name}</p>
                  <div className={`px-4 py-2 font-mono font-black text-lg ${isMyVote ? 'bg-white text-black' : 'bg-black text-white'}`}>
                    {c.voteCount.toString()}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ReceiptPage), { ssr: false });