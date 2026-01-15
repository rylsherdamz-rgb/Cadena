'use client';

import { useMemo, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useAccount,
  useReadContract,
  useReadContracts,
} from 'wagmi';
import html2canvas from 'html2canvas';
import { ElectionContractAddress, ELECTION_ABI } from '../constants/ElectionContract';

type Candidate = {
  id: number;
  name: string;
  party: string;
  position: number; // 2 = Senator, 3 = Partylist
  voteCount: bigint;
};

export default function ReceiptPage() {
  const { address, isConnected } = useAccount();
  const [showAllSenators, setShowAllSenators] = useState(false);

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

  /* ---------------- FILTER VOTED CANDIDATES ---------------- */
  const votedSenators = candidates.filter(
    (c) => c.position === 2 && votedSenatorIds?.includes(BigInt(c.id))
  );

  const votedParty = candidates.find(
    (c) => c.position === 3 && votedPartyId === BigInt(c.id)
  );

  /* ---------------- DOWNLOAD RECEIPT ---------------- */
  const downloadReceipt = async () => {
    const el = document.getElementById('receipt');
    if (!el) return;
    const canvas = await html2canvas(el);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r));
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
        <h2 className="text-xl font-semibold">You have not voted yet</h2>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  const senators = candidates.filter((c) => c.position === 2);
  const partylists = candidates.filter((c) => c.position === 3);

  const displayedSenators = showAllSenators ? senators : senators.slice(0, 12);

  return (
    <div className="w-full px-[5%] mx-auto py-10  bg-white text-black min-h-screen">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">✔ Vote Receipt</h1>
        <ConnectButton />
      </header>

      {/* -------- RECEIPT -------- */}
      <div id="receipt" className="border rounded p-6 bg-gray-50 mb-12 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Vote</h2>

        <section className="mb-6">
          <h3 className="font-medium mb-2">Senators</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {votedSenators.map((s) => (
              <div
                key={s.id}
                className="flex items-center space-x-3 p-2 border rounded bg-green-50"
              >
                <img
                  src={`/candidateImages/${s.name.toUpperCase().replace(/ /g, "-")}.webp`}
                  alt={s.name}
                  className="w-12 h-12 object-cover rounded-full border"
                />
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-sm text-gray-600">{s.party}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h3 className="font-medium mb-2">Party-List</h3>
          {votedParty && (
            <div className="flex items-center space-x-3 p-2 border rounded bg-green-50 w-fit">
              <p className="font-medium">{votedParty.name}</p>
              <span className="text-sm text-gray-600">({votedParty.party})</span>
            </div>
          )}
        </section>

        <button
          onClick={downloadReceipt}
          className="px-4 py-2 bg-black text-white rounded shadow-md hover:bg-gray-900"
        >
          Download Receipt
        </button>
      </div>

      {/* -------- LIVE RESULTS -------- */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Live Vote Counts</h2>

        {/* Senators */}
        <h3 className="text-lg font-medium mb-2">Senators</h3>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {displayedSenators.map((c) => {
            const isVoted = votedSenatorIds?.includes(BigInt(c.id));
            return (
              <div
                key={c.id}
                className={`flex items-center space-x-3 p-4 border rounded shadow-sm ${
                  isVoted ? 'bg-green-50 border-green-600' : ''
                }`}
              >
                <img
                  src={`/candidateImages/${c.name.toUpperCase().replace(/ /g, "-")}.webp`}
                  alt={c.name}
                  className="w-16 h-16 object-cover rounded-full border"
                />
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-gray-600">{c.party}</p>
                  <p className="mt-1 font-semibold">Votes: {c.voteCount.toString()}</p>
                  {isVoted && (
                    <p className="text-green-700 text-sm mt-1">✔ You voted for this</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {senators.length > 12 && (
          <button
            onClick={() => setShowAllSenators(!showAllSenators)}
            className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            {showAllSenators ? 'Show Less' : `View All (${senators.length})`}
          </button>
        )}

        {/* Party-List */}
        <h3 className="text-lg font-medium mb-2">Party-List</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {partylists.map((c) => {
            const isVoted = votedPartyId === BigInt(c.id);
            return (
              <div
                key={c.id}
                className={`flex items-center space-x-3 p-4 border rounded shadow-sm ${
                  isVoted ? 'bg-green-50 border-green-600' : ''
                }`}
              >
                <p className="font-medium">{c.name}</p>
                <span className="text-sm text-gray-600">({c.party})</span>
                <p className="ml-auto font-semibold">Votes: {c.voteCount.toString()}</p>
                {isVoted && (
                  <p className="text-green-700 text-sm ml-2">✔ You voted</p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
