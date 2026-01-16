'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Users,
  RefreshCcw,
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

  const [activeGame, setActiveGame] = useState<Game>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<number>();
  const [refreshToken, setRefreshToken] = useState('');

  const account = useAccount();
  const userAddress = account.address || undefined;
  const isTxnLoading = isPending || isConfirming;

  const proofedSearchQuery = searchQuery || 0;

  const gameResult = useReadContract({
    abi,
    address: contractAddress,
    functionName: 'getGameById',
    args: [BigInt(proofedSearchQuery)],
    scopeKey: refreshToken,
  });

  const data = gameResult.data as Game | undefined;

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      setActiveGame(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGame = async (id?: bigint, stake?: bigint) => {
    const toastId = toast.loading('Preparing to join game...');
    try {
      await writeContract({
        address: contractAddress,
        abi,
        functionName: 'joinGame',
        args: [id],
        value: stake,
      });

      toast.loading('Waiting for confirmation...', {
        id: toastId,
        icon: '⏳',
        duration: 3000,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to join game', {
        id: toastId,
        duration: 3000,
      });
      console.error(err);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Game joined successfully 🎮', { duration: 3000 });
      setRefreshToken(Date.now().toString());
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (error) {
      toast.error(extractErrorMessages(error?.message), { duration: 3000 });
      console.error(error);
    }
  }, [error]);

  return (
    <ErrorBoundary fallback={<div className='text-center py-10'>Something went wrong</div>}>
      <div className='space-y-6 bg-white w-full min-h-screen text-black py-10 px-[5%]'>
        {/* Search */}
        <div className='flex gap-3'>
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input
              type='number'
              placeholder='Search game by ID'
              value={searchQuery}
              onChange={(e) => setSearchQuery(Number(e.target.value))}
              className='w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black transition'
            />
          </div>

          <button
            onClick={handleSearch}
            className='p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition'
          >
            <RefreshCcw
              className={`w-5 h-5 text-gray-600 ${
                isLoading ? 'animate-spin' : ''
              }`}
            />
          </button>
        </div>

        <div className='space-y-4'>
          <h2 className='text-lg font-semibold'>Search Result</h2>

          {!activeGame ? (
            <div className='text-center py-10 border border-gray-200 rounded-lg'>
              <Users className='w-12 h-12 text-gray-300 mx-auto mb-3' />
              <p className='text-gray-500'>No game found</p>
              <button
                onClick={handleSearch}
                className='mt-4 text-sm text-black underline'
              >
                Refresh
              </button>
            </div>
          ) : (
            <GameSearchCard
              game={data}
              isLoading={isTxnLoading}
              onJoinGame={() =>
                handleJoinGame(data?.gameId, data?.stake)
              }
              userAddress={userAddress}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
