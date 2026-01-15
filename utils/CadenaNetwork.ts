import { Chain } from "@wagmi/core/chains"

export const tenderlyTestnet: Chain = {
  id: 154453, // ✅ your custom Tenderly chain ID
  name: "Cadena",
  nativeCurrency: {
    name: "Cadena",
    symbol: "CAD",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        "https://virtual.mainnet.eu.rpc.tenderly.co/5fbac84b-58e8-4f34-8f05-4054d00f711d"
      ],
    },
    public: {
      http: [
        "https://virtual.mainnet.eu.rpc.tenderly.co/5fbac84b-58e8-4f34-8f05-4054d00f711d"
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

