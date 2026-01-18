'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Inbox from "@/components/Inbox";
import { Mail, Shield, Zap, Lock, Menu } from "lucide-react";

function MessagePage() {
  const [mounted, setMounted] = useState(false);
  
  const sessionId = useMemo(() => Math.random().toString(36).substring(7).toUpperCase(), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-white text-black font-sans pb-10 md:pb-20">
      <nav className="border-b-4 border-black bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="scale-90 md:scale-100 origin-right">
            <ConnectButton showBalance={false} chainStatus="icon" />
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:gap-12">
          
          {/* HERO SECTION */}
          <section className="relative overflow-hidden md:overflow-visible py-4">
            <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 opacity-[0.03] pointer-events-none">
              <Mail size={150} className="md:w-[300px] md:h-[300px]" />
            </div>
            
            <div className="border-l-4 md:border-l-8 border-black pl-4 md:pl-8 space-y-3 md:space-y-4">
              <h2 className="text-md md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] italic">
                Decentralized <br /> 
                <span className="text-zinc-200 underline decoration-black decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8">Inbox</span>
              </h2>
              <p className="text-[10px] md:text-sm font-bold text-zinc-500 max-w-xs md:max-w-md uppercase tracking-widest leading-relaxed">
                Secure end-to-end messaging protocol. Send encrypted communications directly to any wallet address on-chain.
              </p>
            </div>

            {/* STATUS BADGES - Wrap on small screens */}
            <div className="flex flex-wrap gap-2 md:gap-4 mt-6 md:mt-8">
              <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-black text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                <Shield size={10} className="md:w-3 md:h-3" /> Encrypted
              </div>
              <div className="flex items-center gap-2 px-2 md:px-3 py-1 border-2 border-black text-black text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                <Lock size={10} className="md:w-3 md:h-3" /> P2P Protocol
              </div>
            </div>
          </section>

          {/* INBOX COMPONENT CONTAINER */}
          <section className="relative mt-4">
            {/* Reduced offset for mobile shadow */}
            <div className="absolute inset-0 border-2 md:border-4 border-black translate-x-1.5 translate-y-1.5 md:translate-x-3 md:translate-y-3 pointer-events-none" />
            
            <div className="relative bg-white border-2 md:border-4 border-black p-3 md:p-6 min-h-[400px] md:min-h-[500px]">
              <div className="mb-4 md:mb-6 border-b-2 border-black pb-3 md:pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[9px] md:text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live_Network_Node
                </span>
                <span className="text-[8px] md:text-[10px] font-mono text-zinc-400 bg-zinc-50 px-2 py-0.5 border border-zinc-200 self-start sm:self-auto">
                  SESSION_ID: {sessionId}
                </span>
              </div>
              
              <div className="overflow-x-hidden">
                <Inbox />
              </div>
            </div>
          </section>

          {/* FOOTER INFO - Responsive Grid */}
          <footer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-10">
            <div className="p-4 md:p-6 border-2 border-zinc-100 hover:border-black transition-all group cursor-default">
              <h4 className="font-black uppercase text-[10px] md:text-xs mb-1 md:mb-2 group-hover:italic transition-all">01. Wallet-to-Wallet</h4>
              <p className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase leading-normal">No email required. Your address is your identity.</p>
            </div>
            <div className="p-4 md:p-6 border-2 border-zinc-100 hover:border-black transition-all group cursor-default">
              <h4 className="font-black uppercase text-[10px] md:text-xs mb-1 md:mb-2 group-hover:italic transition-all">02. Permanent Ledger</h4>
              <p className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase leading-normal">Messages are indexed via decentralized protocols.</p>
            </div>
            <div className="p-4 md:p-6 border-2 border-zinc-100 hover:border-black transition-all group cursor-default sm:col-span-2 md:col-span-1">
              <h4 className="font-black uppercase text-[10px] md:text-xs mb-1 md:mb-2 group-hover:italic transition-all">03. Zero Censorship</h4>
              <p className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase leading-normal">Communication is permissionless and unstoppable.</p>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}

export default dynamic(() => Promise.resolve(MessagePage), { ssr: false });