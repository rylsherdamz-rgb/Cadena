"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { NationalBudgetABI, NationalBudgetAddress } from "@/constants/NationalBudget";
import { BudgetCard } from "@/components/BudgetCard";
import { Search, Filter, Plus, ShieldCheck, Activity, X } from "lucide-react";
import { gsap } from "gsap";

export default function Cadena() {
  const { address } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef(null);

  const { data: programCountData, refetch: refetchCount } = useReadContract({
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
    return { isAuthority: true, role: Number(data[1]) };
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

  const { data: programsResults, isLoading, refetch: refetchPrograms } = useReadContracts({
    contracts: programCalls,
    query: { enabled: programCalls.length > 0 }
  });

  const refreshData = () => {
    refetchCount();
    refetchPrograms();
  };

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
        gsap.from(".stat-card", { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" });
        gsap.from(".budget-grid-item", { scale: 0.9, opacity: 0, duration: 0.6, stagger: 0.05, ease: "expo.out", delay: 0.2 });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isLoading, filteredPrograms.length]);

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black pb-20 font-sans">
      <header className="border-b border-black/5 sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-black shrink-0">P</div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter italic">National Ledger</h1>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Mainnet Protocol v1.0</span>
              </div>
            </div>
          </div>
          <ConnectButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          <StatBox label="Active Programs" value={Number(programCountData || 0)} icon={<Activity size={16}/>} />
          <StatBox label="Finalized Allocations" value={filteredPrograms.filter(p => p?.finalized).length} icon={<ShieldCheck size={16}/>} />
          <StatBox label="Network Integrity" value="SECURE" icon={<div className="w-2 h-2 bg-black rounded-full"/>} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black w-4 h-4" />
            <input 
              type="text"
              placeholder="SEARCH PROTOCOL BY AGENCY OR NAME..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-b-2 border-transparent focus:border-black outline-none transition-all uppercase text-xs font-bold tracking-widest"
            />
          </div>
          
          <div className="flex gap-3 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-4 border border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
              <Filter className="w-3 h-3" /> Filter
            </button>
            
            {roleInfo.role === 0 && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:invert transition-all whitespace-nowrap"
              >
                <Plus className="w-3 h-3" /> New Proposal
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 border border-gray-100 animate-pulse bg-gray-50" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPrograms.map((program) => (
              <div key={program!.id} className="budget-grid-item">
                <BudgetCard 
                  program={program!} 
                  programId={program!.id} 
                  userRole={roleInfo.isAuthority ? "authority" : "public"}
                  onActionSuccess={refreshData}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <NewProposalModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            refreshData();
          }} 
        />
      )}
    </div>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <div className="stat-card p-8 border border-gray-100 bg-white hover:border-black transition-colors group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">{icon}</div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">{label}</p>
      <p className="text-4xl font-black italic tracking-tighter">{value}</p>
    </div>
  );
}

function NewProposalModal({ onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [agency, setAgency] = useState("");
  const [amount, setAmount] = useState("");

  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) onSuccess();
  }, [isConfirmed, onSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    writeContract({
      address: NationalBudgetAddress,
      abi: NationalBudgetABI,
      functionName: "proposeProgram",
      args: [name, agency, BigInt(amount)],
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-[4px] border-black w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 hover:rotate-90 transition-transform">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-black italic uppercase mb-6 tracking-tighter">New Protocol Proposal</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            required
            placeholder="PROGRAM NAME" 
            className="p-4 border-2 border-black font-bold text-xs outline-none focus:bg-gray-50"
            value={name} onChange={(e) => setName(e.target.value)}
          />
          <input 
            required
            placeholder="LEAD AGENCY" 
            className="p-4 border-2 border-black font-bold text-xs outline-none focus:bg-gray-50"
            value={agency} onChange={(e) => setAgency(e.target.value)}
          />
          <input 
            required
            type="number"
            placeholder="TOTAL BUDGET (WEI)" 
            className="p-4 border-2 border-black font-bold text-xs outline-none focus:bg-gray-50"
            value={amount} onChange={(e) => setAmount(e.target.value)}
          />
          <button 
            disabled={isPending || isConfirming}
            type="submit" 
            className="bg-black text-white p-5 font-black uppercase tracking-widest hover:bg-gray-900 disabled:bg-gray-400 transition-all"
          >
            {isPending || isConfirming ? "Broadcasting..." : "Initialize Proposal"}
          </button>
        </form>
      </div>
    </div>
  );
}
