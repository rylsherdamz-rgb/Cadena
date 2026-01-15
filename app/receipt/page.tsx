'use client';

import { useSearchParams } from 'next/navigation';
import html2canvas from 'html2canvas';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useReadContract, useReadContracts } from 'wagmi';
import { ElectionContractAddress, ELECTION_ABI } from '../constants/ElectionContract';

type Candidate = {
  id: number;
  name: string;
  party: string;
  position: number;
  voteCount: bigint;
};

export default function ReceiptPage() {
  const params = useSearchParams();

  // SAFELY PARSE PARAMS
  const senatorIds =
    params
      .get('senators')
      ?.split(',')
      .map((v) => Number(v))
      .filter((v) => !Number.isNaN(v)) ?? [];

  const partyId = Number(params.get('party'));

  /* ---------------- GET COUNT ---------------- */
  const { data: countData } = useReadContract({
    address: ElectionContractAddress,
    abi: ELECTION_ABI,
    functionName: 'getCandidatesCount',
  });

  const count = Number(countData ?? 0);

  /* ---------------- GET ALL CANDIDATES ---------------- */
  const { data } = useReadContracts({
    contracts: Array.from({ length: count }, (_, id) => ({
      address: ElectionContractAddress,
      abi: ELECTION_ABI,
      functionName: 'getCandidate',
      args: [id],
    })),
    query: { enabled: count > 0 },
  });

  const candidates: Candidate[] =
    data?.map((r: any, id: number) => {
      const c = r.result;
      return {
        id,
        name: c[0],
        party: c[1],
        position: Number(c[2]),
        voteCount: BigInt(c[3]),
      };
    }) ?? [];

  /* ---------------- FILTER USER VOTES ---------------- */
  const votedSenators = candidates.filter(
    (c) => c.position === 2 && senatorIds.includes(c.id)
  );

  const votedParty = candidates.find(
    (c) => c.position === 3 && c.id === partyId
  );

  /* ---------------- DOWNLOAD ---------------- */
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

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 bg-white text-black min-h-screen">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">✔ Vote Confirmed</h1>
        <ConnectButton />
      </header>

      <div id="receipt" className="border rounded p-6 bg-gray-50 mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Your Vote Summary
        </h2>

        <section className="mb-6">
          <h3 className="font-medium mb-2">Senators</h3>
          {votedSenators.length === 0 ? (
            <p>No senators selected</p>
          ) : (
            <ul className="list-disc ml-6">
              {votedSenators.map((s) => (
                <li key={s.id}>
                  {s.name} — {s.party}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mb-6">
          <h3 className="font-medium mb-2">Party-List</h3>
          {votedParty ? (
            <p>
              {votedParty.name} — {votedParty.party}
            </p>
          ) : (
            <p>No party-list selected</p>
          )}
        </section>

        <button
          onClick={downloadReceipt}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Download Receipt
        </button>
      </div>

      {/* LIVE COUNTS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Live Vote Counts
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {[...votedSenators, votedParty]
            .filter(Boolean)
            .map((c) => (
              <div key={c!.id} className="border p-4 rounded">
                <p className="font-medium">
                  {c!.name} ({c!.party})
                </p>
                <p>Votes: {c!.voteCount.toString()}</p>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
