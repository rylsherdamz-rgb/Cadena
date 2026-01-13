import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { http } from "wagmi"
import { sepolia } from "wagmi/chains"
import { tenderlyTestnet } from "./CadenaNetwork"


export const config = getDefaultConfig({
  appName: "Cadena",

  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

  chains: [ sepolia],

  ssr: true,

  transports: {
    [tenderlyTestnet.id]: http(
      "https://virtual.mainnet.eu.rpc.tenderly.co/9cfed6ae-cf6a-43df-ab28-28e771c513da"
    ),
  },
})
