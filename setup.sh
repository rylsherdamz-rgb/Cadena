#!/bin/bash

# Cadena - Quick Start Setup Script
# This script sets up the entire Cadena project for development

echo "🚀 Cadena Quick Start Setup"
echo "=============================="

# Check Node.js
echo "✓ Checking Node.js installation..."
node -v || { echo "❌ Node.js not found. Please install Node.js v18+"; exit 1; }

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Copy .env.example to .env.local and fill in your values:"
echo "   - Get WalletConnect ID from https://cloud.walletconnect.com"
echo "   - Deploy Election contract (see DEPLOYMENT_GUIDE.md)"
echo ""
echo "2. Deploy the smart contract:"
echo "   cd backend"
echo "   npx hardhat run scripts/deploy.ts --network sepolia"
echo ""
echo "3. Update NEXT_PUBLIC_ELECTION_CONTRACT_ADDRESS in .env.local"
echo ""
echo "4. Start the development server:"
echo "   npm run dev"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
