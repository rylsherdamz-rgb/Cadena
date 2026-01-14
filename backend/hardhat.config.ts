import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition-ethers";
import * as tenderly from "@tenderly/hardhat-tenderly";
import * as dotenv from "dotenv"

 
dotenv.config()
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    tenderly: {
      url: "https://virtual.mainnet.eu.rpc.tenderly.co/5fbac84b-58e8-4f34-8f05-4054d00f711d",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 154453
    },
    
  },
    
  tenderly : {
    project: process.env.PROJECT_NAME!,
    username: process.env.USERNAME!,

  },

  }


export default config;
