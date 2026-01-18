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
  { id: 0, name: 'Quick Match', description: '1 round, winner takes all', icon: Timer, matches: '1_RND' },
  { id: 1, name: 'Best of Three', description: 'First to win 2 rounds', icon: Swords, matches: '3_RND' },
  { id: 2, name: 'Championship', description: 'First to win 3 rounds', icon: Trophy, matches: '5_RND' },
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

    const toastId = toast.loading('INITIALIZING...', { 
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
    <div className='bg-white w-full px-4 md:px-[5%] py-4 text-black space-y-8 md:space-y-12 overflow-x-hidden'>
      
      {/* GAME TYPE SELECTION */}
      <section className='space-y-4 md:space-y-6'>
        <div className='flex items-center gap-2 border-l-4 md:border-l-8 border-black pl-3 md:pl-4'>
            <Target size={18} className="md:w-5 md:h-5" />
            <h2 className='text-lg md:text-xl font-black uppercase italic tracking-tighter'>Select_Match_Type</h2>
        </div>
        
        <div className='grid gap-3 md:gap-4'>
          {GAME_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`group flex items-center p-3 md:p-5 border-4 transition-all text-left ${
                  isSelected
                    ? 'border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]'
                    : 'border-black bg-white text-black hover:bg-zinc-50'
                }`}
              >
                <div className={`p-2 md:p-3 border-2 shrink-0 ${isSelected ? 'border-white bg-white text-black' : 'border-black bg-zinc-100'}`}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className='ml-3 md:ml-5 flex-1 min-w-0'>
                  <h3 className='font-black uppercase italic text-sm md:text-lg leading-none truncate'>{type.name.replace(' ', '_')}</h3>
                  <p className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-1 truncate ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {type.description}
                  </p>
                </div>
                <span className={`text-[8px] md:text-[10px] font-black px-2 py-1 border-2 hidden sm:block shrink-0 ${isSelected ? 'border-white text-white' : 'border-black text-black'}`}>
                  {type.matches}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* STAKE INPUT */}
      <section className='space-y-4 md:space-y-6'>
        <div className='flex items-center gap-2 border-l-4 md:border-l-8 border-black pl-3 md:pl-4'>
            <Coins size={18} className="md:w-5 md:h-5" />
            <h2 className='text-lg md:text-xl font-black uppercase italic tracking-tighter'>Set_Asset_Stake</h2>
        </div>

        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-4 md:pl-5 flex items-center pointer-events-none'>
            <Terminal size={16} className='text-black md:w-[18px]' />
          </div>
          <input
            type='number'
            step='0.001'
            min='0'
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder='0.00'
            className='w-full pl-10 md:pl-14 pr-16 md:pr-20 py-4 md:py-6 bg-white border-4 border-black outline-none font-mono font-black text-xl md:text-2xl focus:bg-zinc-50 transition-colors placeholder:text-zinc-200'
          />
          <div className='absolute inset-y-0 right-0 pr-4 md:pr-6 flex items-center pointer-events-none'>
            <span className='font-black text-sm md:text-lg italic'>ETH</span>
          </div>
        </div>
        
        <div className='flex items-start md:items-center gap-2 p-3 bg-zinc-100 border-2 border-black border-dashed'>
          <Info size={12} className="text-black shrink-0 mt-0.5 md:mt-0" />
          <p className='text-[8px] md:text-[9px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-black'>
            Condition: Value must be {">"} 0.000 ETH for protocol execution.
          </p>
        </div>
      </section>

      {/* ACTION BUTTON */}
      <div className='pt-2'>
        <button
          onClick={handleCreateGame}
          disabled={!stakeAmount || isLoading || parseFloat(stakeAmount) <= 0}
          className={`w-full py-5 md:py-8 border-4 border-black font-black uppercase tracking-[0.2em] md:tracking-[0.5em] text-xs md:text-sm flex items-center justify-center gap-3 md:gap-4 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${
            !stakeAmount || parseFloat(stakeAmount) <= 0
              ? 'bg-zinc-100 text-zinc-300 border-zinc-200 cursor-not-allowed shadow-none'
              : 'bg-black text-white hover:bg-white hover:text-black'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className='w-5 h-5 md:w-6 md:h-6 animate-spin' />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <ChevronRight className='w-5 h-5 md:w-6 md:h-6' />
              <span>Deploy_Game_Node</span>
            </>
          )}
        </button>
      </div>

      {/* FOOTER SCHEMATIC */}
      <div className="pt-6 md:pt-8 border-t-2 border-black border-dotted opacity-30 font-mono text-[7px] md:text-[8px] flex flex-wrap justify-between gap-y-2 uppercase">
        <span>[AUTH_SIG_REQUIRED]</span>
        <span>[STAKE_LOCKED]</span>
        <span className="hidden xs:inline">[NETWORK_SIM_v1]</span>
      </div>
    </div>
  );
}