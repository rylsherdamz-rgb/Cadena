"use client";

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { ElectionContractAddress, ELECTION_ABI } from "../../constants/ElectionContract";
import { encodeFunctionData, decodeFunctionResult } from "viem";
import { useRouter } from "next/navigation";

type Candidate = {
  id: number;
  name: string;
  party: string;
  position: number;
  voteCount: bigint;
};

export default function BallotPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedSenators, setSelectedSenators] = useState<number[]>([]);
  const [selectedParty, setSelectedParty] = useState<number | null>(null);

  const { writeAsync: voteAsync, isLoading: isVoting } = useWriteContract({
    mode: "recklesslyUnprepared",
  });

  const { data: count } = useReadContract({
    address: ElectionContractAddress as `0x${string}`,
    abi: ELECTION_ABI,
    functionName: "getCandidatesCount",
  });

  useEffect(() => {
    if (!count) return;
    const load = async () => {
      const arr: Candidate[] = [];
      for (let i = 0; i < Number(count); i++) {
        const res = await window.ethereum.request({
          method: "eth_call",
          params: [
            { to: ElectionContractAddress, data: encodeGetCandidate(i) },
            "latest",
          ],
        });
        const decoded = decodeCandidate(res);
        arr.push({
          id: i,
          name: decoded[0],
          party: decoded[1],
          position: Number(decoded[2]),
          voteCount: BigInt(decoded[3]),
        });
      }
      setCandidates(arr);
    };
    load();
  }, [count]);

  const toggleSenator = (id: number) => {
    if (selectedSenators.includes(id)) {
      setSelectedSenators(selectedSenators.filter((x) => x !== id));
    } else if (selectedSenators.length < 12) {
      setSelectedSenators([...selectedSenators, id]);
    }
  };

  const submitVote = async () => {
    if (!isConnected) return alert("Connect wallet first");
    if (!selectedParty) return alert("Select a party-list");
    if (selectedSenators.length === 0) return alert("Select at least 1 senator");

    await voteAsync({
      address: ElectionContractAddress as `0x${string}`,
      abi: ELECTION_ABI,
      functionName: "vote",
      args: [selectedSenators, selectedParty],
    });

    // pass selections to receipt page
    router.push(
      `/receipt?senators=${selectedSenators.join(",")}&party=${selectedParty}`
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 bg-white text-black">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">🗳️ Cast Your Vote</h1>
        <ConnectButton />
      </header>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Senators (Select up to 12)</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {candidates.filter(c => c.position === 2).map((c) => (
            <label
              key={c.id}
              className={`border p-4 flex justify-between items-center cursor-pointer ${
                selectedSenators.includes(c.id) ? "bg-black text-white" : ""
              }`}
            >
              <span>
                <p className="font-medium">{c.name}</p>
                <p className="text-sm">{c.party}</p>
              </span>
              <input
                type="checkbox"
                checked={selectedSenators.includes(c.id)}
                onChange={() => toggleSenator(c.id)}
                disabled={!selectedSenators.includes(c.id) && selectedSenators.length >= 12}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Party-List (Select 1)</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {candidates.filter(c => c.position === 3).map((c) => (
            <label
              key={c.id}
              className={`border p-4 flex justify-between items-center cursor-pointer ${
                selectedParty === c.id ? "bg-black text-white" : ""
              }`}
            >
              <span>
                <p className="font-medium">{c.name}</p>
                <p className="text-sm">{c.party}</p>
              </span>
              <input
                type="radio"
                name="party"
                checked={selectedParty === c.id}
                onChange={() => setSelectedParty(c.id)}
              />
            </label>
          ))}
        </div>
      </section>

      <button
        onClick={submitVote}
        disabled={isVoting}
        className="px-6 py-3 rounded bg-black text-white disabled:bg-gray-400"
      >
        Submit Vote
      </button>
    </div>
  );
}

/* ---------------- ABI Helpers ---------------- */
function encodeGetCandidate(id: number) {
  return encodeFunctionData({
    abi: ELECTION_ABI,
    functionName: "getCandidate",
    args: [BigInt(id)],
  });
}

function decodeCandidate(data: `0x${string}`) {
  return decodeFunctionResult({
    abi: ELECTION_ABI,
    functionName: "getCandidate",
    data,
  }) as readonly [string, string, number, bigint];
}
