'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Inbox } from "@/components/Inbox";
import { Mail, Shield, Zap, Lock } from "lucide-react";

function MessagePage() {
  const [mounted, setMounted] = useState(false);

  // Fix for Hydration Mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-white text-black font-sans pb-20">
      {/* NAVIGATION / HEADER */}
      <nav className="border-b-4 border-black bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
              <Zap size={20} fill="currentColor" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter italic">
              D-MESSAGE_V1
            </h1>
          </div>
          <ConnectButton showBalance={false} chainStatus="icon" />
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12">
          
          {/* HERO SECTION */}
          <section className="relative">
            <div className="absolute -top-10 -left-10 opacity-[0.03] pointer-events-none">
              <Mail size={300} />
            </div>
            
            <div className="border-l-8 border-black pl-8 space-y-4">
              <h2 className="text-6xl font-black uppercase tracking-tighter leading-none italic">
                Decentralized <br /> 
                <span className="text-gray-300 underline decoration-black decoration-8 underline-offset-8">Inbox</span>
              </h2>
              <p className="text-sm font-bold text-gray-500 max-w-md uppercase tracking-widest leading-relaxed">
                Secure end-to-end messaging protocol. Send encrypted communications directly to any wallet address on-chain.
              </p>
            </div>

            {/* STATUS BADGES */}
            <div className="flex gap-4 mt-8">
              <div className="flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest">
                <Shield size={12} /> Encrypted
              </div>
              <div className="flex items-center gap-2 px-3 py-1 border-2 border-black text-black text-[10px] font-black uppercase tracking-widest">
                <Lock size={12} /> P2P Protocol
              </div>
            </div>
          </section>

          {/* INBOX COMPONENT CONTAINER */}
          <section className="relative">
            {/* Background "Shadow" Box for the Inbox */}
            <div className="absolute inset-0 border-4 border-black translate-x-3 translate-y-3 pointer-events-none" />
            
            <div className="relative bg-white border-4 border-black p-2 md:p-6 min-h-[500px]">
              <div className="mb-6 border-b-2 border-black pb-4 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live_Network_Node
                </span>
                <span className="text-[10px] font-mono text-gray-400">SESSION_ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
              </div>
              
              <Inbox />
            </div>
          </section>

          {/* FOOTER INFO */}
          <footer className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
            <div className="p-6 border-2 border-gray-100 hover:border-black transition-colors group">
              <h4 className="font-black uppercase text-xs mb-2 group-hover:italic transition-all">01. Wallet-to-Wallet</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase leading-normal">No email required. Your address is your identity.</p>
            </div>
            <div className="p-6 border-2 border-gray-100 hover:border-black transition-colors group">
              <h4 className="font-black uppercase text-xs mb-2 group-hover:italic transition-all">02. Permanent Ledger</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase leading-normal">Messages are indexed via decentralized protocols.</p>
            </div>
            <div className="p-6 border-2 border-gray-100 hover:border-black transition-colors group">
              <h4 className="font-black uppercase text-xs mb-2 group-hover:italic transition-all">03. Zero Censorship</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase leading-normal">Communication is permissionless and unstoppable.</p>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}

// Disable SSR to prevent Hydration errors with Wallet connection
export default dynamic(() => Promise.resolve(MessagePage), { ssr: false });