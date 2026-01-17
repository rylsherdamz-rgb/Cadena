'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Coins, Swords, Timer, Info, ChevronRight, Loader2, Target, Terminal } from 'lucide-react';
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
  { id: 0, name: 'Quick Match', description: 'Single round, winner takes all', icon: Timer, matches: '1_ROUND' },
  { id: 1, name: 'Best of Three', description: 'First to win 2 rounds', icon: Swords, matches: '3_ROUNDS' },
  { id: 2, name: 'Championship', description: 'First to win 3 rounds', icon: Trophy, matches: '5_ROUNDS' },
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
          toast.success(`NODE_ESTABLISHED: #${createdGameID.toString()}`, { 
            style: { border: '4px solid black', borderRadius: '0', fontWeight: 'bold' } 
          });
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

    const toastId = toast.loading('INITIALIZING_PROTOCOL...', { 
        style: { border: '4px solid black', borderRadius: '0' } 
    });

    try {
      await writeContract({
        address: contractAddress,
        abi,
        functionName: 'createGame',
        args: [BigInt(selectedType)],
        value: parseEther(stakeAmount),
      });
    } catch (err) {
      toast.error('EXECUTION_FAILED', { id: toastId });
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
      toast.error(extractErrorMessages(error?.message));
    }
  }, [error]);

  const isLoading = isPending || isConfirming;

  return (
    <div className='bg-white w-full px-[5%] py-1 text-black space-y-12'>
      
      {/* GAME TYPE SELECTION */}
      <section className='space-y-6'>
        <div className='flex items-center gap-2 border-l-8 border-black pl-4'>
            <Target size={20} color="#000" />
            <h2 className='text-xl font-black uppercase italic text-black tracking-tighter'>Select_Match_Type</h2>
        </div>
        
        <div className='grid gap-4'>
          {GAME_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`group flex items-center p-5 border-4 transition-all text-left ${
                  isSelected
                    ? 'border-black bg-black text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]'
                    : 'border-black bg-white text-black hover:bg-zinc-50'
                }`}
              >
                <div className={`p-3 border-2 ${isSelected ? 'border-white bg-white text-black' : 'border-black bg-zinc-100'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className='ml-5 flex-1'>
                  <h3 className='font-black uppercase italic text-lg leading-none'>{type.name.replace(' ', '_')}</h3>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {type.description}
                  </p>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 border-2 hidden md:block ${isSelected ? 'border-white text-white' : 'border-black text-black'}`}>
                  {type.matches}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* STAKE INPUT */}
      <section className='space-y-6'>
        <div className='flex items-center gap-2 border-l-8 border-black pl-4'>
            <Coins size={20} />
            <h2 className='text-xl font-black uppercase italic tracking-tighter'>Set_Asset_Stake</h2>
        </div>

        <div className='relative group'>
          <div className='absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none'>
            <Terminal size={18} className='text-black' />
          </div>
          <input
            type='number'
            step='0.001'
            min='0'
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder='0.00'
            className='w-full pl-14 pr-20 py-6 bg-white border-4 border-black outline-none font-mono font-black text-2xl focus:bg-zinc-50 transition-colors placeholder:text-zinc-200'
          />
          <div className='absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none'>
            <span className='font-black text-lg italic'>ETH</span>
          </div>
        </div>
        
        <div className='flex items-center gap-2 p-3 bg-zinc-100 border-2 border-black border-dashed'>
          <Info size={14} className="text-black" />
          <p className='text-[9px] font-black uppercase tracking-[0.2em] text-black'>
            Condition: Value must be {">"} 0.000 ETH for protocol execution.
          </p>
        </div>
      </section>

      {/* ACTION BUTTON */}
      <button
        onClick={handleCreateGame}
        disabled={!stakeAmount || isLoading || parseFloat(stakeAmount) <= 0}
        className={`w-full py-8 border-4 border-black font-black uppercase tracking-[0.5em] text-sm flex items-center justify-center gap-4 transition-all shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${
          !stakeAmount || parseFloat(stakeAmount) <= 0
            ? 'bg-zinc-100 text-zinc-300 border-zinc-200 cursor-not-allowed shadow-none'
            : 'bg-black text-white hover:bg-white hover:text-black'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className='w-6 h-6 animate-spin' />
            <span>Verifying_Order...</span>
          </>
        ) : (
          <>
            <ChevronRight className='w-6 h-6' />
            <span>Deploy_Game_Node</span>
          </>
        )}
      </button>

      {/* FOOTER SCHEMATIC */}
      <div className="pt-8 border-t-2 border-black border-dotted opacity-20 font-mono text-[8px] flex justify-between uppercase">
        <span>[AUTH_SIG_REQUIRED]</span>
        <span>[STAKE_LOCKED_IN_ESCROW]</span>
        <span>[NETWORK_MAINNET_SIM]</span>
      </div>
    </div>
  );
}