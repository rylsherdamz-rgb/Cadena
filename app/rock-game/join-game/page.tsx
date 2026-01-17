'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Users,
  RefreshCcw,
  Terminal,
  Radar,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { abi, contractAddress } from '../../../constants/contractInfo';
import GameSearchCard from '@/components/GameSearchCard';
import toast from 'react-hot-toast';
import { extractErrorMessages } from '@/utils/index';
import { Game } from '@/utils/RockContractType';
import { ErrorBoundary } from 'react-error-boundary';

export default function JoinGame() {
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshToken, setRefreshToken] = useState('');

  const account = useAccount();
  const userAddress = account.address || undefined;
  const isTxnLoading = isPending || isConfirming;

  // READ CONTRACT HOOK
  const { data: gameData, isFetching, refetch } = useReadContract({
    abi,
    address: contractAddress,
    functionName: 'getGameById',
    args: [searchQuery ? BigInt(searchQuery) : BigInt(0)],
    query: {
      enabled: !!searchQuery,
    }
  });

  const handleSearch = async () => {
    if (!searchQuery) {
        toast.error("ENTER_VALID_NODE_ID");
        return;
    }
    const result = await refetch();
    if (result.data) {
        setActiveGame(result.data as Game);
        toast.success("NODE_DETECTED", { style: { border: '4px solid black', borderRadius: '0' } });
    } else {
        setActiveGame(null);
        toast.error("NODE_NOT_FOUND");
    }
  };

  const handleJoinGame = async (id?: bigint, stake?: bigint) => {
    const toastId = toast.loading('UPLINKING_TO_GAME...');
    try {
      await writeContract({
        address: contractAddress,
        abi,
        functionName: 'joinGame',
        args: [id],
        value: stake,
      });
    } catch (err) {
      toast.error('UPLINK_FAILED', { id: toastId });
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      toast.success('PEER_CONNECTION_ESTABLISHED');
      setRefreshToken(Date.now().toString());
    }
  }, [isConfirmed]);

  return (
    <ErrorBoundary fallback={
        <div className='p-10 border-4 border-red-600 bg-red-50 text-red-600 font-black uppercase italic'>
            Critical_System_Failure: Check_Connection
        </div>
    }>
      <div className='space-y-12 px-[5%] py-1 bg-white w-full min-h-screen text-black'>
        
        {/* SEARCH BAR SECTION */}
        <section className="space-y-6">
            <div className='flex items-center gap-2 border-l-8 border-black pl-4'>
                <Radar size={20} />
                <h2 className='text-xl font-black uppercase italic tracking-tighter'>Scan_Network_Nodes</h2>
            </div>

            <div className='flex flex-col md:flex-row gap-4'>
                <div className='flex-1 relative group'>
                    <div className='absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none'>
                        <Terminal size={18} className='text-black' />
                    </div>
                    <input
                        type='number'
                        placeholder='INPUT_NODE_ID_...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='w-full pl-14 pr-4 py-6 bg-white border-4 border-black outline-none font-mono font-black text-xl focus:bg-zinc-50 transition-colors placeholder:text-zinc-200'
                    />
                </div>

                <button
                    onClick={handleSearch}
                    disabled={isFetching}
                    className='px-8 py-6 bg-black text-white border-4 border-black hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1 disabled:bg-zinc-400'
                >
                    <Search size={24} className={isFetching ? 'animate-pulse' : ''} />
                    <span className="font-black uppercase tracking-widest text-sm italic">Execute_Scan</span>
                </button>
            </div>
        </section>

        {/* RESULTS SECTION */}
        <section className='space-y-6'>
          <h2 className='text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400'>Detected_Logs</h2>

          {!activeGame ? (
            <div className='py-24 border-4 border-black border-dotted flex flex-col items-center justify-center text-center space-y-4'>
              <Users size={48} className='text-zinc-200' />
              <div className="space-y-1">
                <p className='font-black uppercase italic text-xl'>No_Active_Nodes_Found</p>
                <p className='text-[10px] font-bold text-zinc-400 uppercase tracking-widest'>Enter a Node ID to ping the contract</p>
              </div>
            </div>
          ) : (
            <div className="relative group">
                <div className="absolute -top-3 left-6 bg-black text-white px-3 py-1 text-[10px] font-black uppercase italic z-10">
                    Active_Signal_Match
                </div>
                <div className="border-4 border-black p-2 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                    <GameSearchCard
                        game={activeGame}
                        isLoading={isTxnLoading}
                        onJoinGame={() => handleJoinGame(activeGame?.gameId, activeGame?.stake)}
                        userAddress={userAddress}
                    />
                </div>
                
                {/* Visual Metadata Decorations */}
                <div className="mt-6 flex gap-4 overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-1 flex-1 bg-black opacity-10" />
                    ))}
                </div>
            </div>
          )}
        </section>

        {/* REFRESH PROTOCOL */}
        <div className="flex justify-center pt-8">
            <button 
                onClick={() => setRefreshToken(Date.now().toString())}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-black transition-colors"
            >
                <RefreshCcw size={14} className={isFetching ? 'animate-spin' : ''} />
                Sync_Network_Clock
            </button>
        </div>
      </div>
    </ErrorBoundary>
  );
}