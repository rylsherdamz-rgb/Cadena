'use client';

import { useState, useMemo } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { ElectionContractAddress, ELECTION_ABI } from '../constants/ElectionContract';
import toast from 'react-hot-toast';

type Candidate = {
  id: number;
  name: string;
  party: string;
  position: number; // 2 = Senator, 3 = Partylist
  voteCount: bigint;
};

export default function BallotPage() {
  const { address, isConnected } = useAccount();

  const [selectedSenators, setSelectedSenators] = useState<number[]>([]);
  const [selectedParty, setSelectedParty] = useState<number | null>(null);
  const [showAllSenators, setShowAllSenators] = useState(false);

  /* ---------------- CHECK IF USER ALREADY VOTED ---------------- */
  const { data: hasVoted } = useReadContract({
    address: ElectionContractAddress,
    abi: ELECTION_ABI,
    functionName: 'hasVoted',
    args: [address!],
    query: { enabled: !!address },
  });

  /* ---------------- GET TOTAL CANDIDATES ---------------- */
  const { data: countData } = useReadContract({
    address: ElectionContractAddress,
    abi: ELECTION_ABI,
    functionName: 'getCandidatesCount',
  });

  const count = Number(countData ?? 0);

  /* ---------------- FETCH ALL CANDIDATES ---------------- */
  const { data: candidatesData } = useReadContracts({
    contracts: Array.from({ length: count }, (_, id) => ({
      address: ElectionContractAddress,
      abi: ELECTION_ABI,
      functionName: 'getCandidate',
      args: [id],
    })),
    query: { enabled: count > 0 },
  });

  const candidates: Candidate[] = useMemo(() => {
    if (!candidatesData) return [];
    return candidatesData.map((r: any, id: number) => {
      const c = r.result;
      return {
        id,
        name: c[0],
        party: c[1],
        position: Number(c[2]),
        voteCount: BigInt(c[3]),
      };
    });
  }, [candidatesData]);

  const senators = candidates.filter((c) => c.position === 2);
  const partyLists = candidates.filter((c) => c.position === 3);

  /* ---------------- VOTE TRANSACTION ---------------- */
  const { data: txData, writeContract } = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txData?.hash,
  });

  const toggleSenator = (id: number) => {
    if (hasVoted) return;
    setSelectedSenators((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 12
        ? [...prev, id]
        : prev
    );
  };

  const submitVote = async () => {
    if (!isConnected) return toast.error('Connect wallet first');
    if (hasVoted) return toast.error('You have already voted');
    if (!selectedParty) return toast.error('Select a party-list');
    if (selectedSenators.length === 0)
      return toast.error('Select at least 1 senator');

    try {
      await writeContract({
        address: ElectionContractAddress,
        abi: ELECTION_ABI,
        functionName: 'voteBatch',
        args: [selectedSenators, selectedParty],
      });
      toast.success('Vote submitted successfully!');
    } catch (err: any) {
      toast.error(err?.shortMessage || err?.message || 'Transaction failed');
    }
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="w-full px-[5%] bg-white text-black mx-auto py-10 px-4 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 md:mb-0">
          🗳️ Cast Your Vote
        </h1>
        <ConnectButton />
      </header>

      {hasVoted && (
        <div className="mb-6 p-4 rounded bg-green-100 text-green-800 font-medium text-center">
          ✅ You have already voted. Thank you!
        </div>
      )}

      {/* ---------------- SENATORS ---------------- */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Senators (Select up to 12)</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {(showAllSenators ? senators : senators.slice(0, 12)).map((c) => (
            <label
              key={c.id}
              className={`border p-4 rounded-lg flex items-center space-x-4 cursor-pointer transition-all hover:shadow-lg ${
                selectedSenators.includes(c.id) ? 'bg-black text-white' : 'bg-white'
              } ${hasVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* Candidate Image */}
             <img
  src={`/candidateImages/${c.name.toUpperCase().replace(/ /g, "-")}.webp`}
  alt={c.name}
  className="w-16 h-16 object-cover rounded-full border"
/>
 
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-gray-600">{c.party}</p>
              </div>
              <input
                type="checkbox"
                className="ml-auto"
                disabled={!!hasVoted}
                checked={selectedSenators.includes(c.id)}
                onChange={() => toggleSenator(c.id)}
              />
            </label>
          ))}
        </div>

        {senators.length > 12 && (
          <button
            onClick={() => setShowAllSenators(!showAllSenators)}
            className="mt-4 text-blue-600 font-semibold hover:underline"
          >
            {showAllSenators ? 'Show Less' : 'Show All'}
          </button>
        )}
      </section>

      {/* ---------------- PARTY-LIST ---------------- */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Party-List (Select 1)</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {partyLists.map((c) => (
            <label
              key={c.id}
              className={`border p-4 rounded-lg flex items-center space-x-4 cursor-pointer transition-all hover:shadow-lg ${
                selectedParty === c.id ? 'bg-black text-white' : 'bg-white'
              } ${hasVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <img
                src={`/images/partylist/${c.id}.png`}
                alt={c.name}
                className="w-16 h-16 object-cover rounded-full border"
              />
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-gray-600">{c.party}</p>
              </div>
              <input
                type="radio"
                name="party"
                className="ml-auto"
                disabled={!!hasVoted}
                checked={selectedParty === c.id}
                onChange={() => setSelectedParty(c.id)}
              />
            </label>
          ))}
        </div>
      </section>

      <button
        onClick={submitVote}
        disabled={hasVoted || (txData && !isConfirmed)}
        className="px-6 py-3 rounded bg-black text-white disabled:bg-gray-400 hover:bg-gray-900 transition"
      >
        {hasVoted
          ? 'You already voted'
          : txData && !isConfirmed
          ? 'Submitting...'
          : 'Submit Vote'}
      </button>
    </div>
  );
}
