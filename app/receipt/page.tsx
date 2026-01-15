"use client";

import { useSearchParams } from "next/navigation";
import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract } from "wagmi";
import { ElectionContractAddress, ELECTION_ABI } from "../../constants/ElectionContract";

type Candidate = { id: number; name: string; party: string; position: number; voteCount: bigint };

export default function ReceiptPage() {
  const params = useSearchParams();
  const senatorParam = params.get("senators") || "";
  const partyParam = params.get("party") || "";

  const [senators, setSenators] = useState<Candidate[]>([]);
  const [partyList, setPartyList] = useState<Candidate | null>(null);

  const selectedSenatorsIds = senatorParam.split(",").map(Number);
  const selectedPartyId = Number(partyParam);

  const { data: count } = useReadContract({
    address: ElectionContractAddress as `0x${string}`,
    abi: ELECTION_ABI,
    functionName: "getCandidatesCount",
  });

  useEffect(() => {
    if (!count) return;
    const load = async () => {
      const arr: Candidate[] = [];
      let party: Candidate | null = null;
      for (let i = 0; i < Number(count); i++) {
        const res = await window.ethereum.request({
          method: "eth_call",
          params: [{ to: ElectionContractAddress, data: encodeGetCandidate(i) }, "latest"],
        });
        const decoded = decodeCandidate(res);
        const candidate: Candidate = {
          id: i,
          name: decoded[0],
          party: decoded[1],
          position: Number(decoded[2]),
          voteCount: BigInt(decoded[3]),
        };
        if (selectedSenatorsIds.includes(i)) arr.push(candidate);
        if (selectedPartyId === i) party = candidate;
      }
      setSenators(arr);
      setPartyList(party);
    };
    load();
  }, [count]);

  const downloadReceipt = async () => {
    const element = document.getElementById("receipt");
    if (!element) return;
    const canvas = await html2canvas(element);
    canvas.toBlob((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob!);
      link.download = "vote-receipt.png";
      link.click();
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 bg-white text-black">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">✔ Vote Confirmed</h1>
        <ConnectButton />
      </header>

      <div id="receipt" className="p-6 border rounded bg-gray-50 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Selected Candidates</h2>

        <section className="mb-4">
          <h3 className="font-medium mb-2">Senators:</h3>
          <ul>
            {senators.map((s) => (
              <li key={s.id}>{s.name} - {s.party}</li>
            ))}
          </ul>
        </section>

        <section className="mb-4">
          <h3 className="font-medium mb-2">Party-List:</h3>
          <p>{partyList?.name} - {partyList?.party}</p>
        </section>

        <button
          onClick={downloadReceipt}
          className="mt-4 px-4 py-2 bg-black text-white rounded"
        >
          Download Receipt
        </button>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Live Vote Counts</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[...senators, partyList!].map((c) => (
            <div key={c.id} className="border p-4 rounded">
              <p className="font-medium">{c.name} ({c.party})</p>
              <p>Votes: {c.voteCount.toString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import { encodeFunctionData, decodeFunctionResult } from "viem";

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
