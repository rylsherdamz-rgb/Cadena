"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { NationalBudgetABI, NationalBudgetAddress } from "@/constants/NationalBudget";
import { BudgetCard } from "@/components/BudgetCard";
import { Search, Filter, Plus, ShieldCheck, Activity } from "lucide-react";
import { gsap } from "gsap";

export default function Home() {
  const { address } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);

  const { data: programCountData } = useReadContract({
    address: NationalBudgetAddress,
    abi: NationalBudgetABI,
    functionName: "programCount",
  });

  const { data: authorityData } = useReadContract({
    address: NationalBudgetAddress,
    abi: NationalBudgetABI,
    functionName: "authorities",
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const roleInfo = useMemo(() => {
    const data = authorityData as any;
    if (!data || !data[0]) return { isAuthority: false, role: null };
    return { isAuthority: true, role: data[1] };
  }, [authorityData]);

  const programCalls = useMemo(() => {
    const count = Number(programCountData || 0);
    return Array.from({ length: count }, (_, i) => ({
      address: NationalBudgetAddress,
      abi: NationalBudgetABI,
      functionName: "programs",
      args: [BigInt(i)],
    }));
  }, [programCountData]);

  const { data: programsResults, isLoading } = useReadContracts({
    contracts: programCalls,
    query: { enabled: programCalls.length > 0 }
  });

  const filteredPrograms = useMemo(() => {
    if (!programsResults) return [];
    const all = programsResults
      .map((result, idx) => {
        if (result.status === "success" && result.result) {
          const p = result.result as any;
          return {
            name: p[0], agency: p[1], approvedAmount: p[2],
            releasedAmount: p[3], approvalCount: p[4],
            finalized: p[5], exists: p[6], id: idx,
          };
        }
        return null;
      })
      .filter((p) => p !== null);

    return all.filter(p => 
      p!.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p!.agency.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [programsResults, searchQuery]);

  useEffect(() => {
    if (!isLoading) {
      const ctx = gsap.context(() => {
        gsap.from(".stat-card", {
          y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out"
        });
        gsap.from(".budget-grid-item", {
          scale: 0.9, opacity: 0, duration: 0.6, stagger: 0.05, ease: "expo.out", delay: 0.2
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isLoading, filteredPrograms.length]);

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black pb-20 font-sans">
      <header className="border-b border-black/5 sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-black flex items-center justify-center text-white font-black shrink-0">P</div>
            <div className="">
              <h1 className="text-lg md:text-xl font-black uppercase tracking-tighter italic">National Ledger</h1>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Mainnet Protocol v1.0</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto flex justify-start md:justify-end scale-90 md:scale-100">
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          <StatBox label="Active Programs" value={Number(programCountData || 0)} icon={<Activity size={16}/>} />
          <StatBox label="Finalized Allocations" value={filteredPrograms.filter(p => p?.finalized).length} icon={<ShieldCheck size={16}/>} />
          <StatBox label="Total Network Nodes" value="13,901" icon={<div className="w-2 h-2 bg-black rounded-full"/>} />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mb-8 md:mb-12 items-center">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black w-4 h-4" />
            <input 
              type="text"
              placeholder="SEARCH PROTOCOL BY AGENCY OR NAME..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-b-2 border-transparent focus:border-black outline-none transition-all uppercase text-[10px] md:text-xs font-bold tracking-widest placeholder:text-gray-300"
            />
          </div>
          
          <div className="flex gap-3 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 md:px-8 py-4 border border-black text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
              <Filter className="w-3 h-3" /> Filter
            </button>
            
            {roleInfo.role === 0 && (
              <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 md:px-8 py-4 bg-black text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:invert transition-all whitespace-nowrap">
                <Plus className="w-3 h-3" /> New Proposal
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 md:h-80 border border-gray-100 animate-pulse relative overflow-hidden bg-gray-50" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {filteredPrograms.map((program) => (
              <div key={program!.id} className="budget-grid-item">
                <BudgetCard 
                  program={program!} 
                  programId={program!.id} 
                  userRole={roleInfo.isAuthority ? "authority" : "public"} 
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <div className="stat-card p-6 md:p-8 border border-gray-100 bg-white hover:border-black transition-colors group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
        {icon}
      </div>
      <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-400 mb-2">{label}</p>
      <p className="text-3xl md:text-4xl font-black italic tracking-tighter">{value}</p>
    </div>
  );
}
