import { Chain } from "@wagmi/core/chains"

export const tenderlyTestnet: Chain = {
  id: 112901, // ✅ your custom Tenderly chain ID
  name: "Cadena (Tenderly Fork)",
  nativeCurrency: {
    name: "Cadena",
    symbol: "CAD",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        "https://virtual.mainnet.eu.rpc.tenderly.co/9cfed6ae-cf6a-43df-ab28-28e771c513da",
      ],
    },
    public: {
      http: [
        "https://virtual.mainnet.eu.rpc.tenderly.co/9cfed6ae-cf6a-43df-ab28-28e771c513da",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Tenderly",
      url: "https://dashboard.tenderly.co",
    },
  },
  testnet: true,
}

