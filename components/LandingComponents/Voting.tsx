'use client'

import { useReadContracts, useReadContract } from "wagmi"
import { useEffect, useRef, useMemo, useState } from "react"
import { ElectionContractAddress, ELECTION_ABI } from '@/constants/ElectionContract';
import { gsap } from "gsap"

export default function ElectionShowcase() {
  const containerRef = useRef(null)
  const pulseRef = useRef(null)
  const [mounted, setMounted] = useState<boolean>(false)

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

  const topSenators = useMemo(() => {
    const senators = candidates.filter((c: any) => c.position === 2);
    return senators
      .sort((a: any, b: any) => (b.voteCount > a.voteCount ? 1 : -1))
      .slice(0, 3);
  }, [candidates]);

  const totalVotes = useMemo(() => {
    return candidates.reduce((acc: bigint, curr: any) => acc + curr.voteCount, 0n);
  }, [candidates]);

  useEffect(() => {
    if (!mounted || topSenators.length === 0) return; 

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 }) 
      tl.from(".voter-card", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
      })

      tl.to(".progress-fill", {
        width: "100%",
        duration: 1.5,
        ease: "power2.inOut"
      })

      tl.from(".block-stamp", {
        scale: 2,
        opacity: 0,
        duration: 0.4,
        ease: "back.out(1.7)"
      })

      tl.to(".count-up", {
        innerText: (i, target) => target.getAttribute("data-end"),
        duration: 2,
        snap: { innerText: 1 },
        ease: "power1.out"
      }, "-=0.5")

      tl.to(containerRef.current, {
        opacity: 0,
        duration: 1,
        delay: 5
      })
    }, containerRef)

    return () => ctx.revert()
  }, [mounted, topSenators])

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <section ref={containerRef} className="w-full py-32 bg-white text-black flex flex-col items-center overflow-hidden">
      <div className="text-center mb-20 px-6">
        <h2 className="text-xs font-black tracking-[0.5em] uppercase text-gray-400 mb-4">Democratic Protocol</h2>
        <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">Voice of the People</h3>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 px-6">
        <div className="lg:col-span-4 flex flex-col gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Live Election Feed</p>
          <VoterAction name="Node_821" action="Verifying Block #992..." time="2s ago" />
          <VoterAction name="Node_044" action="Consensus Reached" time="5s ago" />
          <VoterAction name="Node_991" action="New Vote Registered" time="12s ago" />
          <VoterAction name="Node_112" action="Syncing Ledger..." time="15s ago" />
        </div>

        <div className="lg:col-span-8 border-[10px] border-black p-8 md:p-12 flex flex-col justify-between min-h-[500px] relative">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h4 className="text-3xl font-black uppercase italic tracking-tighter">Senator Leaders</h4>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                {isLoading ? "Fetching Contract Data..." : "Live Blockchain Data"}
              </p>
            </div>
            <div className="block-stamp px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest">
              Verified by Blockchain
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            {isLoading && topSenators.length === 0 ? (
               <div className="col-span-3 text-center font-mono text-xs uppercase animate-pulse">
                 Loading Candidate Data...
               </div>
            ) : (
              topSenators.map((senator: any, index: number) => (
                <StatsBox 
                  key={senator.id}
                  rank={index + 1}
                  name={senator.name} 
                  count="0" 
                  end={senator.voteCount.toString()} 
                />
              ))
            )}
            
            {!isLoading && topSenators.length === 0 && (
               <div className="col-span-3 text-center font-mono text-xs uppercase text-gray-400">
                 No votes cast yet.
               </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="w-full h-4 bg-gray-100 relative">
              <div className="progress-fill absolute top-0 left-0 h-full bg-black w-0" />
            </div>
            <div className="flex flex-wrap justify-between gap-4">
              <div className="flex items-center gap-2">
                <div ref={pulseRef} className="w-3 h-3 bg-black rounded-full animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-widest">Processing Global Tally</span>
              </div>
              <span className="text-[10px] font-mono text-gray-400">
                  TOTAL VOTES: {totalVotes.toString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function VoterAction({ name, action, time }: { name: string, action: string, time: string }) {
  return (
    <div className="voter-card p-4 border border-gray-200 flex flex-col gap-1 hover:border-black transition-colors cursor-default bg-white">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-tighter">{name}</span>
        <span className="text-[9px] text-gray-400 font-mono">{time}</span>
      </div>
      <p className="text-xs font-bold uppercase">{action}</p>
    </div>
  )
}

function StatsBox({ rank, name, count, end }: { rank: number, name: string, count: string, end: string }) {
  return (
    <div className="flex flex-col group relative">
      <div className="absolute -top-3 -left-3 z-10 w-8 h-8 bg-black text-white flex items-center justify-center font-black text-sm border-2 border-white shadow-md">
        {rank}
      </div>
      
      <div className="w-full aspect-square border-4 border-black mb-4 overflow-hidden bg-gray-100 relative">
        <img 
          src={`/candidateImages/${name.trim().toUpperCase().replace(/\s+/g, "-")}.webp`}
          alt={name}
          className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500 ease-in-out"
          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300?text=CANDIDATE'; }}
        />
      </div>

      <div className="flex flex-col pl-2 border-l-4 border-black">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 truncate" title={name}>
          {name}
        </span>
        <span className="count-up text-3xl font-black tracking-tighter break-all leading-none" data-end={end}>
          {count}
        </span>
      </div>
    </div>
  )
}
