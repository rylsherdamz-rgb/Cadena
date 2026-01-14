import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

const BudgetModule = buildModule("BudgetModule", (m) => {
  const initialBudget = parseEther("1000"); // 1000 ETH initial budget
  const budget = m.contract("NationalBudgetTracker", [initialBudget]);
  return { budget };
});

export default BudgetModule;
