"use client";

import { FC, useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { NationalBudgetABI, NationalBudgetAddress } from "@/constants/NationalBudget";
import { CheckCircle2, CircleDot, Clock, Landmark, Send, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

interface BudgetCardProps {
  program: any;
  programId: number;
  userRole: string; // "authority", "dbm", "public"
}

export const BudgetCard: FC<BudgetCardProps> = ({ program, programId, userRole }) => {
  const [mounted, setMounted] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: hash, writeContract, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleApprove = () => {
    try {
      writeContract({
        address: NationalBudgetAddress,
        abi: NationalBudgetABI,
        functionName: "approveBudget",
        args: [BigInt(programId)],
      });
    } catch (error) {
      toast.error("Approval failed");
    }
  };

  // Helper for progress bar
  const approvalProgress = (Number(program.approvalCount) / 5) * 100;

  if (!mounted) return null;

  return (
    <div className={`relative border-4 border-black bg-white p-6 mb-8 transition-all hover:translate-x-1 hover:-translate-y-1 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] ${program.finalized ? 'opacity-90' : ''}`}>
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start mb-6 border-b-2 border-black pb-4">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter italic leading-none mb-1">
            {program.name}
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <Landmark size={12} /> {program.agency}
          </div>
        </div>
        
        {/* STATUS BADGE */}
        {program.finalized ? (
          <div className="bg-green-500 text-white px-3 py-1 text-[10px] font-black uppercase italic border-2 border-black">
            Finalized_Release
          </div>
        ) : (
          <div className="bg-yellow-400 text-black px-3 py-1 text-[10px] font-black uppercase italic border-2 border-black">
            Pending_Consensus
          </div>
        )}
      </div>

      {/* FINANCIAL DATA GRID */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="space-y-1">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Approved_Allocation</p>
          <p className="text-xl font-mono font-black italic">
            ₱{Number(program.approvedAmount).toLocaleString()}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Released_Capital</p>
          <p className="text-xl font-mono font-black italic">
            ₱{Number(program.releasedAmount).toLocaleString()}
          </p>
        </div>
      </div>

      {/* APPROVAL TRACKER */}
      <div className="space-y-3 mb-8">
        <div className="flex justify-between items-end">
          <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={14} /> Multi-Sig Progress
          </p>
          <p className="text-xs font-mono font-black">{Number(program.approvalCount)}/5</p>
        </div>
        <div className="w-full h-4 border-2 border-black bg-gray-100 overflow-hidden">
          <div 
            className="h-full bg-black transition-all duration-1000"
            style={{ width: `${approvalProgress}%` }}
          />
        </div>
      </div>

      {/* ACTION BLOCK */}
      {userRole === "authority" && !program.finalized && (
        <button
          onClick={handleApprove}
          disabled={isPending || isConfirming}
          className={`w-full py-4 border-4 border-black font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 ${
            isPending || isConfirming 
              ? "bg-gray-200 cursor-not-allowed" 
              : "bg-black text-white hover:bg-white hover:text-black shadow-[5px_5px_0px_0px_rgba(0,0,0,0.2)] active:shadow-none"
          }`}
        >
          {isPending ? (
            <> <Clock size={16} className="animate-spin" /> Verifying Signature... </>
          ) : isConfirming ? (
            <> <CircleDot size={16} className="animate-pulse" /> Confirming Block... </>
          ) : (
            <> <Send size={16} /> Sign Budget Approval </>
          )}
        </button>
      )}

      {/* SUCCESS INDICATOR */}
      {isSuccess && (
        <div className="mt-4 p-3 bg-green-50 border-2 border-green-600 flex items-center gap-3">
          <CheckCircle2 size={16} className="text-green-600" />
          <p className="text-[10px] font-black text-green-700 uppercase italic">
            Approval Logged Successfully
          </p>
        </div>
      )}
    </div>
  );
};