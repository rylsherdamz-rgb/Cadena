"use client";

import { useState, useEffect } from "react";
import { 
  useAccount, 
  useWriteContract, 
  useReadContract, 
  useWaitForTransactionReceipt,
  useSimulateContract 
} from "wagmi";
import { DecentralizedMessageABI, MessageAddress } from "@/constants/DecentralizeMessaging";

interface Message {
  sender: `0x${string}`;
  content: string;
  timestamp: bigint;
  read: boolean;
}

export function Inbox() {
  const { address, isConnected } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [content, setContent] = useState("");

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

  // Refresh data on any success
  useEffect(() => {
    if (isConfirmedSend || isConfirmedRead) {
      if (isConfirmedSend) {
        setRecipient("");
        setContent("");
      }
      refetch();
    }
  }, [isConfirmedSend, isConfirmedRead, refetch]);

  // Handlers
  const handleSendMessage = () => {
    if (simulateSend?.request) writeSendMessage(simulateSend.request);
  };

  const handleMarkAsRead = (index: number) => {
    writeMarkRead({
      address: MessageAddress,
      abi: DecentralizedMessageABI,
      functionName: "markAsRead",
      args: [BigInt(index)],
    });
  };

  if (!isConnected) return null;

  const messages = (inboxData as Message[]) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT: COMPOSE PANEL */}
      <section className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-800">
          <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </span>
          Send New Message
        </h3>
        
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recipient Address</label>
            <input
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message</label>
            <textarea
              placeholder="Write something nice..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-40 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none"
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!simulateSend?.request || isSending || isConfirmingSend}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
              !simulateSend?.request 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
            }`}
          >
            {isSending ? "Check Wallet..." : isConfirmingSend ? "Confirming on Chain..." : "Broadcast Message"}
          </button>

          {simError && recipient.length === 42 && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-[10px] text-red-600 leading-tight">
                <strong>Simulation Failed:</strong> Your transaction might fail. Check if you have enough gas or if the recipient address is valid.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* RIGHT: INBOX LIST */}
      <section className="lg:col-span-7">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            Your Inbox
            <span className="bg-blue-600 text-white text-xs py-0.5 px-2.5 rounded-full font-medium">
              {messages.length}
            </span>
          </h3>
          <button 
            onClick={() => refetch()} 
            className="p-2 hover:bg-slate-200 rounded-full transition-colors bg-slate-100"
            disabled={isReading}
          >
            <svg className={`w-5 h-5 text-slate-600 ${isReading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-24 bg-white border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
            <div className="text-5xl mb-4 text-slate-200 italic font-serif">"</div>
            <p className="font-medium">No messages found for your address.</p>
            <p className="text-sm">Share your address to start receiving mail.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[...messages].reverse().map((msg, reversedIdx) => {
              const originalIdx = messages.length - 1 - reversedIdx;
              return (
                <div 
                  key={originalIdx} 
                  className={`group relative p-6 rounded-2xl border transition-all duration-300 ${
                    msg.read 
                      ? "bg-white/60 border-slate-200 opacity-90" 
                      : "bg-white border-blue-200 shadow-xl shadow-blue-50 ring-1 ring-blue-50"
                  }`}
                >
                  {/* Unread dot */}
                  {!msg.read && (
                    <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-10 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></span>
                  )}
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Sender</span>
                      <span className="text-sm font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                        {msg.sender.slice(0, 8)}...{msg.sender.slice(-6)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Date Received</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {new Date(Number(msg.timestamp) * 1000).toLocaleDateString(undefined, {
                           month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-700 text-base leading-relaxed mb-6 whitespace-pre-wrap">{msg.content}</p>

                  <div className="flex items-center justify-end border-t border-slate-100 pt-4">
                    {!msg.read ? (
                      <button
                        onClick={() => handleMarkAsRead(originalIdx)}
                        disabled={isConfirmingRead}
                        className="text-xs font-bold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 px-4 py-2 rounded-lg transition-all"
                      >
                        {isConfirmingRead ? "Updating..." : "Mark as Read"}
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-slate-300">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                         <span className="text-[10px] font-bold uppercase tracking-widest">Seen</span>
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
  );
}