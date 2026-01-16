import { ethers } from "hardhat";

async function main() {
  const Election = await ethers.getContractFactory("NationalBudget");

  const election = await Election.deploy();
  await election.waitForDeployment();

  console.log("Election deployed at:", await election.getAddress());
}

main().catch(console.error);
