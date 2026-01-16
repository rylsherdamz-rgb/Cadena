"use client";

import { useState, useMemo } from "react";
import { 
  useAccount, 
  useWriteContract, 
  useWaitForTransactionReceipt, 
  useReadContract 
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NationalBudgetABI, NationalBudgetAddress } from "@/constants/NationalBudget";

export default function AssignAuthorities() {
  const { address, isConnected } = useAccount();
  const [targetAddress, setTargetAddress] = useState("");
  const [role, setRole] = useState<"DBM" | "HOUSE" | "SENATE" | "PRESIDENT" | "COA">("DBM");

  const roleMap = { DBM: 0, HOUSE: 1, SENATE: 2, PRESIDENT: 3, COA: 4 };

  // --- 1. HARDCODED ADMIN FOR INSTANT VERIFICATION ---
  const HARDCODED_ADMIN = "0x4cb514b6A03b3f33a4B3c3b13734f56518C78EAf";

  // --- 2. CONTRACT READ (AS SECONDARY CHECK) ---
  const { data: superAdmin, isError: readError, isLoading: isReadLoading } = useReadContract({
    address: NationalBudgetAddress,
    abi: NationalBudgetABI,
    functionName: "getSuperAdmin",
  });

  // --- 3. ACCESS LOGIC ---
  const isSuperAdmin = useMemo(() => {
    if (!address) return false;
    return address.toLowerCase() === HARDCODED_ADMIN.toLowerCase();
  }, [address]);

  // --- 4. WRITE CONTRACT ---
  const { data: hash, writeContract, isPending: isSubmitting, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleAssign = () => {
    if (!targetAddress.startsWith("0x") || targetAddress.length !== 42) {
      alert("Please enter a valid Ethereum address.");
      return;
    }

    writeContract({
      address: NationalBudgetAddress,
      abi: NationalBudgetABI,
      functionName: "addAuthority",
      args: [targetAddress as `0x${string}`, roleMap[role]],
    });
  };

  if (!isConnected) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-slate-50 rounded-3xl mt-10 p-10">
      <p className="text-slate-500 mb-6 font-semibold uppercase tracking-widest text-xs">Security Layer: Encrypted</p>
      <ConnectButton />
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Access Control</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Authority Management</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${isSuperAdmin ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isSuperAdmin ? "Admin Active" : "Access Denied"}
          </div>
        </div>

        {/* DIAGNOSTIC PANEL */}
        <div className="mb-6 space-y-2">
          <div className="p-4 bg-slate-900 rounded-2xl font-mono text-[10px] text-slate-300">
            <p className="text-slate-500 border-b border-slate-800 pb-1 mb-1 font-bold">NODE STATUS</p>
            <div className="flex justify-between">
              <span>Contract Read:</span>
              <span className={readError ? "text-red-400" : "text-green-400"}>
                {isReadLoading ? "Syncing..." : readError ? "REVERTED" : "SUCCESS"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Admin Address:</span>
              <span className="text-blue-400">{HARDCODED_ADMIN.slice(0, 6)}...{HARDCODED_ADMIN.slice(-4)}</span>
            </div>
            {writeError && (
               <p className="text-red-400 mt-2 border-t border-slate-800 pt-1">
                 Tx Error: {writeError.message.slice(0, 50)}...
               </p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 block mb-2">New Official Address</label>
            <input
              type="text"
              placeholder="0x..."
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition font-mono text-sm"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 block mb-2">Designated Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 cursor-pointer"
            >
              <option value="DBM">DBM (Proposer)</option>
              <option value="HOUSE">House of Reps</option>
              <option value="SENATE">The Senate</option>
              <option value="PRESIDENT">President</option>
              <option value="COA">Commission on Audit</option>
            </select>
          </div>

          <button
            onClick={handleAssign}
            disabled={!isSuperAdmin || isSubmitting || isConfirming}
            className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 ${
              !isSuperAdmin 
                ? "bg-slate-200 cursor-not-allowed text-slate-400 shadow-none" 
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
            }`}
          >
            {isSubmitting ? "Confirm in Wallet..." : isConfirming ? "Mining..." : "Assign Official Role"}
          </button>

          {isConfirmed && (
            <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-center">
               <p className="text-xs text-green-700 font-bold">✓ Authority Added Successfully</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Blockchain Connected</span>
        </div>
        <span className="text-[9px] font-mono text-slate-300 tracking-tighter">{NationalBudgetAddress}</span>
      </div>
    </div>
  );
}