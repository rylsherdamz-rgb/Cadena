'use client';

import { useState } from 'react';
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

  /* --------------------------------------------------
   * 1. CHECK IF USER ALREADY VOTED
   * -------------------------------------------------- */
  const { data: hasVoted, isPending: isCheckingVote } = useReadContract({
    address: ElectionContractAddress,
    abi: ELECTION_ABI,
    functionName: 'hasVoted',
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  /* --------------------------------------------------
   * 2. GET TOTAL CANDIDATES
   * -------------------------------------------------- */
  const { data: countData, isPending: isCountPending } = useReadContract({
    address: ElectionContractAddress,
    abi: ELECTION_ABI,
    functionName: 'getCandidatesCount',
  });

  const count = Number(countData ?? 0);

  /* --------------------------------------------------
   * 3. FETCH ALL CANDIDATES (BATCH READ)
   * -------------------------------------------------- */
  const { data: candidatesData, isPending: isCandidatesPending } =
    useReadContracts({
      contracts: Array.from({ length: count }, (_, id) => ({
        address: ElectionContractAddress,
        abi: ELECTION_ABI,
        functionName: 'getCandidate',
        args: [id],
      })),
      query: {
        enabled: count > 0,
      },
    });

  const candidates: Candidate[] =
    candidatesData?.map((res: any, id: number) => {
      const c = res.result;
      return {
        id,
        name: c[0],
        party: c[1],
        position: Number(c[2]),
        voteCount: BigInt(c[3]),
      };
    }) ?? [];

  /* --------------------------------------------------
   * 4. VOTE TRANSACTION
   * -------------------------------------------------- */
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
    if (selectedParty === null) return toast.error('Select a party-list');
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

  /* --------------------------------------------------
   * 5. LOADING STATE
   * -------------------------------------------------- */
    return (
    <div className="max-w-5xl mx-auto py-10 px-4 bg-white text-black min-h-screen">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">🗳️ Cast Your Vote</h1>
        <ConnectButton />
      </header>

      {hasVoted as boolean && (
        <div className="mb-6 p-4 rounded bg-gray-200 text-center font-medium">
          ✅ You have already voted. Thank you!
        </div>
      )}

      {/* Senators */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">
          Senators (Select up to 12)
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {candidates
            .filter((c) => c.position === 2)
            .map((c) => (
              <label
                key={c.id}
                className={`border p-4 flex justify-between items-center cursor-pointer rounded ${
                  selectedSenators.includes(c.id)
                    ? 'bg-black text-white'
                    : ''
                } ${hasVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm">{c.party}</p>
                </span>
                <input
                  type="checkbox"
                  disabled={hasVoted}
                  checked={selectedSenators.includes(c.id)}
                  onChange={() => toggleSenator(c.id)}
                />
              </label>
            ))}
        </div>
      </section>

      {/* Party-List */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Party-List (Select 1)</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {candidates
            .filter((c) => c.position === 3)
            .map((c) => (
              <label
                key={c.id}
                className={`border p-4 flex justify-between items-center cursor-pointer rounded ${
                  selectedParty === c.id ? 'bg-black text-white' : ''
                } ${hasVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm">{c.party}</p>
                </span>
                <input
                  type="radio"
                  name="party"
                  disabled={hasVoted}
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
        className="px-6 py-3 rounded bg-black text-white disabled:bg-gray-400"
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
