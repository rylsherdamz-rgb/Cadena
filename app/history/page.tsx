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
} from 'lucide-react';
import { formatEther } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import { abi, contractAddress } from '../../constants/contractInfo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Game, GameHistoryCardProps } from '@/utils/RockContractType';



const GameHistory = () => {
  const account = useAccount()
  const router = useRouter();
    const [mounted, setMounted] = useState(false);



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

    const gamesResult = contractGamesResult.data as Game[]

   
  return (
    <div className='bg-white w-full h-screen '>
      <p className='text-black font-semibold py-2'>Game History</p>
      {gamesResult &&
        gamesResult.map((game) => (
          <GameHistoryCard
            key={game.gameId.toString()}
            game={game}
            userAddress={account.address}
          />
        ))}
      {gamesResult && gamesResult.length < 1 && (
        <div className='flex flex-col items-center justify-center p-8 text-center'>
          <div className='mb-4 rounded-full -4'>
            <GamepadIcon className='h-8 w-8 tex-black ' />
          </div>
          <h3 className='mb-2 text-lg font-medium text-black'>
            No Games Found
          </h3>
          <Link
            href='/game'
            className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90'
              `}
          >
            <>
              <Play className='w-5 h-5' />
              <span>Start New Game</span>
            </>
          </Link>
        </div>
      )}
    </div>
  );
};

const GameHistoryCard:React.FC<GameHistoryCardProps> = ({ game, userAddress }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const formatAddress = (address: string) => {
    if (address === userAddress) return 'Me';
    if (address === '0x0000000000000000000000000000000000000000') return null;
    return `${address.slice(0, 4)}...${address.slice(-3)}`;
  };

  const getGameTypeInfo = (type: number) => {
    switch (Number(type)) {
      case 0:
        return {
          name: 'Quick Match',
          rounds: 1,
          icon: <Gamepad2 className='w-5 h-5 text-emerald-500' />,
        };
      case 1:
        return {
          name: 'Best of Three',
          rounds: 3,
          icon: <Swords className='w-5 h-5 text-blue-500' />,
        };
      case 2:
        return {
          name: 'Championship',
          rounds: 5,
          icon: <Trophy className='w-5 h-5 text-yellow-500' />,
        };
      default:
        return {
          name: 'Unknown',
          rounds: 0,
          icon: <Gamepad2 className='w-5 h-5 text-gray-500' />,
        };
    }
  };
  const getGameStatus = () => {

    if (game.isActive) {
      return { label: 'Active', color: 'bg-green-900/50 text-green-400' };
    }


    const playerIndex = userAddress && game.players.indexOf(userAddress);


    if (playerIndex === -1) {
      return { label: 'Not a Player', color: 'bg-gray-900/50 text-gray-400' };
    }

 
    if (playerIndex === undefined || playerIndex < 0) {
      return { label: 'Invalid Player', color: 'bg-red-900/50 text-red-400' };
    }

  
    const myScore = game.scores[playerIndex];
    const opponentScore = game.scores[1 - playerIndex]; 

 
    if (myScore === undefined || opponentScore === undefined) {
      return { label: 'Not Scored', color: 'bg-yellow-900/50 text-yellow-400' };
    }


    if (myScore === opponentScore) {
      return { label: 'Tie', color: 'bg-yellow-900/50 text-yellow-400' };
    }


    if (myScore > opponentScore) {
      return { label: 'Won', color: 'bg-green-900/50 text-green-400' };
    } else {
      return { label: 'Lost', color: 'bg-red-900/50 text-red-400' };
    }
  };

  const getMoveIcon = (move: number) => {
    switch (Number(move)) {
      case 1:
        return '🪨';
      case 2:
        return '🗒️';
      case 3:
        return '✂️';
      default:
        return '❓';
    }
  };

  const getResultIcon = (myMove: number, opponentMove: number) => {
    if (myMove === opponentMove) {
      return <Equal className='w-4 h-4 text-yellow-500' />;
    }
    if (
      (myMove === 1 && opponentMove === 3) ||
      (myMove === 2 && opponentMove === 1) ||
      (myMove === 3 && opponentMove === 2)
    ) {
      return <CheckCircle2 className='w-4 h-4 text-green-500' />;
    }
    return <X className='w-4 h-4 text-red-500' />;
  };

  const gameTypeInfo = getGameTypeInfo(game.gameType);
  const gameStatus = getGameStatus();
  const formattedStake = formatEther(game.stake);
  const playerIndex =userAddress && game.players.indexOf(userAddress);
  const isPlayer1 = playerIndex === 0;
  const myMoves = isPlayer1 ? game.player1Moves : game.player2Moves;
  const opponentMoves = isPlayer1 ? game.player2Moves : game.player1Moves;
  const completedRounds = Math.min(myMoves.length, opponentMoves.length);

  return (
    <div className='w-full text-black overflow-hidden rounded-lg border border-slate-700 bg-slate-200 shadow-lg hover:border-slate-600 transition-all duration-200'>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='w-full text-left'
      >
        <div className='flex items-center justify-between p-4'>
          <div className='flex items-center space-x-4'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg '>
              {gameTypeInfo.icon}
            </div>
            <div>
              <div className='flex items-center space-x-2'>
                <h3 className='text-lg font-semibold text-black'>
                  Game #{game.gameId.toString()}
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${gameStatus.color}`}
                >
                  {gameStatus.label}
                </span>
              </div>
              <p className='text-sm text-black'>
                {gameTypeInfo.name} • {formattedStake} ETH Stake
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            {game.isActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/game/${game.gameId}`);
                }}
                className='flex items-center gap-1 px-3 py-1 text-sm  text-blue-400 rounded-lg  transition-colors'
              >
                <span>Play</span>
                <ExternalLink className='w-4 h-4' />
              </button>
            )}
            <ChevronsUpDown
              className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                isExpanded ? 'rotate-180 transform' : ''
              }`}
            />
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className='px-4 pb-4'>
          {/* Players Section */}
          <div className='space-y-3 mb-4 text-black' >
            <div className='flex items-center'>
              <Users className='mr-2 h-4 w-4' />
              <span className='text-sm font-medium'>Players</span>
            </div>

            {game.players.map((player, index) => (
              <div
                key={player}
                className={`p-4 rounded-xl ${
                  player === userAddress
                    ? 'bg-slate-200 border border-indigo-500/20'
                    : 'bg-slate-200'
                }`}
              >
                <div className='flex justify-between items-center'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={`p-2 rounded-lg ${
                        player === userAddress
                          ? 'bg-slate-200'
                          : 'bg-slate-200'
                      }`}
                    >
                      <Users
                        className={`w-5 h-5 ${
                          player === userAddress
                            ? 'text-slate-400'
                            : 'text-slate-400'
                        }`}
                      />
                    </div>
                    <div>
                      <div className='text-sm text-black'>
                        Player {index + 1}
                      </div>
                      <div className='font-medium'>{formatAddress(player)}</div>
                    </div>
                  </div>
                  <div className='text-2xl font-bold'>{game.scores[index]}</div>
                </div>
              </div>
            ))}
          </div>

          <div className='mb'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-sm font-semibold'>Move History</h3>
              <span className='text-xs text-slate-400'>
                {completedRounds} round{completedRounds > 1 ? 's' : ''}
              </span>
            </div>
            <div className='space-y-2'>
              {completedRounds === 0 ? (
                <div className='p-3 bg-slate-slate-200 rounded-lg text-center text-black text-sm'>
                  No completed rounds yet
                </div>
              ) : (
                Array.from({ length: completedRounds }).map((_, index) => {
                  const myMove = myMoves[index];
                  const opponentMove = opponentMoves[index];

                  return (
                    <div
                      key={index}
                      className='flex items-center justify-between p-2 bg-slate-200 rounded-lg text-black'
                    >
                      <div className='flex items-center gap-1'>
                        <span className='text-xs text-black w-4'>
                          {index + 1}
                        </span>
                        <span className='text-xs mr-1'>Me</span>
                        <div className='p-1.5  rounded'>
                          {getMoveIcon(myMove)}
                        </div>
                      </div>
                      <div className='flex items-center gap-1'>
                        {getResultIcon(myMove, opponentMove)}
                      </div>
                      <div className='flex items-center gap-1'>
                        <div className='p-1.5  rounded'>
                          {getMoveIcon(opponentMove)}
                        </div>
                        <span className='text-xs'>
                          {playerIndex && formatAddress(game.players[1 - playerIndex])}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHistory;