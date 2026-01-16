"use client";

import { useState } from "react";
import { 
  useAccount, 
  useWriteContract, 
  useWaitForTransactionReceipt, 
  useReadContract 
} from "wagmi";
import { parseUnits } from "viem";
import { NationalBudgetABI, NationalBudgetAddress } from "@/constants/NationalBudget";

export default function ProposeBudget() {
  const { address, isConnected } = useAccount();
  
  // Form State
  const [name, setName] = useState("");
  const [agency, setAgency] = useState("");
  const [amount, setAmount] = useState("");

  // 1. Check if user is actually DBM (Role 0)
  const { data: authorityData } = useReadContract({
    address: NationalBudgetAddress,
    abi: NationalBudgetABI,
    functionName: "authorities",
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const isDBM = (authorityData as any)?.[0] && (authorityData as any)?.[1] === 0;

  // 2. Write Contract Setup
  const { data: hash, writeContract, isPending: isSubmitting, error: writeError } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ 
    hash 
  });

  const handlePropose = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !agency || !amount) {
      alert("Please fill in all fields");
      return;
    }

    // Convert amount to BigInt. 
    // If your contract treats '1' as 1 Peso/Eth, use parseUnits(amount, 18).
    // If it treats '1' as a raw unit, use BigInt(amount).
    const formattedAmount = BigInt(amount); 

    writeContract({
      address: NationalBudgetAddress,
      abi: NationalBudgetABI,
      functionName: "proposeBudget",
      args: [name, agency, formattedAmount],
    });
  };

  if (!isConnected) return null; // Or show a connect prompt

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white border border-slate-200 rounded-3xl shadow-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Propose New Budget</h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">DBM Official Portal</p>
      </div>

      {!isDBM ? (
        <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-center">
          <p className="text-red-600 font-bold text-sm">Access Denied: You must be assigned the DBM role to propose budgets.</p>
        </div>
      ) : (
        <form onSubmit={handlePropose} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Program Name</label>
              <input
                type="text"
                placeholder="e.g. Universal Health Care"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Implementing Agency</label>
              <input
                type="text"
                placeholder="e.g. Department of Health"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Budget Amount (PHP / Raw Units)</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition font-mono font-bold text-lg"
            />
          </div>

          {writeError && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-mono">
              Error: {writeError.message.slice(0, 100)}...
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isConfirming}
            className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 ${
              isSubmitting || isConfirming 
                ? "bg-slate-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
            }`}
          >
            {isSubmitting ? "Signing Transaction..." : isConfirming ? "Broadcasting to Ledger..." : "Submit Proposal"}
          </button>

          {isSuccess && (
            <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-center">
              <p className="text-green-700 font-bold text-sm">✓ Budget Proposal Submitted Successfully!</p>
            </div>
          )}
        </form>
      )}
    </div>
  );
}