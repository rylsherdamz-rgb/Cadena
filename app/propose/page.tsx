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
  
  const [name, setName] = useState("");
  const [agency, setAgency] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: authorityData, isLoading: roleLoading } = useReadContract({
    address: NationalBudgetAddress,
    abi: NationalBudgetABI,
    functionName: "authorities",
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const isDBM = (authorityData as any)?.[0] && (authorityData as any)?.[1] === 0;

  const { data: hash, writeContract, isPending: isSubmitting, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handlePropose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !agency || !amount) {
      return toast.error("All parameters required");
    }

    try {
      writeContract({
        address: NationalBudgetAddress,
        abi: NationalBudgetABI,
        functionName: "proposeBudget",
        args: [name, agency, BigInt(amount)],
      });
    } catch (err) {
      toast.error("Execution reverted");
    }
  };

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-8 lg:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* TOP STATUS BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 md:mb-12 border-b-4 border-black pb-6">
          <div className="flex items-center gap-3">
             <div className="bg-black p-2 text-white shrink-0">
                <FileText size={24} />
             </div>
             <div>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic leading-none">Budget_Portal_v1</h1>
                <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">National Ledger Interface</p>
             </div>
          </div>
          <div className="w-full sm:w-auto flex justify-end">
            <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon" />
          </div>
        </div>

        {!isConnected ? (
          <div className="border-4 border-black p-8 md:p-16 text-center bg-gray-50 flex flex-col items-center">
            <Wallet size={40} className="mb-4" />
            <h2 className="text-2xl md:text-3xl font-black uppercase mb-2">Wallet Disconnected</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-8">Auth signature required</p>
            <ConnectButton />
          </div>
        ) : roleLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin mb-4 text-black" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Querying Authority...</p>
          </div>
        ) : !isDBM ? (
          <div className="border-4 border-black p-6 md:p-12 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
            <ShieldAlert size={48} className="text-red-600 mb-4 md:mb-6" />
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-red-600">Access_Denied</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-black mt-4 max-w-sm">
              Wallet not registered as [DBM_OFFICIAL].
            </p>
          </div>
        ) : (
          /* FORM SECTION */
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-10">
            <div className="bg-black text-white px-4 md:px-6 py-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 truncate w-full sm:w-auto">
                 <HardDrive size={12} className="shrink-0" /> Secure_Node // {address.slice(0,6)}...{address.slice(-4)}
              </span>
              <span className="text-[9px] md:text-[10px] font-mono opacity-60">ROLE_ID: 0x00 (DBM)</span>
            </div>

            <div className="p-5 md:p-10">
              <form onSubmit={handlePropose} className="space-y-6 md:space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest">01_Program_Name</label>
                    <input
                      type="text"
                      placeholder="Enter Program..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 md:p-4 border-4 border-black bg-white focus:bg-gray-50 outline-none transition font-black uppercase text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest">02_Agency_ID</label>
                    <input
                      type="text"
                      placeholder="Enter Agency..."
                      value={agency}
                      onChange={(e) => setAgency(e.target.value)}
                      className="w-full p-3 md:p-4 border-4 border-black bg-white focus:bg-gray-50 outline-none transition font-black uppercase text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest">03_Allocation_Amount</label>
                  <input
                    type="number"
                    placeholder="00.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-4 md:p-6 border-4 border-black bg-white focus:bg-black focus:text-white outline-none transition font-mono font-black text-2xl md:text-4xl"
                  />
                </div>

                {writeError && (
                  <div className="p-3 bg-red-50 border-2 border-red-600 text-red-600 font-mono text-[9px] md:text-[10px] uppercase font-bold break-words">
                    [EXCEPTION_ERROR]: {writeError.message.slice(0, 80)}...
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || isConfirming}
                  className="w-full py-4 md:py-6 bg-black text-white border-4 border-black font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-xs md:text-sm hover:bg-white hover:text-black transition-all active:translate-y-1 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-200"
                >
                  {isSubmitting ? "Signing..." : isConfirming ? "Broadcasting..." : "Execute_Budget_Proposal"}
                </button>

                {isSuccess && (
                  <div className="p-4 md:p-6 border-4 border-green-600 bg-green-50 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <CheckCircle className="text-green-600 shrink-0" size={32} />
                    <div className="flex-1 min-w-0">
                      <p className="text-green-700 font-black uppercase text-xs md:text-sm italic underline">Success_Verified</p>
                      <p className="text-[8px] md:text-[9px] font-mono text-green-600 break-all">{hash}</p>
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

export default dynamic(() => Promise.resolve(ProposeBudget), { ssr: false });