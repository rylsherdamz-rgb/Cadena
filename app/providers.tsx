"use client"

import { ReactNode } from "react"
import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { sepolia } from "wagmi/chains"
import { http, WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  const config = getDefaultConfig({
    appName: "Cadena",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [ sepolia],
    ssr: true,
    transports: {
      [sepolia.id]: http(
        process.env.NEXT_PUBLIC_ALCHEMY_URL
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
