"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { useRPSContract, useRPSGameDetails, usePlayerGames } from "@/utils/useRPSContract"
import { RPSGameType, RPSChoice, CHOICE_NAMES } from "@/app/constants/rpsContract"
import { Loader, Play, Copy, Check } from "lucide-react"
import { parseEther } from "viem"

export default function RockPaperScissorsComponent() {
  const { isConnected, address } = useAccount()
  const { createGame, joinGame, submitMove, isPending } = useRPSContract()
  const { gameIds } = usePlayerGames(address || "")
  const [activeTab, setActiveTab] = useState<"create" | "join" | "games">("create")
  const [gameType, setGameType] = useState<RPSGameType>(RPSGameType.OneRound)
  const [stakeAmount, setStakeAmount] = useState("0.01")
  const [joinGameId, setJoinGameId] = useState("")
  const [selectedGame, setSelectedGame] = useState<number | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const { game: gameDetails } = useRPSGameDetails(selectedGame || 0)

  const handleCreateGame = () => {
    try {
      createGame(gameType, parseEther(stakeAmount))
      setStakeAmount("0.01")
    } catch (error) {
      console.error("Failed to create game:", error)
    }
  }

  const handleJoinGame = () => {
    const gameId = parseInt(joinGameId)
    if (gameId > 0) {
      try {
        joinGame(gameId, parseEther(stakeAmount))
        setJoinGameId("")
      } catch (error) {
        console.error("Failed to join game:", error)
      }
    }
  }

  const handleSubmitMove = (choice: RPSChoice) => {
    if (selectedGame) {
      submitMove(selectedGame, choice)
    }
  }

  if (!isConnected) {
    return (
      <div className="w-full bg-blue-50 rounded-lg p-8 text-center">
        <p className="text-blue-800 font-semibold">Please connect your wallet to play</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">🎮 Rock Paper Scissors</h2>

      <div className="flex gap-4 mb-6 border-b">
        {(["create", "join", "games"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold capitalize transition-all ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab === "create" && "Create Game"}
            {tab === "join" && "Join Game"}
            {tab === "games" && "My Games"}
          </button>
        ))}
      </div>

      {/* Create Game Tab */}
      {activeTab === "create" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Game Type</label>
            <select
              value={gameType}
              onChange={(e) => setGameType(Number(e.target.value) as RPSGameType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value={RPSGameType.OneRound}>One Round</option>
              <option value={RPSGameType.BestOfThree}>Best of Three</option>
              <option value={RPSGameType.BestOfFive}>Best of Five</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Stake (ETH)</label>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              step="0.01"
              min="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            onClick={handleCreateGame}
            disabled={isPending || !stakeAmount}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader size={20} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Play size={20} />
                Create Game
              </>
            )}
          </button>
        </div>
      )}

      {/* Join Game Tab */}
      {activeTab === "join" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Game ID</label>
            <input
              type="number"
              value={joinGameId}
              onChange={(e) => setJoinGameId(e.target.value)}
              placeholder="Enter game ID to join"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Stake (ETH)</label>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              step="0.01"
              min="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            onClick={handleJoinGame}
            disabled={isPending || !joinGameId}
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader size={20} className="animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <Play size={20} />
                Join Game
              </>
            )}
          </button>
        </div>
      )}

      {/* My Games Tab */}
      {activeTab === "games" && (
        <div className="space-y-4">
          {gameIds.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No games yet</p>
          ) : (
            <div className="grid gap-4">
              {gameIds.map((gameId) => (
                <div key={gameId.toString()} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedGame(Number(gameId))}>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Game #{gameId.toString()}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigator.clipboard.writeText(gameId.toString())
                        setCopiedId(Number(gameId))
                        setTimeout(() => setCopiedId(null), 2000)
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {copiedId === Number(gameId) ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Game Details */}
      {selectedGame && gameDetails && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-2xl font-bold mb-4">Game #{selectedGame}</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Stake</p>
              <p className="text-lg font-semibold">{(gameDetails.stake / BigInt(1e18)).toString()} ETH</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-semibold">{gameDetails.isActive ? "Active" : "Finished"}</p>
            </div>
          </div>

          {gameDetails.isActive && (
            <div>
              <p className="font-semibold mb-4">Your Move:</p>
              <div className="grid grid-cols-3 gap-2">
                {[RPSChoice.Rock, RPSChoice.Paper, RPSChoice.Scissors].map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleSubmitMove(choice)}
                    disabled={isPending}
                    className="p-4 bg-blue-100 hover:bg-blue-200 rounded-lg font-semibold disabled:bg-gray-300 transition-all"
                  >
                    {CHOICE_NAMES[choice]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
