import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RPSModule = buildModule("RPSModule", (m) => {
  const rps = m.contract("RockPaperScissors");
  return { rps };
});

export default RPSModule;
