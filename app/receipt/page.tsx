'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import html2canvas from 'html2canvas';
import { ElectionContractAddress, ELECTION_ABI } from '../../constants/ElectionContract';
import { CheckCircle, Download, Hash, Loader2, ShieldAlert, Cpu } from 'lucide-react';

export default function ReceiptPage() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const [showAllSenators, setShowAllSenators] = useState(false);
  
  // New state to handle download loading feedback
  const [isDownloading, setIsDownloading] = useState(false);
  
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    // Cast to unknown first if TS complains about BigInt mapping, or assume it's BigInt[]
    const ids = (votedSenatorIds as unknown as bigint[]).map(id => Number(id));
    return candidates.filter(c => c && c.position === 2 && ids.includes(c.id));
  }, [candidates, votedSenatorIds]);

  const votedParty = useMemo(() => {
    if (votedPartyId === undefined) return null;
    return candidates.find(c => c && c.position === 3 && Number(votedPartyId) === c.id);
  }, [candidates, votedPartyId]);

  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    
    setIsDownloading(true);

    try {
      // 1. Force a small delay to ensure images are rendered and allow DOM to settle
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher resolution
        useCORS: true, // IMPORTANT: Allows capturing images from local/external sources
        logging: false,
        allowTaint: true,
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.download = `VOTE-RECEIPT-${address?.slice(0, 8) || 'Unknown'}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error("Capture failed:", err);
      alert("Failed to generate receipt. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-white" />;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="border-4 border-black p-6 md:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-sm w-full">
          <Cpu size={40} className="mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-black uppercase mb-6 italic">Identity Required</h2>
          <div className="flex justify-center"><ConnectButton /></div>
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-black">
        <div className="border-4 border-black p-8 md:p-12 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-w-md text-center">
          <ShieldAlert size={48} className="mx-auto mb-6 text-red-600" />
          <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">Null_Record</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-8">
            No voting history found for this signature.
          </p>
          <a href="/ballot" className="inline-block w-full py-4 bg-black text-white font-black uppercase text-xs tracking-[0.3em] hover:bg-gray-800 transition-all">
            Initialize Ballot
          </a>
        </div>
      </div>
    );
  }

  // Type safety check before filtering
  const senators = candidates.filter((c) => c && c.position === 2);
  const partylists = candidates.filter((c) => c && c.position === 3);
  const displayedSenators = showAllSenators ? senators : senators.slice(0, 12);

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20 md:pb-40 overflow-x-hidden">
      <header className="border-b-4 border-black bg-white/95 sticky top-0 z-50 px-4 md:px-6 py-4 md:py-6 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3">
             <Hash size={20} className="font-black md:w-6 md:h-6" />
             <h1 className="text-base md:text-xl font-black uppercase tracking-tighter italic underline decoration-2">Protocol_Receipt</h1>
          </div>
          <div className="scale-90 md:scale-100 origin-right">
            <ConnectButton showBalance={false} accountStatus="address" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 mt-10 md:mt-16 max-w-6xl">
        
        {/* -------- RECEIPT WRAPPER -------- */}
        <div 
          ref={receiptRef}
          id="receipt-content" 
          className="border-4 border-black bg-white p-5 md:p-10 mb-10 md:mb-12 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] md:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-black text-white px-3 md:px-6 py-1 md:py-2 text-[8px] md:text-[10px] font-black uppercase italic">
            Secure_Proof
          </div>
          
          <div className="border-b-4 border-black pb-6 mb-8 md:mb-10">
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">Vote <br /> <span className="text-gray-300">Confirmed</span></h2>
            <div className="mt-6 flex flex-col gap-3">
               <div className="px-2 py-1 bg-black text-white text-[8px] md:text-[9px] font-mono break-all w-full md:w-fit uppercase">
                 VOTER: {address}
               </div>
               <div className="px-2 py-1 border-2 border-black text-[8px] md:text-[9px] font-mono w-fit">
                 TS: {new Date().toISOString()}
               </div>
            </div>
          </div>

          <section className="mb-10 md:mb-12">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-gray-300 mb-6 flex items-center gap-2">
              <span className="w-6 md:w-8 h-1 bg-gray-300" /> Senator_Choices
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {votedSenators.map((s) => (
                <div key={s!.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border-2 border-black bg-white">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 border border-black overflow-hidden flex-shrink-0 relative">
                    <img
                      src={`/candidateImages/${s!.name
                        .trim()
                        .toUpperCase()
                        .replace(/\s+/g, "-")}.webp`}
                      alt={s!.name}
                      crossOrigin="anonymous" 
                      className="w-full h-full object-cover "
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100?text=NODE'; }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-[11px] font-black uppercase leading-tight truncate">{s!.name}</p>
                    <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase italic truncate">{s!.party}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-gray-300 mb-6 flex items-center gap-2">
              <span className="w-6 md:w-8 h-1 bg-gray-300" /> Party_Selection
            </h3>
            {votedParty ? (
              <div className="inline-block p-4 md:p-6 border-4 border-black bg-black text-white w-full sm:w-auto">
                <p className="text-lg md:text-xl font-black uppercase tracking-widest italic">{votedParty.name}</p>
                <div className="h-px bg-white/20 my-2" />
                <p className="text-[9px] md:text-[10px] font-bold opacity-50 uppercase tracking-[0.2em] md:tracking-[0.3em]">{votedParty.party}</p>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border-2 border-red-600 text-red-600 font-black text-xs uppercase">NO_PARTY_DETECTED</div>
            )}
          </section>
        </div>

        {/* EXPORT CONTROL */}
        <div className="flex flex-col gap-4 mb-16 md:mb-24 px-2">
          <button
            onClick={downloadReceipt}
            disabled={isDownloading}
            className={`w-full py-5 md:py-6 bg-black text-white font-black uppercase text-xs md:text-sm tracking-[0.3em] md:tracking-[0.4em] hover:bg-gray-800 flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] transition-all ${isDownloading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isDownloading ? (
               <><Loader2 className="animate-spin" size={18} /> PROCESSING_CANVAS...</>
            ) : (
               <><Download size={18} /> Export_To_PNG</>
            )}
          </button>
        </div>

        {/* -------- LIVE STATISTICS -------- */}
        <section className="pt-10 md:pt-20 border-t-8 border-black">
          <div className="mb-10 md:mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">Ledger <br /> <span className="text-gray-300 underline decoration-black underline-offset-4 md:underline-offset-8">Statistics</span></h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8">
            {displayedSenators.map((c) => {
              if (!c) return null;
              const isMyVote = votedSenators.some(v => v && v.id === c.id);
              return (
                <div key={c.id} className={`p-5 md:p-6 border-4 relative ${isMyVote ? 'border-black bg-black text-white' : 'border-gray-100 bg-white'}`}>
                  {isMyVote && <div className="absolute -top-3 -right-3 bg-white border-2 border-black p-1 text-black"><CheckCircle size={14} /></div>}
                  <div className="flex flex-col gap-3">
                    <p className="text-[10px] font-black uppercase tracking-widest truncate">{c.name}</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl md:text-4xl font-black italic">{c.voteCount.toString()}</span>
                        <span className="text-[8px] font-bold opacity-40 uppercase">Consensus</span>
                    </div>
                    <div className={`h-1 w-full ${isMyVote ? 'bg-white/10' : 'bg-black/5'}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {senators.length > 12 && (
            <button
              onClick={() => setShowAllSenators(!showAllSenators)}
              className="w-full md:w-auto px-10 py-4 border-4 border-black font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-colors mb-20"
            >
              {showAllSenators ? 'Hide_Extended_Nodes' : `View_All_Nodes (${senators.length})`}
            </button>
          )}

          <h3 className="text-xl md:text-2xl font-black uppercase italic mb-6 md:mb-8 border-b-4 border-black w-fit pr-6 md:pr-10 pb-2">Party-List Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {partylists.map((c) => {
               if (!c) return null;
              const isMyVote = votedParty?.id === c.id;
              return (
                <div key={c.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-8 border-4 ${isMyVote ? 'bg-black text-white border-black' : 'border-gray-100'}`}>
                  <p className="font-black uppercase text-xs md:text-sm tracking-tighter mb-4 sm:mb-0 truncate">{c.name}</p>
                  <div className={`px-4 py-2 font-mono font-black text-base md:text-lg w-fit ${isMyVote ? 'bg-white text-black' : 'bg-black text-white'}`}>
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
