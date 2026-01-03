import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  sepolia,
} from "wagmi/chains";
import { http } from 'wagmi';


export const config = getDefaultConfig({
  appName: 'Cadena',
  projectId: '',
  chains: [
    sepolia,
    // ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
  ssr: true,
  transports: {
    [sepolia.id]: http(
      ''
    ),
  },
});


//add proper config for this
