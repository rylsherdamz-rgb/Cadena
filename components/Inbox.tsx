"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  useAccount, 
  useWriteContract, 
  useReadContract, 
  useWaitForTransactionReceipt,
  useSimulateContract 
} from "wagmi";
import { DecentralizedMessageABI, MessageAddress } from "@/constants/DecentralizeMessaging";
import { Send, Inbox as InboxIcon, RefreshCw, Eye, EyeOff, ShieldAlert, Terminal } from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  sender: `0x${string}`;
  content: string;
  timestamp: bigint;
  read: boolean;
}

function Inbox() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- 1. READ: getMyMessages ---
  const { 
    data: inboxData, 
    refetch, 
    isLoading: isReading 
  } = useReadContract({
    address: MessageAddress,
    abi: DecentralizedMessageABI,
    functionName: "getMyMessages",
    account: address,
  });

  // --- 2. SIMULATE: sendMessage ---
  const { data: simulateSend, error: simError } = useSimulateContract({
    address: MessageAddress,
    abi: DecentralizedMessageABI,
    functionName: "sendMessage",
    args: [recipient as `0x${string}`, content],
    query: {
      enabled: Boolean(recipient.startsWith("0x") && recipient.length === 42 && content.length > 0),
    }
  });

  // --- 3. WRITE: sendMessage ---
  const { data: sendHash, writeContract: writeSendMessage, isPending: isSending } = useWriteContract();
  const { isLoading: isConfirmingSend, isSuccess: isConfirmedSend } = useWaitForTransactionReceipt({ hash: sendHash });

  // --- 4. WRITE: markAsRead ---
  const { data: readHash, writeContract: writeMarkRead } = useWriteContract();
  const { isLoading: isConfirmingRead, isSuccess: isConfirmedRead } = useWaitForTransactionReceipt({ hash: readHash });

  // Sync and Refresh
  useEffect(() => {
    if (isConfirmedSend || isConfirmedRead) {
      if (isConfirmedSend) {
        setRecipient("");
        setContent("");
        toast.success("Broadcast successful");
      }
      refetch();
    }
  }, [isConfirmedSend, isConfirmedRead, refetch]);

  const handleSendMessage = () => {
    if (simulateSend?.request) {
      writeSendMessage(simulateSend.request);
    }
  };

  const handleMarkAsRead = (index: number) => {
    writeMarkRead({
      address: MessageAddress,
      abi: DecentralizedMessageABI,
      functionName: "markAsRead",
      args: [BigInt(index)],
    });
  };

  if (!mounted || !isConnected) return <div className="min-h-screen bg-white" />;

  const messages = (inboxData as Message[]) || [];

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: COMPOSE PANEL */}
        <section className="lg:col-span-5">
          <div className="bg-white border-4 border-black p-8 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] sticky top-32">
            <div className="flex items-center gap-3 mb-8 border-b-4 border-black pb-4">
              <div className="bg-black p-2 text-white">
                <Send size={20} />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">Broadcast_Node</h3>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Recipient_Address</label>
                <input
                  type="text"
                  placeholder="0x000..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full p-4 border-4 border-black bg-white focus:bg-gray-50 outline-none font-mono text-xs font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Encrypted_Payload</label>
                <textarea
                  placeholder="Enter message content..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 border-4 border-black bg-white h-48 focus:bg-black focus:text-white outline-none transition-all resize-none font-bold"
                />
              </div>

              <button
                onClick={handleSendMessage}
                disabled={!simulateSend?.request || isSending || isConfirmingSend}
                className={`w-full py-6 border-4 border-black font-black uppercase tracking-[0.4em] text-sm transition-all flex items-center justify-center gap-4 ${
                  !simulateSend?.request 
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                    : "bg-black text-white hover:bg-white hover:text-black active:translate-y-1"
                }`}
              >
                {isSending ? "Authorizing..." : isConfirmingSend ? "Mining_Block..." : "Execute_Broadcast"}
              </button>

              {simError && recipient.length === 42 && (
                <div className="p-4 bg-red-50 border-2 border-red-600 flex items-start gap-3">
                  <ShieldAlert size={18} className="text-red-600 flex-shrink-0" />
                  <p className="text-[9px] font-black text-red-600 uppercase leading-tight">
                    Simulation_Failed: Check GAS_LIMIT or ADDR_VALIDITY
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT: INBOX LIST */}
        <section className="lg:col-span-7">
          <div className="flex justify-between items-end mb-10 border-b-8 border-black pb-6">
            <div>
              <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
                Private <br /> <span className="text-gray-300">Archives</span>
              </h3>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mt-4 flex items-center gap-2">
                <Terminal size={14} /> Total_Entries: {messages.length}
              </p>
            </div>
            <button 
              onClick={() => refetch()} 
              className={`p-4 border-4 border-black transition-all active:rotate-180 ${isReading ? 'bg-black text-white' : 'bg-white hover:bg-black hover:text-white'}`}
            >
              <RefreshCw size={24} className={isReading ? 'animate-spin' : ''} />
            </button>
          </div>

          {messages.length === 0 ? (
            <div className="border-4 border-dashed border-gray-200 p-24 text-center">
              <InboxIcon size={48} className="mx-auto mb-4 text-gray-200" />
              <p className="font-black uppercase text-gray-300 tracking-[0.2em]">Zero_Messages_Detected</p>
            </div>
          ) : (
            <div className="space-y-8">
              {[...messages].reverse().map((msg, reversedIdx) => {
                const originalIdx = messages.length - 1 - reversedIdx;
                return (
                  <div 
                    key={originalIdx} 
                    className={`relative p-8 border-4 border-black transition-all ${
                      msg.read 
                        ? "bg-white opacity-60 shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]" 
                        : "bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] translate-x-[-4px] translate-y-[-4px]"
                    }`}
                  >
                    {!msg.read && (
                      <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 text-[10px] font-black uppercase">
                        New_Transmission
                      </div>
                    )}
                    
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8 border-b-2 border-black/5 pb-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Origin_Node</span>
                        <p className="text-xs font-mono font-black break-all bg-gray-100 px-2 py-1">{msg.sender}</p>
                      </div>
                      <div className="md:text-right space-y-1">
                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Received_At</span>
                        <p className="text-[10px] font-black uppercase">
                          {new Date(Number(msg.timestamp) * 1000).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 border-l-8 border-black mb-8">
                      <p className="text-lg font-bold leading-tight whitespace-pre-wrap tracking-tight italic">
                        "{msg.content}"
                      </p>
                    </div>

                    <div className="flex items-center justify-end">
                      {!msg.read ? (
                        <button
                          onClick={() => handleMarkAsRead(originalIdx)}
                          className="px-6 py-2 bg-black text-white font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black border-2 border-black transition-all flex items-center gap-2"
                        >
                          <Eye size={14} /> Open_Payload
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-300">
                           <EyeOff size={14} />
                           <span className="text-[9px] font-black uppercase tracking-widest">Stored_In_Archive</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Inbox), { ssr: false });