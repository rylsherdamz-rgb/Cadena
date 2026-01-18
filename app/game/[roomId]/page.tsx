'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { formatEther } from 'viem';
import {
  Trophy,
  Timer,
  AlertCircle,
  Gamepad2,
  Swords,
  Users,
  Coins,
  ArrowLeftRight,
  CheckCircle2,
  Circle,
  Crown,
  GamepadIcon,
  CircleDot,
  Clock,
  X,
  Equal,
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
import { Game, MoveColor, MoveType } from '@/utils/RockContractType';
import { ErrorBoundary } from 'react-error-boundary';

const GameInterface = () => {
  const [refreshData, setRefreshData] = useState('');
  const router = useRouter();
  const account = useAccount();
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const { gameId } = router.query;
  const proofedGamedId = Number(gameId) || 0;

  const gamesIdResult = useReadContract({
    abi,
    address: contractAddress,
    functionName: 'getGameById',
    args: [BigInt(Number(proofedGamedId))],
    scopeKey: refreshData,
  });

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: 'PlayerMoved',
    onLogs(logs: any) {
      if (logs) {
        setRefreshData(Date.now().toString());
        const player = logs[0]?.args?.player;
        if (player === account.address) {
          toast.success(`DATA_PACKET_SENT`, { duration: 3000 });
        } else {
          toast.success(`PEER_MOVE_DETECTED`, { duration: 3000 });
        }
      }
    },
  });

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: 'GameJoined',
    onLogs(logs: any) {
      if (logs) {
        setRefreshData(Date.now().toString());
      }
    },
  });

  const pending = isPending || isConfirming;
  const [selectedMove, setSelectedMove] = useState<MoveType | null>(null);
  const [playerMove, setPlayerMove] = useState<number>();
  const gameDetails = gamesIdResult.data as Game;
  const userAddress = account.address;
  const gameEnded = !gameDetails?.isActive && gameDetails?.roundsPlayed > 0;

  const handleMakeMove = async () => {
    try {
      await writeContract({
        address: contractAddress,
        abi,
        functionName: 'makeMove',
        args: [BigInt(proofedGamedId), playerMove],
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      setRefreshData(Date.now().toString());
      setSelectedMove(null); // Reset UI selection after confirmation
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (error) {
      toast.error(extractErrorMessages(error?.message), { icon: '❌' });
    }
  }, [error]);

  // Loading State
  if (!gameDetails) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-white p-6'>
        <div className="border-8 border-black p-8 animate-pulse shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <Terminal className='w-16 h-16 text-black mb-4' />
            <h2 className='text-2xl font-black uppercase italic tracking-tighter'>SYNCING_PROTOCOL...</h2>
        </div>
      </div>
    );
  }

  // Helper for Addresses
  const formatAddress = (address: string) => {
    if (address === userAddress) return 'YOU';
    if (address === '0x0000000000000000000000000000000000000000') return 'NULL_ADDR';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getGameTypeInfo = (type: number) => {
    switch (Number(type)) {
      case 0: return { name: 'Quick_Match', rounds: 1, icon: <Gamepad2 size={24}/> };
      case 1: return { name: 'Best_Of_3', rounds: 3, icon: <Swords size={24}/> };
      case 2: return { name: 'Championship', rounds: 5, icon: <Crown size={24}/> };
      default: return { name: 'Unknown', rounds: 0, icon: <CircleDot size={24}/> };
    }
  };

  const handleMoveSelection = (choice: MoveType) => {
    const moveMapping: Record<MoveType, number> = { Rock: 1, Paper: 2, Scissors: 3 };
    setSelectedMove(choice);
    setPlayerMove(moveMapping[choice]);
  };

  const gameType = getGameTypeInfo(gameDetails?.gameType);
  const isPlayerTurn = gameDetails?.lastPlayerMove !== userAddress && !gameEnded;

  return (
    <ErrorBoundary fallback={<div className="p-10 font-black">CRITICAL_UI_ERROR</div>}>
      <div className='min-h-screen bg-white text-black p-4 md:p-8 font-sans'>
        <div className='max-w-4xl mx-auto space-y-6'>
          
          {/* TOP BAR / HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-black pb-4 gap-4">
            <div className="flex items-center gap-4">
               <div className="bg-black text-white p-3">
                 {gameType.icon}
               </div>
               <div>
                 <h1 className="text-3xl font-black uppercase italic tracking-tighter">{gameType.name}</h1>
                 <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Archive_Node_#{proofedGamedId}</p>
               </div>
            </div>
            
            <div className="flex items-center gap-2 border-4 border-black px-4 py-2 bg-zinc-50 font-black uppercase text-xs">
               <Activity className={gameDetails?.isActive ? "text-green-600" : "text-red-600"} size={14} />
               {gameDetails?.isActive ? "System_Online" : "Terminated"}
               <span className="mx-2 text-zinc-300">|</span>
               Round {gameDetails?.roundsPlayed + 1}/{gameType.rounds}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: Players & Stakes */}
            <div className="lg:col-span-4 space-y-6">
               {/* Stake Box */}
               <div className="border-4 border-black p-6 bg-zinc-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-2 mb-2 text-zinc-500">
                    <Coins size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Protocol_Stake</span>
                  </div>
                  <div className="text-3xl font-black italic">{formatEther(gameDetails?.stake)} ETH</div>
               </div>

               {/* Players Box */}
               <div className="border-4 border-black divide-y-4 divide-black">
                  {gameDetails?.players.map((player, index) => (
                    <div key={player} className={`p-4 flex justify-between items-center ${player === userAddress ? 'bg-white' : 'bg-zinc-50'}`}>
                       <div className="flex items-center gap-3">
                         <div className={`p-2 border-2 border-black ${player === userAddress ? 'bg-black text-white' : 'bg-white'}`}>
                           <Users size={18} />
                         </div>
                         <div>
                            <p className="text-[9px] font-black text-zinc-400 uppercase">Operator_0{index + 1}</p>
                            <p className="font-mono text-sm font-bold">{formatAddress(player)}</p>
                         </div>
                       </div>
                       <div className="text-4xl font-black italic underline decoration-4">{gameDetails?.scores[index].toString()}</div>
                    </div>
                  ))}
               </div>
               
               {/* Move History Component - Nested for cleaner UI */}
               <div className="border-4 border-black p-4 bg-zinc-50">
                  <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-2">
                    <div className="flex items-center gap-2">
                      <History size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Logs</span>
                    </div>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase">{gameDetails?.roundsPlayed} Completed</span>
                  </div>
                  <MoveHistory gameDetails={gameDetails} userAddress={userAddress} />
               </div>
            </div>

            {/* RIGHT COLUMN: Combat Controls */}
            <div className="lg:col-span-8">
               <div className="h-full border-4 border-black bg-white p-6 md:p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                  
                  {/* Results Banner */}
                  {gameEnded && (
                    <div className="mb-8 border-4 border-black p-8 text-center bg-black text-white italic">
                        <ResultDisplay gameDetails={gameDetails} userAddress={userAddress} />
                        <Link href="/game" className="mt-6 inline-flex items-center gap-3 border-2 border-white px-8 py-3 font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                          <Play size={18} /> Re-Initialize
                        </Link>
                    </div>
                  )}

                  {!gameEnded && (
                    <>
                      <div className="flex items-center gap-3 mb-8">
                        <Zap size={20} fill="black" />
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                          {isPlayerTurn ? 'SELECT_TRANSMISSION' : 'PEER_PROCESSING...'}
                        </h2>
                      </div>

                      {isPlayerTurn ? (
                        <div className="space-y-8">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {['Rock', 'Paper', 'Scissors'].map((move) => (
                              <button
                                key={move}
                                onClick={() => handleMoveSelection(move as MoveType)}
                                className={`
                                  flex flex-col items-center justify-center p-8 border-4 border-black transition-all
                                  ${selectedMove === move ? 'bg-black text-white shadow-none translate-y-1' : 'bg-white hover:bg-zinc-50 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'}
                                `}
                              >
                                <span className="text-5xl mb-3">
                                  {move === 'Rock' ? '🗿' : move === 'Paper' ? '📄' : '✂️'}
                                </span>
                                <span className="font-black uppercase italic tracking-tighter">{move}</span>
                              </button>
                            ))}
                          </div>

                          {playerMove && (
                            <button
                              onClick={handleMakeMove}
                              disabled={pending}
                              className="w-full py-6 border-4 border-black bg-black text-white font-black uppercase italic text-xl tracking-widest hover:bg-white hover:text-black transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1"
                            >
                              {pending ? 'TRANSMITTING...' : 'CONFIRM_MOVE_BLOCK'}
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 border-4 border-dashed border-zinc-200">
                          <Clock size={48} className="animate-spin mb-4 text-zinc-300" />
                          <p className="font-black uppercase italic tracking-widest text-zinc-400">Waiting_For_Opponent_Response</p>
                        </div>
                      )}
                    </>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};


const MoveHistory = ({ gameDetails, userAddress }: { gameDetails: Game, userAddress: `0x${string}` | undefined }) => {
  const playerIndex = userAddress && gameDetails?.players.indexOf(userAddress);
  const isPlayer1 = playerIndex === 0;
  const myMoves = isPlayer1 ? gameDetails?.player1Moves : gameDetails?.player2Moves;
  const opponentMoves = isPlayer1 ? gameDetails?.player2Moves : gameDetails?.player1Moves;
  const completedRounds = Math.min(myMoves.length, opponentMoves.length);

  const getMoveEmoji = (m: number) => m === 1 ? '🗿' : m === 2 ? '📄' : '✂️';

  if (completedRounds === 0) return <div className="text-[10px] font-bold text-zinc-400 text-center uppercase py-4">No_Data_Found</div>;

  return (
    <div className="space-y-2">
      {Array.from({ length: completedRounds }).map((_, i) => (
        <div key={i} className="flex justify-between items-center bg-white border-2 border-black p-2 font-mono text-[10px] font-bold">
           <span className="bg-black text-white px-1">R_{i+1}</span>
           <div className="flex items-center gap-2">
             <span>{getMoveEmoji(myMoves[i])}</span>
             <span className="text-zinc-300">vs</span>
             <span>{getMoveEmoji(opponentMoves[i])}</span>
           </div>
        </div>
      ))}
    </div>
  );
};

const ResultDisplay = ({ gameDetails, userAddress }: { gameDetails: Game, userAddress: `0x${string}` | undefined }) => {
    const pIndex = gameDetails.players.indexOf(userAddress!);
    const myScore = Number(gameDetails.scores[pIndex]);
    const opScore = Number(gameDetails.scores[1 - pIndex]);

    if (myScore > opScore) return <h2 className="text-5xl font-black italic uppercase underline decoration-green-500">Victory_Achieved</h2>;
    if (myScore < opScore) return <h2 className="text-5xl font-black italic uppercase underline decoration-red-500">Defeat_Detected</h2>;
    return <h2 className="text-5xl font-black italic uppercase underline decoration-yellow-500">Stalemate</h2>;
};

export default GameInterface;
