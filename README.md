# 🗳️ Cadena - Transparent Blockchain Voting Platform

Cadena is a modern, transparent election platform built on blockchain technology. It enables secure, auditable voting through smart contracts while maintaining voter privacy and preventing fraud.

## 🎯 Overview

**Problem**: Public trust in election systems has been repeatedly tested. Citizens need systems that make misuse difficult and audits immediate.

**Solution**: Cadena embeds transparency into voting through:
- ✅ On-chain vote recording
- ✅ Real-time vote verification
- ✅ Immutable voting records
- ✅ Smart contract enforcement
- ✅ Decentralized validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Web3 wallet (MetaMask, WalletConnect, etc.)

### Installation

```bash
# Clone repository
cd /home/richie/Projects/blockchain

# Run setup script
bash setup.sh

# OR manually:
npm install
cd backend && npm install && cd ..
```

### Configuration

1. **Create `.env.local`** in the root directory:
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ELECTION_CONTRACT_ADDRESS=0x...
```

2. **Deploy contract** (see Deployment section)

### Development

```bash
npm run dev
```

Open http://localhost:3000

## 📋 Features

### Voting Interface
- Connect Web3 wallet
- View candidates and vote counts
- Cast vote with blockchain confirmation
- One-vote-per-person enforcement

### Admin Dashboard
- Add new candidates
- Manage elections
- View candidate list

### Smart Contracts
- **Election.sol**: Core voting contract
- Candidate management
- Vote casting and tallying
- Vote verification

## 📖 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete setup instructions
- **[Contract Docs](./backend/README.md)** - Smart contract details

## 🔧 Deployment

### 1. Deploy Smart Contract

```bash
cd backend

# Set environment variables
export SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
export PRIVATE_KEY=your_private_key

# Deploy
npm run deploy
```

### 2. Update Frontend Configuration

```bash
# Copy contract address to .env.local
NEXT_PUBLIC_ELECTION_CONTRACT_ADDRESS=0x<deployed_address>
```

### 3. Run Application

```bash
npm run dev
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework
- **TailwindCSS 4** - Styling
- **Wagmi 2** - Web3 library
- **RainbowKit** - Wallet connection
- **React Query** - State management
- **TypeScript** - Type safety

### Backend
- **Hardhat 2** - Development environment
- **Solidity 0.8.20** - Smart contract language
- **Ethers.js 6** - Contract interaction
- **Ignition** - Deployment framework

## ⚠️ Disclaimer

This is a prototype/educational project. Do not use in production without professional security audit, legal review, and compliance verification.

---

**Built with ❤️ for transparent democracy**
