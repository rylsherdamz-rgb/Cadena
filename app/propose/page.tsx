"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  useAccount, 
  useWriteContract, 
  useWaitForTransactionReceipt, 
  useReadContract 
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NationalBudgetABI, NationalBudgetAddress } from "@/constants/NationalBudget";
import toast from "react-hot-toast";
import { FileText, ShieldAlert, CheckCircle, Send, HardDrive, Wallet, Loader2 } from "lucide-react";

function ProposeBudget() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  
  // Form State
  const [name, setName] = useState("");
  const [agency, setAgency] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------------- ROLE VERIFICATION ---------------- */
  const { data: authorityData, isLoading: roleLoading } = useReadContract({
    address: NationalBudgetAddress,
    abi: NationalBudgetABI,
    functionName: "authorities",
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  // Role 0 is typically DBM in your contract
  const isDBM = (authorityData as any)?.[0] && (authorityData as any)?.[1] === 0;

  /* ---------------- CONTRACT WRITE ---------------- */
  const { data: hash, writeContract, isPending: isSubmitting, error: writeError } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handlePropose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !agency || !amount) {
      return toast.error("All parameters required for submission");
    }

    try {
      writeContract({
        address: NationalBudgetAddress,
        abi: NationalBudgetABI,
        functionName: "proposeBudget",
        args: [name, agency, BigInt(amount)],
      });
    } catch (err) {
      console.error(err);
      toast.error("Execution reverted by EVM");
    }
  };

  // 1. Force white background to prevent "Black Screen"
  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* TOP STATUS BAR */}
        <div className="flex justify-between items-center mb-12 border-b-4 border-black pb-6">
          <div className="flex items-center gap-3">
             <div className="bg-black p-2 text-white">
                <FileText size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter italic">Budget_Portal_v1</h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">National Ledger Interface</p>
             </div>
          </div>
          <ConnectButton showBalance={false} />
        </div>

        {/* LOGIC BRANCHES */}
        {!isConnected ? (
          <div className="border-4 border-black p-16 text-center bg-gray-50 flex flex-col items-center">
            <Wallet size={48} className="mb-4" />
            <h2 className="text-3xl font-black uppercase mb-2">Wallet Disconnected</h2>
            <p className="text-xs font-bold text-gray-400 uppercase mb-8">Accessing the national budget requires a valid blockchain signature</p>
            <ConnectButton />
          </div>
        ) : roleLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin mb-4" />
            <p className="text-xs font-black uppercase tracking-[0.3em]">Querying Authority Data...</p>
          </div>
        ) : !isDBM ? (
          <div className="border-4 border-black p-12 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
            <ShieldAlert size={64} className="text-red-600 mb-6" />
            <h2 className="text-4xl font-black uppercase tracking-tighter italic text-red-600">Access_Denied</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-black mt-4 max-w-sm">
              Your wallet address is not registered as a [DBM_OFFICIAL]. Contact system admin for role assignment.
            </p>
          </div>
        ) : (
          /* ACTUAL FORM */
          <div className="bg-white border-4 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="bg-black text-white px-6 py-2 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <HardDrive size={12} /> Secure_Node // {address.slice(0,6)}...{address.slice(-4)}
              </span>
              <span className="text-[10px] font-mono opacity-60">ROLE_ID: 0x00 (DBM)</span>
            </div>

            <div className="p-10">
              <form onSubmit={handlePropose} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest">01_Program_Name</label>
                    <input
                      type="text"
                      placeholder="Enter Program..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-4 border-4 border-black bg-white focus:bg-gray-50 outline-none transition font-black uppercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest">02_Agency_ID</label>
                    <input
                      type="text"
                      placeholder="Enter Agency..."
                      value={agency}
                      onChange={(e) => setAgency(e.target.value)}
                      className="w-full p-4 border-4 border-black bg-white focus:bg-gray-50 outline-none transition font-black uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest">03_Allocation_Amount</label>
                  <input
                    type="number"
                    placeholder="00.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-6 border-4 border-black bg-white focus:bg-black focus:text-white outline-none transition font-mono font-black text-4xl"
                  />
                </div>

                {writeError && (
                  <div className="p-4 bg-red-50 border-2 border-red-600 text-red-600 font-mono text-[10px] uppercase font-bold">
                    [EXCEPTION_ERROR]: {writeError.message.slice(0, 100)}...
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || isConfirming}
                  className="w-full py-6 bg-black text-white border-4 border-black font-black uppercase tracking-[0.4em] text-sm hover:bg-white hover:text-black transition-all active:translate-y-1 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-200"
                >
                  {isSubmitting ? "Signing_Signature..." : isConfirming ? "Broadcasting_to_Mainnet..." : "Execute_Budget_Proposal"}
                </button>

                {isSuccess && (
                  <div className="p-6 border-4 border-green-600 bg-green-50 flex items-center gap-4">
                    <CheckCircle className="text-green-600" size={32} />
                    <div className="flex-1">
                      <p className="text-green-700 font-black uppercase text-sm italic underline">Success_Verified</p>
                      <p className="text-[9px] font-mono text-green-600 break-all">{hash}</p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Prevents Hydration Mismatch
export default dynamic(() => Promise.resolve(ProposeBudget), { ssr: false });