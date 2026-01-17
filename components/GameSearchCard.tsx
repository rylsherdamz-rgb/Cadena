'use client';

import React from 'react';
import {
  Swords,
  Trophy,
  Gamepad2,
  Users,
  User,
  Copy,
  CircleDollarSign,
  CheckCircle2,
  Clock,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { formatEther } from 'viem';
import Link from 'next/link';
import { GameSearchCardProps } from '@/utils/RockContractType';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const GameSearchCard: React.FC<GameSearchCardProps> = ({
  game,
  onJoinGame,
  isLoading,
  userAddress,
}) => {
  const getGameTypeInfo = (type: number) => {
    switch (Number(type)) {
      case 0:
        return {
          name: 'Quick_Match',
          rounds: 1,
          icon: <Gamepad2 className="h-5 w-5" />,
        };
      case 1:
        return {
          name: 'Best_of_Three',
          rounds: 3,
          icon: <Swords className="h-5 w-5" />,
        };
      case 2:
        return {
          name: 'Championship',
          rounds: 5,
          icon: <Trophy className="h-5 w-5" />,
        };
      default:
        return {
          name: 'Unknown_Protocol',
          rounds: 0,
          icon: <Terminal className="h-5 w-5" />,
        };
    }
  };

  if (
    !game ||
    (game.players[0] === ZERO_ADDRESS &&
      game.players[1] === ZERO_ADDRESS)
  ) {
    return (
      <div className="w-full border-4 border-black p-10 bg-white flex flex-col items-center justify-center text-center">
        <div className="bg-black p-4 mb-4">
          <Gamepad2 className="w-12 h-12 text-white" />
        </div>
        <p className="font-black uppercase italic text-xl tracking-tighter">
          NODE_NOT_FOUND
        </p>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
          Verify Game ID and retry broadcast.
        </p>
      </div>
    );
  }

  const gameTypeInfo = getGameTypeInfo(game.gameType);
  const formattedStake = formatEther(game.stake);
  const hasSecondPlayer = game.players[1] !== ZERO_ADDRESS;

  const playerCompleteAndIsUserPlayer =
    hasSecondPlayer &&
    userAddress &&
    game.players.includes(userAddress);

  const copyGameId = () => {
    navigator.clipboard.writeText(game.gameId.toString());
  };

  return (
    <div className="w-full bg-white border-4 border-black p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] group">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start space-x-5">
          <div className="flex h-16 w-16 items-center justify-center border-4 border-black bg-zinc-50 shrink-0">
            {gameTypeInfo.icon}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
                Node_#{game.gameId.toString()}
              </h3>

              <button
                onClick={copyGameId}
                className="p-1 border-2 border-black hover:bg-black hover:text-white transition-all active:translate-y-0.5"
                title="Copy Game ID"
              >
                <Copy className="h-3 w-3" />
              </button>

              <div
                className={`flex items-center gap-1 border-2 border-black px-3 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                  game.isActive
                    ? 'bg-black text-white'
                    : 'bg-zinc-100 text-zinc-400'
                }`}
              >
                {game.isActive ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    STATUS: ACTIVE
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3" />
                    STATUS: INACTIVE
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 font-mono font-black text-lg italic">
                <CircleDollarSign className="h-5 w-5" />
                {formattedStake} <span className="text-sm">ETH</span>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                {hasSecondPlayer ? (
                  <Users className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                {hasSecondPlayer ? '2_PEERS_SYNCED' : 'AWAITING_PEER'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Tag */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-3 border-4 border-black px-4 py-2 bg-zinc-50 font-black uppercase italic text-sm">
          {gameTypeInfo.icon}
          {gameTypeInfo.name.replace(' ', '_')}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4">
        {!playerCompleteAndIsUserPlayer && (
          <button
            onClick={() => onJoinGame(game.gameId, game.stake)}
            disabled={isLoading || hasSecondPlayer}
            className={`w-full py-5 border-4 border-black font-black uppercase tracking-[0.4em] text-sm transition-all flex items-center justify-center gap-4 ${
              hasSecondPlayer
                ? 'bg-zinc-100 text-zinc-300 border-zinc-200 cursor-not-allowed shadow-none'
                : 'bg-black text-white hover:bg-white hover:text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1'
            }`}
          >
            {hasSecondPlayer ? (
              <>
                <Users className="h-5 w-5" />
                NODE_CAPACITY_REACHED
              </>
            ) : isLoading ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                JOIN_CONFERENCE <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        )}

        {playerCompleteAndIsUserPlayer && (
          <Link href={`/game/${game.gameId}`}>
            <button className="w-full py-5 border-4 border-black bg-black text-white font-black uppercase tracking-[0.4em] text-sm hover:bg-white hover:text-black transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3">
              ENTER_SIMULATION <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        )}
      </div>
      
      {/* Schematic Footer */}
      <div className="mt-6 pt-4 border-t-2 border-black border-dotted opacity-20 flex justify-between font-mono text-[8px] font-black uppercase">
        <span>[SIG_VERIFIED]</span>
        <span>[ADDR_{game.players[0].slice(0,6)}...]</span>
      </div>
    </div>
  );
};

export default GameSearchCard;