'use client';

import { useMemo } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useAccount,
  useReadContract,
  useReadContracts,
} from 'wagmi';
import html2canvas from 'html2canvas';
import {
  ElectionContractAddress,
  ELECTION_ABI,
} from '../constants/ElectionContract';

type Candidate = {
  id: number;
  name: string;
  party: string;
  position: number;
  voteCount: bigint;
};

export default function ReceiptPage() {
  const { address, isConnected } = useAccount();

  /* ---------------- CHECK IF USER VOTED ---------------- */
  const { data: hasVoted } = useReadContract({
    address: ElectionContractAddress,
    abi: ELECTION_ABI,
    functionName: 'hasVoted',
    args: address ? [address] : undefined,
    watch: true,
    query: { enabled: !!address },
  });

  /* ---------------- USER SELECTIONS ---------------- */
  const { data: votedSenatorIds } = useReadContract({
    address: ElectionContractAddress,
    abi: ELECTION_ABI,
    functionName: 'getVotedSenators',
    args: address ? [address] : undefined,
    watch: true,
    query: { enabled: !!address && !!hasVoted },
  });

  const { data: votedPartyId } = useReadContract({
    address: ElectionContractAddress,
    abi: ELECTION_ABI,
    functionName: 'getVotedParty',
    args: address ? [address] : undefined,
    watch: true,
    query: { enabled: !!address && !!hasVoted },
  });

  /* ---------------- ALL CANDIDATES ---------------- */
  const { data: countData } = useReadContract({
    address: ElectionContractAddress,
    abi: ELECTION_ABI,
    functionName: 'getCandidatesCount',
    watch: true,
  });

  const count = Number(countData ?? 0);

  const { data: candidatesRaw } = useReadContracts({
    contracts: Array.from({ length: count }, (_, id) => ({
      address: ElectionContractAddress,
      abi: ELECTION_ABI,
      functionName: 'getCandidate',
      args: [id],
    })),
    watch: true,
    query: { enabled: count > 0 },
  });

  const candidates: Candidate[] = useMemo(() => {
    if (!candidatesRaw) return [];
    return candidatesRaw.map((r: any, id: number) => {
      const c = r.result;
      return {
        id,
        name: c[0],
        party: c[1],
        position: Number(c[2]),
        voteCount: BigInt(c[3]),
      };
    });
  }, [candidatesRaw]);

  /* ---------------- USER VOTED CANDIDATES ---------------- */
  const votedSenators = candidates.filter(
    (c) =>
      c.position === 2 &&
      votedSenatorIds?.includes(BigInt(c.id))
  );

  const votedParty = candidates.find(
    (c) =>
      c.position === 3 &&
      votedPartyId === BigInt(c.id)
  );

  /* ---------------- DOWNLOAD RECEIPT ---------------- */
  const downloadReceipt = async () => {
    const el = document.getElementById('receipt');
    if (!el) return;
    const canvas = await html2canvas(el);
    const blob = await new Promise<Blob | null>((r) =>
      canvas.toBlob(r)
    );
    if (!blob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'vote-receipt.png';
    link.click();
  };

  /* ---------------- UI STATES ---------------- */
  if (!isConnected) {
    return (
      <div className="p-10 text-center">
        <ConnectButton />
      </div>
    );
  }

  if (!hasVoted) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold">
          You have not voted yet
        </h2>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-6xl mx-auto py-10 px-4 bg-white text-black min-h-screen">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">✔ Vote Receipt</h1>
        <ConnectButton />
      </header>

      {/* -------- RECEIPT -------- */}
      <div
        id="receipt"
        className="border rounded p-6 bg-gray-50 mb-12"
      >
        <h2 className="text-xl font-semibold mb-4">
          Your Vote
        </h2>

        <section className="mb-6">
          <h3 className="font-medium mb-2">Senators</h3>
          <ul className="list-disc ml-6">
            {votedSenators.map((s) => (
              <li key={s.id}>
                {s.name} — {s.party}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="font-medium mb-2">Party-List</h3>
          {votedParty && (
            <p>
              {votedParty.name} — {votedParty.party}
            </p>
          )}
        </section>

        <button
          onClick={downloadReceipt}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Download Receipt
        </button>
      </div>

      {/* -------- LIVE RESULTS (ALL CANDIDATES) -------- */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Live Vote Counts
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {candidates.map((c) => {
            const isVoted =
              votedSenatorIds?.includes(BigInt(c.id)) ||
              votedPartyId === BigInt(c.id);

            return (
              <div
                key={c.id}
                className={`border p-4 rounded ${
                  isVoted ? 'border-green-600 bg-green-50' : ''
                }`}
              >
                <p className="font-medium">
                  {c.name} ({c.party})
                </p>
                <p className="text-sm text-gray-600">
                  Position: {c.position}
                </p>
                <p className="mt-1">
                  Votes: {c.voteCount.toString()}
                </p>
                {isVoted && (
                  <p className="text-green-700 text-sm mt-1">
                    ✔ You voted for this
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
