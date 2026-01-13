# Cadena - Complete Blockchain Platform

A fully functional decentralized platform built with Next.js and Hardhat featuring:

✅ **Election Voting System** - On-chain transparent voting
✅ **Rock Paper Scissors Game** - Decentralized gaming with stake wagering
✅ **Decentralized Messaging** - Peer-to-peer encrypted messaging
✅ **National Budget Tracker** - Transparent public fund management inspired by Bam Aquino's principles

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn
- MetaMask or WalletConnect wallet

### Frontend Setup

```bash
# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Edit .env.local with your contract addresses and WalletConnect ID

# Run development server
npm run dev
```

Visit `http://localhost:3000`

### Backend Setup & Deployment

```bash
cd backend

# Install dependencies
npm install

# Create .env
SEPOLIA_RPC_URL=your_rpc_url
PRIVATE_KEY=your_private_key

# Deploy all contracts
npx hardhat ignition deploy ignition/modules/Election.ts --network sepolia
npx hardhat ignition deploy ignition/modules/RockPaperScissors.ts --network sepolia
npx hardhat ignition deploy ignition/modules/DecentralizedMessaging.ts --network sepolia
npx hardhat ignition deploy ignition/modules/NationalBudget.ts --network sepolia

# Copy deployed addresses to frontend .env.local
```

## 📋 Features Overview

### 1. **Election Voting** 🗳️
- View candidates and their vote counts
- Cast one vote per address
- Real-time vote tracking
- Admin dashboard to add candidates

**Contract:** `Election.sol`
- Public voting mechanism
- Candidate management
- Vote counting and verification

### 2. **Rock Paper Scissors** 🎮
- Create games with ETH stakes
- Join existing games
- Play best-of-1, best-of-3, or best-of-5
- Automatic winner detection and payout
- Platform fee collection (2.5%)

**Contract:** `RockPaperScissors.sol`
- Multiplayer gaming
- Stake management
- Round tracking
- Payout distribution

### 3. **Decentralized Messaging** 💬
- Send messages directly to wallets
- Real-time delivery and read receipts
- Conversation history
- Unread message counter

**Contract:** `DecentralizedMessaging.sol`
- Peer-to-peer messaging
- Conversation management
- Message history
- Read status tracking

### 4. **National Budget Tracker** 💰
Inspired by Bam Aquino's transparency principles:

- **Budget Allocation**: Allocate funds to different government categories
  - Healthcare, Education, Infrastructure, Public Works, Defense, Agriculture, Social Welfare, Environment, Tourism

- **Allocation Tracking**: Monitor fund usage from allocation to spending
  - Proposed → Approved → Disbursed → Spent

- **Milestone Management**: Track project milestones
  - Define completion targets
  - Mark milestones as complete

- **Expense Recording**: Document all spending
  - Vendor information
  - Receipt documentation (IPFS hash)
  - Expense verification

- **Audit Trail**: Complete audit history
  - Auditor findings
  - Compliance status
  - Dispute tracking

**Contract:** `NationalBudgetTracker.sol`
- Full transparency of government spending
- Multi-level approval process
- Comprehensive audit trails
- Real-time budget status

## 📱 Pages

- `/` - Home page
- `/cadena` - Election voting page
- `/rock-game` - Rock paper scissors game
- `/blockchain-app` - All-in-one application hub
- `/admindashboard` - Admin controls
- `/about-us` - Project information

## 🔧 Configuration

### Environment Variables

```env
# Wallet Connection
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<your_id>

# Contract Addresses (Sepolia)
NEXT_PUBLIC_ELECTION_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_RPS_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_MESSAGING_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_BUDGET_CONTRACT_ADDRESS=0x...

# Backend
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/<key>
PRIVATE_KEY=<your_key>
```

## 📊 Contract Architecture

```
backend/contracts/
├── Election.sol                 # Voting system
├── RockPaperScissors.sol        # Gaming platform
├── DecentralizedMessaging.sol   # Messaging service
└── NationalBudget.sol           # Budget tracker
```

## 🎯 Key Features

### Security
- ✅ ReentrancyGuard on all monetary transactions
- ✅ Access control (Ownable, role-based)
- ✅ Input validation
- ✅ Safe math operations

### Transparency
- ✅ All transactions on-chain
- ✅ Immutable audit trails
- ✅ Public verification capabilities
- ✅ Real-time status tracking

### User Experience
- ✅ RainbowKit wallet integration
- ✅ Real-time updates via Wagmi
- ✅ Responsive design
- ✅ Clear transaction feedback

## 🧪 Testing

```bash
cd backend
npx hardhat test
```

## 🌐 Supported Networks

- **Sepolia Testnet** (Primary)
- **Tenderly Virtual Testnet** (Testing)

## 📖 Documentation

See `DEPLOYMENT_GUIDE.md` for comprehensive deployment instructions.

## 🤝 Contributing

Contributions welcome! Please submit PRs with:
- Detailed description
- Test coverage
- Documentation updates

## 📄 License

MIT License - See LICENSE file

## 🙏 Inspiration

This project embodies the transparent governance principles championed by Bam Aquino, bringing blockchain technology to real-world government applications.

## 📞 Support

For issues or questions:
1. Check existing documentation
2. Review contract code
3. Open an issue on GitHub

---

**Built with ❤️ for transparent governance**
