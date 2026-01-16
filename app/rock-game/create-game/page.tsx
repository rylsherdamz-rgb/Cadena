'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Coins, Swords, Timer, Info } from 'lucide-react';
import { parseEther } from 'viem';
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
} from 'wagmi';
import { abi, contractAddress } from '../../../constants/contractInfo';
import toast from 'react-hot-toast';
import { extractErrorMessages } from '@/utils/index';
import { useRouter } from 'next/navigation';

const GAME_TYPES = [
  { id: 0, name: 'Quick Match', description: 'Single round, winner takes all', icon: Timer, matches: '1 Round' },
  { id: 1, name: 'Best of Three', description: 'First to win 2 rounds', icon: Swords, matches: '3 Rounds' },
  { id: 2, name: 'Championship', description: 'First to win 3 rounds', icon: Trophy, matches: '5 Rounds' },
];

export default function CreateGame() {
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const router = useRouter();

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: 'GameCreated',
    onLogs(logs) {
      const firstLog = logs[0];
      if (firstLog && 'args' in firstLog && firstLog.args) {
        const createdGameID = (firstLog.args as { gameId?: bigint }).gameId;
        if (createdGameID !== undefined) {
          toast.success(`Game #${createdGameID.toString()} created`, { duration: 5000 });
          setTimeout(() => {
            router.push(`/game/${createdGameID.toString()}`);
          }, 2000);
        }
      }
    },
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const [selectedType, setSelectedType] = useState(0);
  const [stakeAmount, setStakeAmount] = useState('');

  const handleCreateGame = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;

    const toastId = toast.loading('Preparing to create game...', { icon: '⚔️', duration: 3000 });

    try {
      await writeContract({
        address: contractAddress,
        abi,
        functionName: 'createGame',
        args: [BigInt(selectedType)],
        value: parseEther(stakeAmount),
      });

      toast.loading('Waiting for transaction confirmation...', { id: toastId, icon: '⏳', duration: 3000 });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create game', { id: toastId, duration: 3000, icon: '❌' });
      console.error('Error creating game:', err);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      setSelectedType(0);
      setStakeAmount('');
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (error) {
      toast.error(extractErrorMessages(error?.message), { duration: 3000, icon: '❌' });
      console.log(error);
    }
  }, [error]);

  const isLoading = isPending || isConfirming;

  return (
    <div className=' bg-white px-[5%] w-full min-h-screen text-black py-10 '>
      <div className=''>
        <h2 className='text-lg font-semibold'>Select Game Type</h2>
        <div className='grid gap-3'>
          {GAME_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center p-3 rounded-lg border transition-all duration-200 ${
                  isSelected
                    ? 'border-black bg-gray-100'
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-black' : 'bg-gray-100'}`}>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-black'}`} />
                </div>
                <div className='ml-3 flex-1 text-left'>
                  <h3 className='font-medium'>{type.name}</h3>
                  <p className='text-sm text-gray-600'>{type.description}</p>
                </div>
                <span className='text-sm font-medium px-2 py-0.5 rounded-full border border-gray-300 bg-gray-50'>
                  {type.matches}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className='space-y-2'>
        <h2 className='text-lg font-semibold'>Set Stake Amount</h2>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Coins className='h-5 w-5 text-gray-400' />
          </div>
          <input
            type='number'
            step='0.001'
            min='0'
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder='Enter ETH amount'
            className='w-full pl-10 pr-12 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-black transition-colors'
          />
          <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
            <span className='text-gray-500'>ETH</span>
          </div>
        </div>
        <p className='flex items-center text-sm text-gray-500'>
          <Info className='w-4 h-4 mr-1' /> Stake must be greater than 0 ETH
        </p>
      </div>

      {/* Create Game Button */}
      <button
        onClick={handleCreateGame}
        disabled={!stakeAmount || isLoading || parseFloat(stakeAmount) <= 0}
        className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors ${
          !stakeAmount || parseFloat(stakeAmount) <= 0
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-black text-white hover:bg-gray-900'
        }`}
      >
        {isLoading ? (
          <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin' />
        ) : (
          <>
            <Swords className='w-5 h-5' />
            <span>Create Game</span>
          </>
        )}
      </button>
    </div>
  );
}
