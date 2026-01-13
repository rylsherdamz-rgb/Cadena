"use client"

import { ReactNode } from "react"
import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { sepolia } from "wagmi/chains"
import { http, WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { tenderlyTestnet } from "@/utils/CadenaNetwork"

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  const config = getDefaultConfig({
    appName: "Cadena",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [sepolia, tenderlyTestnet],
    ssr: true,
    // Important: define transports for *every* chain you pass in `chains`
    transports: {
      // Sepolia – use your own RPC URL (recommended: Infura/Alchemy)
      [sepolia.id]: http(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ??
          "https://sepolia.infura.io/v3/YOUR_INFURA_KEY"
      ),
      // Custom Tenderly testnet
      [tenderlyTestnet.id]: http(
        "https://virtual.mainnet.eu.rpc.tenderly.co/9cfed6ae-cf6a-43df-ab28-28e771c513da"
      ),
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
