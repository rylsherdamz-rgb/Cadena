import hre from "hardhat";

async function main() {
  console.log("Deploying Election contract...");

  const election = await hre.ethers.deployContract("Election", []);

  await election.waitForDeployment();

  const deployedAddress = await election.getAddress();
  console.log("Election contract deployed to:", deployedAddress);

  // Save the address to a file or display it
  console.log("\nAdd this to your .env.local file:");
  console.log(`NEXT_PUBLIC_ELECTION_CONTRACT_ADDRESS=${deployedAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
