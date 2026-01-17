"use client";

import { useState, useMemo } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { NationalBudgetABI, NationalBudgetAddress } from "@/constants/NationalBudget";
import { BudgetCard } from "@/components/BudgetCard"; // Ensure this is updated too
import { Search, Filter, Plus } from "lucide-react"; // npm install lucide-react

export default function Home() {
  const { address } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");

  // 1️⃣ Data Fetching (Keep your existing efficient multicall logic)
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

  // Determine Role: 0=DBM, 1=House, 2=Senate, 3=President, 4=COA
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

  // 2️⃣ Formatting & Search Logic
  const filteredPrograms = useMemo(() => {
    if (!programsResults) return [];
    const all = programsResults
      .map((result, idx) => {
        if (result.status === "success" && result.result) {
          const p = result.result as any;
          return {
            name: p[0],
            agency: p[1],
            approvedAmount: p[2],
            releasedAmount: p[3],
            approvalCount: p[4],
            finalized: p[5],
            exists: p[6],
            id: idx,
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

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span className="bg-blue-600 text-white p-1.5 rounded-lg text-xs">PH</span>
                National Budget Ledger
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                BFT-Consensus Transparency Protocol
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ConnectButton showBalance={false} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search by program name or government agency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition">
            <Filter className="w-4 h-4" />
            Filter Status
          </button>
          
          {roleInfo.role === 0 && (
            <button className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              <Plus className="w-4 h-4" />
              New Proposal
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Items</p>
                <p className="text-xl font-black text-slate-800">{Number(programCountData || 0)}</p>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Finalized</p>
                <p className="text-xl font-black text-green-600">
                    {filteredPrograms.filter(p => p?.finalized).length}
                </p>
            </div>
        </div>

        {/* MAIN FEED */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-white border border-slate-100 animate-pulse rounded-[2rem]" />
            ))}
          </div>
        ) : filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <BudgetCard 
                key={program!.id} 
                program={program!} 
                programId={program!.id} 
                // We pass the refined role info here
                userRole={roleInfo.isAuthority ? "authority" : "public"} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="inline-flex p-6 bg-slate-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No programs found</h3>
            <p className="text-slate-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}