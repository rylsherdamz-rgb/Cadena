'use client'

import React, { useEffect, useState } from 'react';
import {
  Users,
  Swords,
  Trophy,
  ChevronsUpDown,
  Gamepad2,
  GamepadIcon,
  Play,
  X,
  CheckCircle2,
  Equal,
  ExternalLink,
  Terminal,
  Activity,
  History as HistoryIcon
} from 'lucide-react';
import { formatEther } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import { abi, contractAddress } from '../../constants/contractInfo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Game, GameHistoryCardProps } from '@/utils/RockContractType';

const GameHistory = () => {
  const account = useAccount();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const gamesIdResult = useReadContract({
    abi,
    address: contractAddress,
    functionName: 'getUserGames',
    args: [account.address],
  });

  const contractGamesResult = useReadContract({
    abi,
    address: contractAddress,
    functionName: 'getGamesInfo',
    args: [gamesIdResult.data],
  });

  const gamesResult = contractGamesResult.data as Game[];

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className='bg-white text-black w-full min-h-screen pb-20'>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 border-b-4 border-black pb-4">
        <HistoryIcon size={24} className="text-black" />
        <p className='text-2xl font-black uppercase italic tracking-tighter text-black'>
          Combat_History_Log
        </p>
      </div>

      <div className="space-y-6">
        {gamesResult &&
          gamesResult.map((game) => (
            <GameHistoryCard
              key={game.gameId.toString()}
              game={game}
              userAddress={account.address}
            />
          ))}

        {gamesResult && gamesResult.length < 1 && (
          <div className='flex flex-col items-center justify-center p-12 text-center border-4 border-dashed border-zinc-200'>
            <div className='mb-6 p-4 bg-zinc-100 border-4 border-black'>
              <GamepadIcon className='h-10 w-10 text-black' />
            </div>
            <h3 className='mb-6 text-xl font-black uppercase italic text-black'>
              Zero_Records_Detected
            </h3>
            <Link
              href='/game'
              className="w-full max-w-sm py-4 border-4 border-black bg-black text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              <Play className='w-5 h-5' />
              <span>Initialize_New_Session</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const GameHistoryCard: React.FC<GameHistoryCardProps> = ({ game, userAddress }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const formatAddress = (address: string) => {
    if (address === userAddress) return 'ME';
    if (address === '0x0000000000000000000000000000000000000000') return 'NULL_ADDR';
    return `${address.slice(0, 4)}...${address.slice(-3)}`;
  };

  const getGameTypeInfo = (type: number) => {
    switch (Number(type)) {
      case 0:
        return {
          name: 'Quick_Match',
          rounds: 1,
          icon: <Gamepad2 className='w-5 h-5 text-black' />,
        };
      case 1:
        return {
          name: 'Best_Of_Three',
          rounds: 3,
          icon: <Swords className='w-5 h-5 text-black' />,
        };
      case 2:
        return {
          name: 'Championship',
          rounds: 5,
          icon: <Trophy className='w-5 h-5 text-black' />,
        };
      default:
        return {
          name: 'Unknown',
          rounds: 0,
          icon: <Gamepad2 className='w-5 h-5 text-black' />,
        };
    }
  };

  const getGameStatus = () => {
    if (game.isActive) {
      return { label: 'Active', color: 'bg-black text-white' };
    }
    const playerIndex = userAddress && game.players.indexOf(userAddress);
    if (playerIndex === -1) {
      return { label: 'Non-Player', color: 'bg-zinc-100 text-zinc-400' };
    }
    if (playerIndex === undefined || playerIndex < 0) {
      return { label: 'Invalid', color: 'bg-red-600 text-white' };
    }
    const myScore = game.scores[playerIndex];
    const opponentScore = game.scores[1 - playerIndex];
    if (myScore === undefined || opponentScore === undefined) {
      return { label: 'Pending', color: 'bg-zinc-100 text-black' };
    }
    if (myScore === opponentScore) {
      return { label: 'Tie', color: 'bg-zinc-200 text-black border-2 border-black' };
    }
    if (myScore > opponentScore) {
      return { label: 'Won', color: 'bg-black text-white border-2 border-white outline outline-2 outline-black' };
    } else {
      return { label: 'Lost', color: 'bg-white text-black border-2 border-black' };
    }
  };

  const getMoveIcon = (move: number) => {
    switch (Number(move)) {
      case 1: return '🪨';
      case 2: return '🗒️';
      case 3: return '✂️';
      default: return '❓';
    }
  };

  const getResultIcon = (myMove: number, opponentMove: number) => {
    if (myMove === opponentMove) {
      return <Equal className='w-4 h-4 text-black' />;
    }
    if (
      (myMove === 1 && opponentMove === 3) ||
      (myMove === 2 && opponentMove === 1) ||
      (myMove === 3 && opponentMove === 2)
    ) {
      return <CheckCircle2 className='w-4 h-4 text-black' />;
    }
    return <X className='w-4 h-4 text-black' />;
  };

  const gameTypeInfo = getGameTypeInfo(game.gameType);
  const gameStatus = getGameStatus();
  const formattedStake = formatEther(game.stake);
  const playerIndex = userAddress && game.players.indexOf(userAddress);
  const isPlayer1 = playerIndex === 0;
  const myMoves = isPlayer1 ? game.player1Moves : game.player2Moves;
  const opponentMoves = isPlayer1 ? game.player2Moves : game.player1Moves;
  const completedRounds = Math.min(myMoves.length, opponentMoves.length);

  return (
    <div className={`w-full bg-white border-4 border-black transition-all ${isExpanded ? 'shadow-none translate-y-1' : 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='w-full text-left'
      >
        <div className='flex items-center justify-between p-6'>
          <div className='flex items-center space-x-6'>
            <div className='flex h-12 w-12 items-center justify-center border-4 border-black bg-zinc-50'>
              {gameTypeInfo.icon}
            </div>
            <div>
              <div className='flex items-center space-x-3 flex-wrap gap-y-2'>
                <h3 className='text-xl font-black uppercase italic tracking-tighter'>
                  Archive_#{game.gameId.toString()}
                </h3>
                <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${gameStatus.color}`}>
                  {gameStatus.label}
                </span>
              </div>
              <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mt-1'>
                {gameTypeInfo.name.replace(' ', '_')} // {formattedStake} ETH_STAKE
              </p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            {game.isActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/game/${game.gameId}`);
                }}
                className='hidden sm:flex items-center gap-2 px-4 py-2 border-2 border-black bg-black text-white text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all'
              >
                <span>Resume</span>
                <ExternalLink className='w-3 h-3' />
              </button>
            )}
            <ChevronsUpDown
              className={`h-6 w-6 text-black transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className='px-6 pb-6 animate-in slide-in-from-top-2'>
          <div className="border-t-4 border-black pt-6">
            {/* Players Section */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
              {game.players.map((player, index) => (
                <div
                  key={player}
                  className={`p-4 border-4 border-black ${
                    player === userAddress ? 'bg-white' : 'bg-zinc-50 opacity-60'
                  }`}
                >
                  <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-4'>
                      <div className={`p-2 border-2 border-black bg-white`}>
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className='text-[9px] font-black uppercase text-zinc-400 mb-1'>
                          Operator_0{index + 1}
                        </div>
                        <div className='font-mono font-bold text-sm'>{formatAddress(player)}</div>
                      </div>
                    </div>
                    <div className='text-3xl font-black italic underline decoration-4 underline-offset-4'>{game.scores[index].toString()}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Move History */}
            <div className='bg-zinc-50 border-4 border-black p-6'>
              <div className='flex items-center justify-between mb-6 border-b-2 border-black pb-2'>
                <div className="flex items-center gap-2">
                  <Terminal size={14} />
                  <h3 className='text-[10px] font-black uppercase tracking-[0.2em]'>Transmission_History</h3>
                </div>
                <span className='text-[9px] font-black uppercase text-zinc-400'>
                  {completedRounds}_Rounds_Verified
                </span>
              </div>
              
              <div className='space-y-3'>
                {completedRounds === 0 ? (
                  <div className='py-4 text-center text-[10px] font-black uppercase italic text-zinc-400'>
                    No_Data_Packets_Detected
                  </div>
                ) : (
                  Array.from({ length: completedRounds }).map((_, index) => {
                    const myMove = myMoves[index];
                    const opponentMove = opponentMoves[index];

                    return (
                      <div
                        key={index}
                        className='flex items-center justify-between p-3 border-2 border-black bg-white'
                      >
                        <div className='flex items-center gap-4'>
                          <span className='text-[10px] font-black w-6 bg-black text-white text-center'>
                            {index + 1}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className='text-[8px] font-black text-zinc-400'>ME:</span>
                            <span className="text-xl">{getMoveIcon(myMove)}</span>
                          </div>
                        </div>

                        <div className='flex items-center justify-center bg-zinc-100 p-1'>
                          {getResultIcon(myMove, opponentMove)}
                        </div>

                        <div className='flex items-center gap-2'>
                          <span className='text-[8px] font-black text-zinc-400'>PEER:</span>
                          <span className="text-xl">{getMoveIcon(opponentMove)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHistory;