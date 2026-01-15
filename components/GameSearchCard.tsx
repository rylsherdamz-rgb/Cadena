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
          name: 'Quick Match',
          rounds: 1,
          icon: <Gamepad2 className="h-5 w-5 text-emerald-500" />,
        };
      case 1:
        return {
          name: 'Best of Three',
          rounds: 3,
          icon: <Swords className="h-5 w-5 text-blue-500" />,
        };
      case 2:
        return {
          name: 'Championship',
          rounds: 5,
          icon: <Trophy className="h-5 w-5 text-yellow-500" />,
        };
      default:
        return {
          name: 'Unknown',
          rounds: 0,
          icon: <Gamepad2 className="h-5 w-5 text-gray-500" />,
        };
    }
  };

  if (
    !game ||
    (game.players[0] === ZERO_ADDRESS &&
      game.players[1] === ZERO_ADDRESS)
  ) {
    return (
      <div className="w-full px-[5%]">
        <div className="flex flex-col items-center justify-center w-full h-full p-6 bg-gray-800 rounded-lg border-2 border-gray-700">
          <Gamepad2 className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-gray-300 text-lg">
            Game not found. Please check the game ID.
          </p>
        </div>
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
    <div className="w-full px-[5%]">
      <div className="w-full h-screen rounded-lg border-2 border-gray-700 bg-gray-800/80 p-6 backdrop-blur-sm hover:border-gray-600 transition-all duration-200">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-700/50">
              {gameTypeInfo.icon}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-semibold text-white">
                  Game #{game.gameId.toString()}
                </h3>

                <button
                  onClick={copyGameId}
                  className="rounded-md p-1 text-gray-400 hover:bg-gray-700 hover:text-gray-300 transition-colors"
                  title="Copy Game ID"
                >
                  <Copy className="h-4 w-4" />
                </button>

                <span
                  className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    game.isActive
                      ? 'bg-green-900/50 text-green-400'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {game.isActive ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      Active
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3" />
                      Inactive
                    </>
                  )}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-gray-400">
                <div className="flex items-center gap-1.5">
                  <CircleDollarSign className="h-4 w-4 text-yellow-500" />
                  {formattedStake} ETH
                </div>

                <div className="flex items-center gap-1.5">
                  {hasSecondPlayer ? (
                    <Users className="h-4 w-4 text-blue-500" />
                  ) : (
                    <User className="h-4 w-4 text-blue-500" />
                  )}
                  {hasSecondPlayer ? '2 Players' : '1 Player'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-300">
            <div className="flex items-center gap-2 rounded-lg bg-gray-700/50 px-3 py-2">
              {gameTypeInfo.icon}
              {gameTypeInfo.name}
            </div>
          </div>

          {!playerCompleteAndIsUserPlayer && (
            <button
              onClick={() => onJoinGame(game.gameId, game.stake)}
              disabled={isLoading || hasSecondPlayer}
              className={`w-full rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
                hasSecondPlayer
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                {hasSecondPlayer ? (
                  <>
                    <Users className="h-5 w-5" />
                    Game Full
                  </>
                ) : isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <User className="h-5 w-5" />
                    Join Game
                  </>
                )}
              </span>
            </button>
          )}

          {playerCompleteAndIsUserPlayer && (
            <Link href={`/game/${game.gameId}`}>
              <button className="w-full flex items-center justify-center p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Enter Game
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameSearchCard;
