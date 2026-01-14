import hre from "hardhat";

async function main() {
  const { ethers, network } = hre;

  console.log("====================================");
  console.log("🚀 Deploying Election contract");
  console.log("🌐 Network:", network.name);
  console.log("====================================");

  const [deployer] = await ethers.getSigners();

  console.log("👤 Deployer:", deployer.address);
  console.log(
    "💰 Balance:",
    ethers.formatEther(await deployer.provider.getBalance(deployer.address)),
    "ETH"
  );

  const Election = await ethers.getContractFactory("RockPaperScissors");

  console.log("⏳ Deploying...");
  const election = await Election.deploy();

  await election.waitForDeployment();

  const address = await election.getAddress();

  console.log("====================================");
  console.log("✅ Election deployed successfully");
  console.log("📄 Contract address:", address);
  console.log("====================================\n");

  console.log("👉 Add this to your .env / .env.local:");
  console.log(`NEXT_PUBLIC_ROCK_CONTRACT_ADDRESS=${address}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:");
  console.error(error);
  process.exitCode = 1;
});
