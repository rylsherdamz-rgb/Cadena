"use client";

import { useState } from "react";
import { useAccount, useWalletClient, useWriteContract } from "wagmi";

import {ConnectButton} from "@rainbow-me/rainbowkit"
import { NationalBudgetABI, NationalBudgetAddress } from "@/constants/NationalBudget";

export default function AssignAuthorities() {
  const { address } = useAccount();
  const { data: signer } = useWalletClient();
  const {writeContract} =useWriteContract()


  const [targetAddress, setTargetAddress] = useState("");
  const [role, setRole] = useState<"DBM" | "HOUSE" | "SENATE" | "PRESIDENT" | "COA">("DBM");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);

  // Map string to enum index
  const roleMap = {
    DBM: 0,
    HOUSE: 1,
    SENATE: 2,
    PRESIDENT: 3,
    COA: 4,
  };

  const handleAssign = async () => {
    if (!signer) return alert("Connect your wallet first");
    if (!targetAddress) return alert("Enter a valid address");

    try {
      setLoading(true);
      const tx = await writeContract({
        address: NationalBudgetAddress,
        abi: NationalBudgetABI,
        functionName: "addAuthority",
        signerOrProvider: signer,
        args: [targetAddress, roleMap[role]],
      });

      ;
      setTxHash(tx);
      alert("Authority assigned successfully!");
      setTargetAddress("");
    } catch (err: any) {
      console.error(err);
      alert("Transaction failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded max-w-md mx-auto mt-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">Assign Authority Role</h2>
    <ConnectButton />

      <input
        type="text"
        placeholder="Wallet Address"
        value={targetAddress}
        onChange={(e) => setTargetAddress(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value as any)}
        className="border p-2 w-full mb-3 rounded"
      >
        <option value="DBM">DBM</option>
        <option value="HOUSE">HOUSE</option>
        <option value="SENATE">SENATE</option>
        <option value="PRESIDENT">PRESIDENT</option>
        <option value="COA">COA</option>
      </select>

      <button
        onClick={handleAssign}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Assigning..." : "Assign Role"}
      </button>

      {txHash && (
        <p className="mt-2 text-sm text-gray-600 break-all">
          Transaction Hash: {txHash}
        </p>
      )}
    </div>
  );
}
