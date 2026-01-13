# Cadena - Blockchain Voting Platform - Setup & Deployment Guide

## Project Overview
Cadena is a blockchain-based voting platform built with Next.js and Hardhat that demonstrates transparent, decentralized election management using the Ethereum blockchain.

### Key Features
- **Web3 Wallet Integration**: Connect using RainbowKit + Wagmi
- **Smart Contract Voting**: Vote on candidates stored on-chain
- **Real-time Vote Tracking**: See vote counts update in real-time
- **Admin Dashboard**: Add candidates and manage elections

---

## Prerequisites

Ensure you have installed:
- Node.js (v18+)
- npm or yarn
- A Web3 wallet (MetaMask, WalletConnect, etc.)

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd /home/richie/Projects/blockchain
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:

```bash
# Get a WalletConnect Project ID from https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# After deploying the Election contract (see Backend Setup)
NEXT_PUBLIC_ELECTION_CONTRACT_ADDRESS=0x...
```

### 3. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

---

## Backend Setup & Contract Deployment

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Configure Backend Environment
Create a `.env` file in the `backend` directory:

```bash
# Sepolia Testnet RPC URL (get from Infura, Alchemy, or QuickNode)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Your wallet private key (for deployment)
PRIVATE_KEY=your_private_key_here
```

⚠️ **SECURITY WARNING**: Never commit `.env` files. Add to `.gitignore`

### 3. Deploy Election Contract to Sepolia Testnet
```bash
# From the backend directory
npx hardhat run scripts/deploy.ts --network sepolia
```

The output will show:
```
Election contract deployed to: 0x...
```

### 4. Alternative: Deploy Using Ignition
```bash
npx hardhat ignition deploy ignition/modules/Election.ts --network sepolia
```

### 5. Copy Contract Address to Frontend
Copy the deployed address and update your `.env.local`:
```bash
NEXT_PUBLIC_ELECTION_CONTRACT_ADDRESS=0x[deployed_address]
```

---

## Contract Functions

### Read Functions (Free)
- `candidatesCount()` - Get total number of candidates
- `getCandidate(id)` - Get candidate details (name, party, votes)
- `hasVoted(address)` - Check if address has voted

### Write Functions (Require Gas)
- `addCandidate(name, party)` - Add new candidate (Admin only)
- `vote(candidateId)` - Cast vote for a candidate

### Events
- `CandidateAdded(id, name, party)` - Emitted when candidate is added
- `VoteCast(voter, candidateId)` - Emitted when vote is cast

---

## Usage Guide

### 1. Connect Wallet
- Click "Connect Wallet" button (top-right of Cadena page)
- Select your wallet provider
- Approve the connection

### 2. View Candidates
- Candidates will display with current vote counts
- Shows which party each candidate represents

### 3. Cast Your Vote
- Click "Vote" button on your chosen candidate
- Confirm the transaction in your wallet
- Wait for blockchain confirmation
- Once voted, you can't vote again in this election

### 4. Admin: Add Candidates
- Navigate to `/admindashboard`
- Add new candidates with name and party
- Transactions require admin wallet

---

## Project Structure

```
blockchain/
├── app/
│   ├── cadena/                 # Main voting page
│   ├── (Protected)/           # Protected routes
│   ├── constants/
│   │   └── electionContract.ts # Contract ABI & address
│   └── providers.tsx           # Web3 providers setup
├── backend/
│   ├── contracts/
│   │   └── Election.sol        # Smart contract
│   ├── ignition/modules/
│   │   └── Election.ts         # Deployment module
│   ├── scripts/
│   │   └── deploy.ts           # Deployment script
│   └── hardhat.config.ts       # Hardhat configuration
├── components/
│   ├── VotingComponent.tsx      # Voting interface
│   ├── CadenaMainContent.tsx    # Main content area
│   ├── Navigation.tsx           # Navigation bar
│   └── ...
└── utils/
    ├── useElectionContract.ts   # Contract interaction hooks
    └── wagmi.ts                 # Wagmi configuration
```

---

## Supported Networks

The app is configured for:
- **Sepolia Testnet** - Primary deployment network
- **Tenderly Testnet** - Virtual testnet for testing

Switch networks in your wallet to interact with different deployments.

---

## Testing

### 1. Test Wallet Connection
- Click Connect Wallet
- Verify wallet address appears

### 2. Test Voting
- With connected wallet, click Vote on any candidate
- Confirm transaction
- Verify vote count increases
- Try voting again (should be blocked)

### 3. Monitor Events
- Open browser DevTools Console
- Vote and watch for contract events
- Events appear in logs and on-chain

---

## Troubleshooting

### "Cannot find module '@rainbow-me/rainbowkit'"
```bash
# Ensure correct wagmi version
npm install wagmi@^2.11.5
```

### "Contract Not Configured"
- Verify `NEXT_PUBLIC_ELECTION_CONTRACT_ADDRESS` is set in `.env.local`
- Ensure it's a valid contract address

### Transaction Failed
- Check wallet has sufficient gas (testnet ETH)
- Verify you're on correct network
- Check contract address is deployed on that network

### Wallet Won't Connect
- Clear browser cache
- Try different wallet
- Check WalletConnect Project ID is valid

---

## Development Commands

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Run production build
npm run lint     # Run ESLint
```

### Backend
```bash
cd backend
npx hardhat compile              # Compile contracts
npx hardhat test                # Run tests
npx hardhat run scripts/deploy.ts --network sepolia  # Deploy
```

---

## Security Considerations

1. **Never share private keys**
2. **Use testnet for development**
3. **Test contracts before mainnet deployment**
4. **Keep dependencies updated**
5. **Use environment variables for secrets**

---

## Next Steps

1. ✅ Deploy Election contract
2. ✅ Connect wallet on frontend
3. ✅ Cast votes and verify
4. 🔄 Add more features (token-gated voting, timed elections)
5. 🔄 Deploy to production network

---

## Support & Resources

- [Hardhat Docs](https://hardhat.org/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Ethers.js Docs](https://docs.ethers.org/)
- [Sepolia Faucet](https://www.sepoliafaucet.com/)
- [Etherscan Sepolia](https://sepolia.etherscan.io/)

---

## License
MIT License - See LICENSE file for details
