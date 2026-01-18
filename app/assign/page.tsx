"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { 
  useAccount, 
  useWriteContract, 
  useWaitForTransactionReceipt, 
  useReadContract 
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NationalBudgetABI, NationalBudgetAddress } from "@/constants/NationalBudget";
import { gsap } from "gsap";
import { ShieldAlert, ShieldCheck, Cpu, Fingerprint } from "lucide-react";

export default function AssignAuthorities() {
  const { address, isConnected } = useAccount();
  const [targetAddress, setTargetAddress] = useState("");
  const [role, setRole] = useState<"DBM" | "HOUSE" | "SENATE" | "PRESIDENT" | "COA">("DBM");
  const containerRef = useRef(null);
  const scanBarRef = useRef(null);

  const roleMap = { DBM: 0, HOUSE: 1, SENATE: 2, PRESIDENT: 3, COA: 4 };
  const HARDCODED_ADMIN = "0x4cb514b6A03b3f33a4B3c3b13734f56518C78EAf";

  const { data: superAdmin } = useReadContract({
    address: NationalBudgetAddress,
    abi: NationalBudgetABI,
    functionName: "getSuperAdmin",
  });

  const isSuperAdmin = useMemo(() => {
    if (!address) return false;
    return address.toLowerCase() === HARDCODED_ADMIN.toLowerCase();
  }, [address]);

  const { data: hash, writeContract, isPending: isSubmitting } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConnected) {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 });
      gsap.to(scanBarRef.current, { x: "100%", duration: 2, repeat: -1, ease: "linear" });
    }
  }, [isConnected]);

  const handleAssign = () => {
    if (!targetAddress.startsWith("0x") || targetAddress.length !== 42) return;
    writeContract({
      address: NationalBudgetAddress,
      abi: NationalBudgetABI,
      functionName: "addAuthority",
      args: [targetAddress as `0x${string}`, roleMap[role]],
    });
  };

  if (!isConnected) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Fingerprint size={48} className="mb-6 opacity-20" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8">Access Restricted: Auth Required</p>
      <ConnectButton />
    </div>
  );

  return (
    <div ref={containerRef} className="max-w-xl mx-auto py-12 px-6">
      <div className="bg-white border-4 border-black p-8 md:p-12 relative overflow-hidden shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)]">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 overflow-hidden">
          <div ref={scanBarRef} className="w-1/3 h-full bg-black -translate-x-full" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter italic italic">Admin Root</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">Official Node Provisioning</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 border-2 ${isSuperAdmin ? 'border-black text-black' : 'border-gray-200 text-gray-400'}`}>
            {isSuperAdmin ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
            <span className="text-[10px] font-black uppercase tracking-widest">
              {isSuperAdmin ? "Privileged Access" : "Read Only"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-6">
            <div className="p-6 bg-black text-white font-mono text-[11px] leading-relaxed relative overflow-hidden">
              <Cpu size={40} className="absolute -right-4 -bottom-4 opacity-20" />
              <p className="text-gray-500 mb-2 border-b border-gray-800 pb-2 uppercase tracking-widest font-bold">Protocol Diagnostics</p>
              <div className="flex justify-between">
                <span>IDENTITY:</span>
                <span className="text-gray-400 truncate ml-4">{address}</span>
              </div>
              <div className="flex justify-between">
                <span>PERMISSION:</span>
                <span className={isSuperAdmin ? "text-white" : "text-red-500"}>
                  {isSuperAdmin ? "LEVEL_0_SUPERUSER" : "UNAUTHORIZED"}
                </span>
              </div>
            </div>

            <div className="space-y-8">
              <div className="group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 group-focus-within:text-black transition-colors">Target Wallet Address</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={targetAddress}
                  onChange={(e) => setTargetAddress(e.target.value)}
                  className="w-full pb-3 bg-transparent border-b-2 border-gray-100 focus:border-black outline-none font-mono text-sm transition-all placeholder:text-gray-200"
                />
              </div>

              <div className="group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 group-focus-within:text-black transition-colors">Assign State Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full pb-3 bg-transparent border-b-2 border-gray-100 focus:border-black font-black text-black uppercase tracking-tighter cursor-pointer outline-none appearance-none"
                >
                  <option value="DBM">Department of Budget (DBM)</option>
                  <option value="HOUSE">House of Representatives</option>
                  <option value="SENATE">The Senate</option>
                  <option value="PRESIDENT">Presidential Approval</option>
                  <option value="COA">Commission on Audit (COA)</option>
                </select>
              </div>

              <button
                onClick={handleAssign}
                disabled={!isSuperAdmin || isSubmitting || isConfirming}
                className={`w-full py-6 font-black uppercase tracking-[0.3em] transition-all relative overflow-hidden border-2 ${
                  !isSuperAdmin 
                    ? "border-gray-100 text-gray-300 cursor-not-allowed" 
                    : "border-black bg-black text-white hover:bg-white hover:text-black"
                }`}
              >
                {isSubmitting || isConfirming ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="w-2 h-2 bg-current rounded-full animate-ping" />
                    Executing Transaction...
                  </span>
                ) : "Execute Provisioning"}
              </button>

              {isConfirmed && (
                <div className="text-center animate-bounce">
                   <p className="text-[10px] text-black font-black uppercase tracking-widest">
                     ✓ Chain Consensus Reached. Authority Provisioned.
                   </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center gap-4 opacity-40">
        <div className="w-px h-12 bg-black" />
        <p className="text-[9px] font-mono tracking-widest uppercase">{NationalBudgetAddress}</p>
      </div>
    </div>
  );
}
