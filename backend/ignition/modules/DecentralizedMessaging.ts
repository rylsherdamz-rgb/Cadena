import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MessagingModule = buildModule("MessagingModule", (m) => {
  const messaging = m.contract("DecentralizedMessaging");
  return { messaging };
});

export default MessagingModule;
