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
    <div className='bg-white text-black w-full min-h-screen pb-10 md:pb-20'>
      {/* Header - Responsive padding & font */}
      <div className="flex items-center gap-3 mb-6 md:mb-8 border-b-4 border-black pb-4 px-1">
        <HistoryIcon size={20} className="text-black md:w-6 md:h-6" />
        <p className='text-xl md:text-2xl font-black uppercase italic tracking-tighter text-black'>
          Combat_History_Log
        </p>
      </div>

      <div className="space-y-4 md:space-y-6">
        {gamesResult &&
          gamesResult.map((game) => (
            <GameHistoryCard
              key={game.gameId.toString()}
              game={game}
              userAddress={account.address}
            />
          ))}

        {gamesResult && gamesResult.length < 1 && (
          <div className='flex flex-col items-center justify-center p-8 md:p-12 text-center border-4 border-dashed border-zinc-200'>
            <div className='mb-4 md:mb-6 p-3 md:p-4 bg-zinc-100 border-4 border-black'>
              <GamepadIcon className='h-8 w-8 md:h-10 md:w-10 text-black' />
            </div>
            <h3 className='mb-4 md:mb-6 text-lg md:text-xl font-black uppercase italic text-black'>
              Zero_Records_Detected
            </h3>
            <Link
              href='/game'
              className="w-full max-w-sm py-3 md:py-4 border-4 border-black bg-black text-white font-black uppercase text-xs md:text-sm tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              <Play className='w-4 h-4 md:w-5 md:h-5' />
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
    if (address === '0x0000000000000000000000000000000000000000') return 'NULL';
    return `${address.slice(0, 4)}...${address.slice(-3)}`;
  };

  const getGameTypeInfo = (type: number) => {
    switch (Number(type)) {
      case 0: return { name: 'Quick_Match', icon: <Gamepad2 className='w-4 h-4 md:w-5 md:h-5 text-black' /> };
      case 1: return { name: 'Best_Of_3', icon: <Swords className='w-4 h-4 md:w-5 md:h-5 text-black' /> };
      case 2: return { name: 'Championship', icon: <Trophy className='w-4 h-4 md:w-5 md:h-5 text-black' /> };
      default: return { name: 'Unknown', icon: <Gamepad2 className='w-4 h-4 md:w-5 md:h-5 text-black' /> };
    }
  };

  const getGameStatus = () => {
    if (game.isActive) return { label: 'Active', color: 'bg-black text-white' };
    const playerIndex = userAddress && game.players.indexOf(userAddress);
    if (playerIndex === -1 || playerIndex === undefined) return { label: 'Observer', color: 'bg-zinc-100 text-zinc-400' };
    
    const myScore = Number(game.scores[playerIndex]);
    const opScore = Number(game.scores[1 - playerIndex]);

    if (myScore === opScore) return { label: 'Draw', color: 'bg-zinc-200 text-black border-2 border-black' };
    return myScore > opScore 
      ? { label: 'Won', color: 'bg-black text-white border-2 border-white outline outline-2 outline-black' }
      : { label: 'Lost', color: 'bg-white text-black border-2 border-black' };
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
    if (myMove === opponentMove) return <Equal className='w-3 h-3 md:w-4 md:h-4 text-black' />;
    if ((myMove === 1 && opponentMove === 3) || (myMove === 2 && opponentMove === 1) || (myMove === 3 && opponentMove === 2)) {
      return <CheckCircle2 className='w-3 h-3 md:w-4 md:h-4 text-black' />;
    }
    return <X className='w-3 h-3 md:w-4 md:h-4 text-black' />;
  };

  const gameTypeInfo = getGameTypeInfo(game.gameType);
  const gameStatus = getGameStatus();
  const playerIndex = userAddress && game.players.indexOf(userAddress);
  const isPlayer1 = playerIndex === 0;
  const myMoves = isPlayer1 ? game.player1Moves : game.player2Moves;
  const opponentMoves = isPlayer1 ? game.player2Moves : game.player1Moves;
  const completedRounds = Math.min(myMoves.length, opponentMoves.length);

  return (
    <div className={`w-full bg-white border-4 border-black transition-all ${isExpanded ? 'translate-y-1 shadow-none' : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'}`}>
      <button onClick={() => setIsExpanded(!isExpanded)} className='w-full text-left'>
        <div className='flex items-center justify-between p-4 md:p-6'>
          <div className='flex items-center space-x-3 md:space-x-6 min-w-0'>
            <div className='flex h-10 w-10 md:h-12 md:w-12 items-center justify-center border-4 border-black bg-zinc-50 shrink-0'>
              {gameTypeInfo.icon}
            </div>
            <div className='min-w-0'>
              <div className='flex items-center space-x-2 flex-wrap gap-y-1'>
                <h3 className='text-base md:text-xl font-black uppercase italic tracking-tighter truncate'>
                  ID_#{game.gameId.toString()}
                </h3>
                <span className={`px-1.5 py-0.5 text-[7px] md:text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${gameStatus.color}`}>
                  {gameStatus.label}
                </span>
              </div>
              <p className='text-[8px] md:text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-zinc-500 mt-0.5 truncate'>
                {gameTypeInfo.name} // {formatEther(game.stake)} ETH
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2 md:gap-4 shrink-0'>
            {game.isActive && (
              <button
                onClick={(e) => { e.stopPropagation(); router.push(`/game/${game.gameId}`); }}
                className='hidden lg:flex items-center gap-2 px-3 py-1.5 border-2 border-black bg-black text-white text-[9px] font-black uppercase hover:bg-white hover:text-black transition-all'
              >
                <span>Resume</span>
                <ExternalLink className='w-3 h-3' />
              </button>
            )}
            <ChevronsUpDown className={`h-5 w-5 md:h-6 md:w-6 text-black transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className='px-4 md:px-6 pb-4 md:pb-6 animate-in slide-in-from-top-2'>
          <div className="border-t-4 border-black pt-4 md:pt-6">
            
            {/* Mobile-First Grid: Stacks on small, 2 columns on medium */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8'>
              {game.players.map((player, index) => (
                <div key={player} className={`p-3 md:p-4 border-4 border-black ${player === userAddress ? 'bg-white' : 'bg-zinc-50 opacity-80'}`}>
                  <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-3 md:gap-4 overflow-hidden'>
                      <div className={`p-1.5 md:p-2 border-2 border-black bg-white shrink-0`}>
                        <Users className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <div className='min-w-0'>
                        <div className='text-[8px] font-black uppercase text-zinc-400 mb-0.5'>OP_0{index + 1}</div>
                        <div className='font-mono font-bold text-xs md:text-sm truncate'>{formatAddress(player)}</div>
                      </div>
                    </div>
                    <div className='text-2xl md:text-3xl font-black italic underline decoration-2 md:decoration-4 underline-offset-4 ml-2 shrink-0'>
                      {game.scores[index].toString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='bg-zinc-50 border-4 border-black p-4 md:p-6'>
              <div className='flex items-center justify-between mb-4 border-b-2 border-black pb-2'>
                <div className="flex items-center gap-2">
                  <Terminal size={12} className="md:w-3.5 md:h-3.5" />
                  <h3 className='text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]'>Transmission_Log</h3>
                </div>
                <span className='text-[8px] md:text-[9px] font-black uppercase text-zinc-400'>
                  {completedRounds}_RND_Verified
                </span>
              </div>
              
              <div className='space-y-2 md:space-y-3'>
                {completedRounds === 0 ? (
                  <div className='py-4 text-center text-[9px] md:text-[10px] font-black uppercase italic text-zinc-400'>NULL_DATA</div>
                ) : (
                  Array.from({ length: completedRounds }).map((_, index) => (
                    <div key={index} className='flex items-center justify-between p-2 md:p-3 border-2 border-black bg-white'>
                      <div className='flex items-center gap-2 md:gap-4 overflow-hidden'>
                        <span className='text-[9px] md:text-[10px] font-black w-5 md:w-6 bg-black text-white text-center shrink-0'>{index + 1}</span>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className='text-[7px] md:text-[8px] font-black text-zinc-400'>ME:</span>
                          <span className="text-base md:text-xl">{getMoveIcon(myMoves[index])}</span>
                        </div>
                      </div>

                      <div className='flex items-center justify-center bg-zinc-100 p-0.5 md:p-1 shrink-0'>
                        {getResultIcon(myMoves[index], opponentMoves[index])}
                      </div>

                      <div className='flex items-center gap-1.5 min-w-0'>
                        <span className='text-[7px] md:text-[8px] font-black text-zinc-400'>PEER:</span>
                        <span className="text-base md:text-xl">{getMoveIcon(opponentMoves[index])}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Mobile-only Resume Button */}
              {game.isActive && (
                 <button 
                  onClick={() => router.push(`/game/${game.gameId}`)}
                  className="w-full mt-4 lg:hidden py-3 border-2 border-black bg-black text-white text-[10px] font-black uppercase active:bg-zinc-800 transition-colors"
                 >
                   Resume_Session
                 </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHistory;