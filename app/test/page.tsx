"use client";
import { useEffect, useState } from "react";
import {ConnectButton} from "@rainbow-me/rainbowkit"
import { useAccount, useReadContract } from "wagmi";
import { NationalBudgetABI, NationalBudgetAddress } from "@/constants/NationalBudget";
import { BudgetCard } from "@/components/BudgetCard";

export default function Home() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string>("public");

  const { address } = useAccount();

  // 1️⃣ Fetch program count
  const { data: programCountData } = useReadContract({
    address: NationalBudgetAddress,
    abi: NationalBudgetABI,
    functionName: "programCount",
  });

  // 2️⃣ Check if user is authority
  const { data: authorityData } = useReadContract({
    address: NationalBudgetAddress,
    abi: NationalBudgetABI,
    functionName: "authorities",
    args: [address || "0x0000000000000000000000000000000000000000"],
  });

  useEffect(() => {
    if (authorityData?.exists) setUserRole("authority");
  }, [authorityData]);

  // 3️⃣ Fetch all programs using Wagmi (readContract)
  useEffect(() => {
    const fetchPrograms = async () => {
      if (!programCountData) return;
      const programsArray = [];
      for (let i = 0; i < Number(programCountData); i++) {
        const program = await useReadContract({
          address: NationalBudgetAddress,
          abi: NationalBudgetABI,
          functionName: "programs",
          args: [i],
        }).data;
        programsArray.push({ ...program, id: i });
      }
      setPrograms(programsArray);
    };
    fetchPrograms();
  }, [programCountData]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Budget Proposals</h2>
      <ConnectButton />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map((program, idx) => (
          <BudgetCard key={idx} program={program} programId={idx} userRole={userRole} />
        ))}
      </div>
    </div>
  );
}
