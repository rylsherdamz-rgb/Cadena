// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RockPaperScissors is ReentrancyGuard, Ownable {
    enum Choice { None, Rock, Paper, Scissors }
    enum GameType { OneRound, BestOfThree, BestOfFive }

    struct Game {
        uint256 gameId;
        address[2] players;
        uint256 stake;
        GameType gameType;
        uint8 roundsPlayed;
        uint8[2] scores;
        bool isActive;
        address winner;
        uint256 totalPot;
        uint256 createdAt;
    }

    uint256 public nextGameId = 1;
    uint256 public platformFee = 25; // 2.5% = 25/1000
    uint256 public platformBalance;

    mapping(uint256 => Game) public games;
    mapping(address => uint256[]) public playerGames;
    mapping(uint256 => mapping(address => Choice)) public lastMoves;

    event GameCreated(uint256 indexed gameId, address indexed player1, uint256 stake, GameType gameType);
    event GameJoined(uint256 indexed gameId, address indexed player2);
    event MoveSubmitted(uint256 indexed gameId, address indexed player, Choice choice);
    event RoundResult(uint256 indexed gameId, uint8 round, address winner, Choice choice1, Choice choice2);
    event GameFinished(uint256 indexed gameId, address indexed winner, uint256 payout);
    event FeeWithdrawn(address indexed owner, uint256 amount);

    modifier gameExists(uint256 _gameId) {
        require(_gameId > 0 && _gameId < nextGameId, "Game does not exist");
        _;
    }

    constructor() Ownable(msg.sender) {}

    function createGame(GameType _gameType) external payable returns (uint256) {
        require(msg.value > 0, "Stake must be greater than 0");
        require(_gameType <= GameType.BestOfFive, "Invalid game type");

        uint256 gameId = nextGameId++;
        games[gameId] = Game({
            gameId: gameId,
            players: [msg.sender, address(0)],
            stake: msg.value,
            gameType: _gameType,
            roundsPlayed: 0,
            scores: [0, 0],
            isActive: true,
            winner: address(0),
            totalPot: msg.value,
            createdAt: block.timestamp
        });

        playerGames[msg.sender].push(gameId);
        emit GameCreated(gameId, msg.sender, msg.value, _gameType);

        return gameId;
    }

    function joinGame(uint256 _gameId) external payable gameExists(_gameId) {
        Game storage game = games[_gameId];

        require(game.isActive, "Game is not active");
        require(game.players[1] == address(0), "Game is full");
        require(game.players[0] != msg.sender, "Cannot play against yourself");
        require(msg.value == game.stake, "Incorrect stake amount");

        game.players[1] = msg.sender;
        game.totalPot += msg.value;
        playerGames[msg.sender].push(_gameId);

        emit GameJoined(_gameId, msg.sender);
    }

    function submitMove(uint256 _gameId, Choice _choice) external gameExists(_gameId) {
        Game storage game = games[_gameId];

        require(game.isActive, "Game is not active");
        require(game.players[1] != address(0), "Waiting for opponent");
        require(
            msg.sender == game.players[0] || msg.sender == game.players[1],
            "Not a player in this game"
        );
        require(_choice == Choice.Rock || _choice == Choice.Paper || _choice == Choice.Scissors, "Invalid choice");
        require(lastMoves[_gameId][game.players[0]] == Choice.None || lastMoves[_gameId][game.players[1]] == Choice.None, "Both players already moved");

        lastMoves[_gameId][msg.sender] = _choice;
        emit MoveSubmitted(_gameId, msg.sender, _choice);

        // If both players have moved, resolve the round
        if (lastMoves[_gameId][game.players[0]] != Choice.None && lastMoves[_gameId][game.players[1]] != Choice.None) {
            _resolveRound(_gameId);
        }
    }

    function _resolveRound(uint256 _gameId) private {
        Game storage game = games[_gameId];

        Choice choice1 = lastMoves[_gameId][game.players[0]];
        Choice choice2 = lastMoves[_gameId][game.players[1]];

        uint8 roundsNeeded = _getRoundsNeeded(game.gameType);

        if (choice1 == choice2) {
            // Draw - reset for next round
        } else if (_isWinning(choice1, choice2)) {
            game.scores[0]++;
        } else {
            game.scores[1]++;
        }

        game.roundsPlayed++;

        emit RoundResult(_gameId, game.roundsPlayed, 
            game.scores[0] > game.scores[1] ? game.players[0] : game.players[1],
            choice1, choice2);

        // Check if game is finished
        if (game.scores[0] > roundsNeeded / 2 || game.scores[1] > roundsNeeded / 2) {
            _finishGame(_gameId);
        } else {
            // Reset choices for next round
            lastMoves[_gameId][game.players[0]] = Choice.None;
            lastMoves[_gameId][game.players[1]] = Choice.None;
        }
    }

    function _isWinning(Choice a, Choice b) private pure returns (bool) {
        return (a == Choice.Rock && b == Choice.Scissors) ||
               (a == Choice.Scissors && b == Choice.Paper) ||
               (a == Choice.Paper && b == Choice.Rock);
    }

    function _getRoundsNeeded(GameType gameType) private pure returns (uint8) {
        if (gameType == GameType.OneRound) return 1;
        if (gameType == GameType.BestOfThree) return 3;
        return 5; // BestOfFive
    }

    function _finishGame(uint256 _gameId) private nonReentrant {
        Game storage game = games[_gameId];

        game.isActive = false;

        address winner = game.scores[0] > game.scores[1] ? game.players[0] : game.players[1];
        game.winner = winner;

        uint256 fee = (game.totalPot * platformFee) / 1000;
        uint256 payout = game.totalPot - fee;

        platformBalance += fee;

        (bool success, ) = payable(winner).call{ value: payout }("");
        require(success, "Payout failed");

        emit GameFinished(_gameId, winner, payout);
    }

    function withdrawPlatformFee() external onlyOwner nonReentrant {
        uint256 amount = platformBalance;
        platformBalance = 0;

        (bool success, ) = payable(owner()).call{ value: amount }("");
        require(success, "Withdrawal failed");

        emit FeeWithdrawn(owner(), amount);
    }

    function getGame(uint256 _gameId) external view gameExists(_gameId) returns (Game memory) {
        return games[_gameId];
    }

    function getPlayerGames(address _player) external view returns (uint256[] memory) {
        return playerGames[_player];
    }

    function getLastMove(uint256 _gameId, address _player) external view gameExists(_gameId) returns (Choice) {
        return lastMoves[_gameId][_player];
    }
}
