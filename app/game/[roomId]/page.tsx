'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Updated Import
import { formatEther } from 'viem';
import {
  Trophy,
  Timer,
  Gamepad2,
  Swords,
  Users,
  Coins,
  Crown,
  CircleDot,
  Clock,
  Play,
  Terminal,
  Activity,
  History,
  Zap
} from 'lucide-react';
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi';
import { abi, contractAddress } from '@/constants/contractInfo';
import { extractErrorMessages } from '@/utils/index';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Game, MoveType } from '@/utils/RockContractType';
import { ErrorBoundary } from 'react-error-boundary';

const GameInterface = () => {
  const [refreshData, setRefreshData] = useState('');
  const router = useRouter();
  const params = useParams(); // Hook to get [roomId]
  const account = useAccount();
  
  // roomId corresponds to the [roomId] folder name
  const roomId = params?.roomId as string;
  const proofedGamedId = Number(roomId) || 0;

  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const gamesIdResult = useReadContract({
    abi,
    address: contractAddress,
    functionName: 'getGameById',
    args: [BigInt(proofedGamedId)],
    query: {
      enabled: !!roomId,
      refetchInterval: 5000, // Fallback polling
    }
  });

  // Event Listeners for Real-time UI updates
  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: 'PlayerMoved',
    onLogs() {
      setRefreshData(Date.now().toString());
      toast.success(`LEDGER_UPDATED`, { 
        style: { border: '4px solid black', borderRadius: '0' } 
      });
    },
  });

  const [selectedMove, setSelectedMove] = useState<MoveType | null>(null);
  const [playerMove, setPlayerMove] = useState<number>();
  
  const gameDetails = gamesIdResult.data as Game;
  const userAddress = account.address;
  const pending = isPending || isConfirming;
  const gameEnded = gameDetails && !gameDetails.isActive && Number(gameDetails.roundsPlayed) > 0;

  const handleMakeMove = async () => {
    if (!playerMove) return;
    try {
      writeContract({
        address: contractAddress,
        abi,
        functionName: 'makeMove',
        args: [BigInt(proofedGamedId), playerMove],
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      setSelectedMove(null);
      setPlayerMove(undefined);
    }
  }, [isConfirmed]);

  if (!gameDetails) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-white p-6'>
        <div className="border-8 border-black p-8 animate-pulse shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <Terminal className='w-12 h-12 md:w-16 md:h-16 text-black mb-4' />
            <h2 className='text-lg md:text-2xl font-black uppercase italic tracking-tighter'>SYNCING_PROTOCOL...</h2>
        </div>
      </div>
    );
  }

  // Helper for layout logic
  const gameType = (() => {
    switch (Number(gameDetails.gameType)) {
      case 0: return { name: 'Quick_Match', rounds: 1, icon: <Gamepad2 /> };
      case 1: return { name: 'Best_Of_3', rounds: 3, icon: <Swords /> };
      case 2: return { name: 'Championship', rounds: 5, icon: <Crown /> };
      default: return { name: 'Unknown', rounds: 0, icon: <CircleDot /> };
    }
  })();

  const isPlayerTurn = gameDetails.lastPlayerMove !== userAddress && !gameEnded;

  return (
    <ErrorBoundary fallback={<div className="p-10 font-black">CRITICAL_UI_ERROR</div>}>
      <div className='min-h-screen bg-white text-black p-4 md:p-8 font-sans overflow-x-hidden'>
        <div className='max-w-5xl mx-auto space-y-6'>
          
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-black pb-6 gap-4">
            <div className="flex items-center gap-4">
               <div className="bg-black text-white p-3 shrink-0">
                 {gameType.icon}
               </div>
               <div className="min-w-0">
                 <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter truncate">{gameType.name}</h1>
                 <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">NODE_ID: #{proofedGamedId}</p>
               </div>
            </div>
            
            <div className="flex items-center self-start md:self-auto gap-2 border-4 border-black px-4 py-2 bg-zinc-50 font-black uppercase text-[10px]">
               <Activity className={gameDetails.isActive ? "text-green-600" : "text-red-600"} size={14} />
               {gameDetails.isActive ? "System_Online" : "Terminated"}
               <span className="mx-2 text-zinc-300">|</span>
               Round {Number(gameDetails.roundsPlayed) + 1}/{gameType.rounds}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            
            {/* STATS PANEL */}
            <div className="lg:col-span-4 space-y-6">
               <div className="border-4 border-black p-6 bg-zinc-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-2 mb-2 text-zinc-500">
                    <Coins size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Stake_Escrow</span>
                  </div>
                  <div className="text-2xl md:text-3xl font-black italic">{formatEther(gameDetails.stake)} ETH</div>
               </div>

               <div className="border-4 border-black divide-y-4 divide-black">
                  {gameDetails.players.map((player, index) => (
                    <div key={player} className={`p-4 flex justify-between items-center ${player === userAddress ? 'bg-white' : 'bg-zinc-50'}`}>
                       <div className="flex items-center gap-3 min-w-0">
                         <div className={`p-2 border-2 border-black shrink-0 ${player === userAddress ? 'bg-black text-white' : 'bg-white'}`}>
                           <Users size={16} />
                         </div>
                         <div className="truncate">
                            <p className="text-[9px] font-black text-zinc-400 uppercase">Operator_0{index + 1}</p>
                            <p className="font-mono text-xs font-bold truncate">
                                {player === userAddress ? 'YOU' : `${player.slice(0, 6)}...${player.slice(-4)}`}
                            </p>
                         </div>
                       </div>
                       <div className="text-3xl md:text-4xl font-black italic ml-2">{gameDetails.scores[index].toString()}</div>
                    </div>
                  ))}
               </div>
            </div>

            {/* ACTION PANEL */}
            <div className="lg:col-span-8">
               <div className="h-full border-4 border-black bg-white p-5 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                  
                  {gameEnded ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10">
                        <ResultDisplay gameDetails={gameDetails} userAddress={userAddress} />
                        <Link href="/game" className="mt-8 inline-flex items-center gap-3 bg-black text-white px-8 py-4 font-black uppercase tracking-widest hover:invert transition-all">
                          <Play size={18} /> New_Session
                        </Link>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="flex items-center gap-3">
                        <Zap size={20} fill="black" />
                        <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">
                          {isPlayerTurn ? 'SELECT_TRANSMISSION' : 'PEER_PROCESSING...'}
                        </h2>
                      </div>

                      {isPlayerTurn ? (
                        <div className="space-y-6 md:space-y-10">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {(['Rock', 'Paper', 'Scissors'] as MoveType[]).map((move) => (
                              <button
                                key={move}
                                onClick={() => {
                                    setSelectedMove(move);
                                    setPlayerMove(move === 'Rock' ? 1 : move === 'Paper' ? 2 : 3);
                                }}
                                className={`
                                  flex flex-col items-center justify-center p-6 md:p-8 border-4 border-black transition-all
                                  ${selectedMove === move ? 'bg-black text-white shadow-none translate-y-1' : 'bg-white hover:bg-zinc-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}
                                `}
                              >
                                <span className="text-4xl md:text-5xl mb-2">
                                  {move === 'Rock' ? '🗿' : move === 'Paper' ? '📄' : '✂️'}
                                </span>
                                <span className="font-black uppercase italic text-xs md:text-sm">{move}</span>
                              </button>
                            ))}
                          </div>

                          <button
                            onClick={handleMakeMove}
                            disabled={pending || !playerMove}
                            className="w-full py-5 md:py-6 border-4 border-black bg-black text-white font-black uppercase italic text-lg md:text-xl tracking-widest hover:bg-white hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 disabled:opacity-20"
                          >
                            {pending ? 'TRANSMITTING...' : 'CONFIRM_MOVE_BLOCK'}
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 md:py-24 border-4 border-dashed border-zinc-200">
                          <Clock size={40} className="animate-spin mb-4 text-zinc-300" />
                          <p className="font-black uppercase italic tracking-widest text-zinc-400 text-xs text-center">Waiting_For_Peer_Signature</p>
                        </div>
                      )}
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Sub-components for cleaner logic
const ResultDisplay = ({ gameDetails, userAddress }: { gameDetails: Game, userAddress?: string }) => {
    const pIndex = gameDetails.players.indexOf(userAddress as `0x${string}`);
    const myScore = Number(gameDetails.scores[pIndex]);
    const opScore = Number(gameDetails.scores[1 - pIndex]);

    if (myScore > opScore) return <h2 className="text-4xl md:text-6xl font-black italic uppercase underline decoration-green-500 decoration-8">Victory</h2>;
    if (myScore < opScore) return <h2 className="text-4xl md:text-6xl font-black italic uppercase underline decoration-red-500 decoration-8">Defeat</h2>;
    return <h2 className="text-4xl md:text-6xl font-black italic uppercase underline decoration-yellow-500 decoration-8">Draw</h2>;
};

export default GameInterface;