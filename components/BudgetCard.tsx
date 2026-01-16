"use client";
import { FC } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { NationalBudgetABI, NationalBudgetAddress } from "@/constants/NationalBudget";

interface BudgetCardProps {
  program: any;
  programId: number;
  userRole: string; 
}

export const BudgetCard: FC<BudgetCardProps> = ({ program, programId, userRole }) => {
  const { address } = useAccount();

  const { writeContract: approveBudget } = useWriteContract({
    
  });

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-4 border-l-4 border-blue-500 hover:shadow-2xl transition-all">
      <h3 className="text-lg font-bold">{program.name}</h3>
      <p className="text-sm text-gray-600">{program.agency}</p>
      <div className="mt-2">
        <p>Approved Amount: ₱{program.approvedAmount.toLocaleString()}</p>
        <p>Released: ₱{program.releasedAmount.toLocaleString()}</p>
        <p>Approvals: {program.approvalCount}/5</p>
        <p>Finalized: {program.finalized ? "✅" : "❌"}</p>
      </div>
      {userRole === "authority" && !program.finalized && (
        <button
          onClick={() => approveBudget?.(
            {
    address: NationalBudgetAddress,
    abi: NationalBudgetABI,
    functionName: "approveBudget",
    args: [programId],
            }
          )}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Approve Budget
        </button>
      )}
    </div>
  );
};
