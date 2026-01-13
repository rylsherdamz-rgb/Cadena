import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const BudgetModule = buildModule("BudgetModule", (m) => {
  const initialBudget = ethers.parseEther("1000"); // 1000 ETH initial budget
  const budget = m.contract("NationalBudgetTracker", [initialBudget]);
  return { budget };
});

export default BudgetModule;
