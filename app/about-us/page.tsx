'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Lock, 
  Zap, 
  Users, 
  Database,
  ArrowRight,
  Terminal as TerminalIcon
} from 'lucide-react';

export default function AboutUs() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20 md:pb-40">
      
      <section className="container mx-auto px-4 md:px-6 pt-16 md:pt-24 pb-12 md:pb-16 border-b-8 border-black">
        <div className="max-w-4xl">
          <div className="inline-block px-3 py-1 bg-black text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-6 md:mb-8">
            System_Documentation_v2.0
          </div>
          <h1 className="text-5xl sm:text-4xl md:text-9xl font-black uppercase tracking-tighter italic leading-[0.9] md:leading-[0.8] mb-8 md:mb-12">
            Trust <br className="hidden sm:block" /> 
            <span className="text-gray-300">The_Code,</span> <br className="hidden sm:block" />
            Not_The_Node.
          </h1>
          <p className="text-base md:text-2xl font-bold uppercase tracking-tight leading-tight max-w-2xl border-l-4 md:border-l-8 border-black pl-4 md:pl-8 italic">
            Cadena_OS is a decentralized simulation environment built to test the integrity of democratic processes through immutable ledger technology.
          </p>
        </div>
      </section>

      {/* --- CORE PHILOSOPHY --- */}
      <section className="container mx-auto px-4 md:px-6 py-12 md:py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-0 border-b-4 border-black">
        <div className="border-4 border-black p-6 md:p-10 hover:bg-black hover:text-white transition-all group">
          <ShieldCheck size={40} className="md:w-12 md:h-12 mb-6 group-hover:rotate-12 transition-transform" />
          <h3 className="text-2xl md:text-3xl font-black uppercase italic mb-4">Immutable_Votes</h3>
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest leading-loose opacity-60">
            Once a vote is cast on the Cadena protocol, it is etched into the blockchain. No central authority can alter, delete, or hide the selection.
          </p>
        </div>

        <div className="border-4 border-black p-6 md:p-10 bg-black text-white md:translate-y-12 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.2)] md:shadow-[15px_15px_0px_0px_rgba(0,0,0,0.2)]">
          <Cpu size={40} className="md:w-12 md:h-12 mb-6 text-gray-400" />
          <h3 className="text-2xl md:text-3xl font-black uppercase italic mb-4">Smart_Contracts</h3>
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest leading-loose text-gray-400">
            The election logic is governed by self-executing code. Auditable by anyone, anywhere, at any time. Transparent by default.
          </p>
        </div>

        <div className="border-4 border-black p-6 md:p-10 hover:bg-black hover:text-white transition-all group">
          <Globe size={40} className="md:w-12 md:h-12 mb-6 group-hover:animate-spin" />
          <h3 className="text-2xl md:text-3xl font-black uppercase italic mb-4">Global_Access</h3>
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest leading-loose opacity-60">
            A borderless simulation for a borderless technology. Cadena connects users globally to a singular, synchronized state of truth.
          </p>
        </div>
      </section>

      {/* --- TECHNICAL STACK --- */}
      <section className="bg-gray-50 py-16 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic mb-12 md:mb-16 underline decoration-4 underline-offset-8">
            Technical_Architecture
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8 md:space-y-12">
              {[
                { id: "01", title: "Frontend_Core", tech: "Next.js 14 / TailwindCSS / Lucide Icons", desc: "Built for speed and high-contrast accessibility. Every interaction is designed to feel like a high-stakes protocol execution." },
                { id: "02", title: "Web3_Connectivity", tech: "Wagmi / Viem / RainbowKit", desc: "Seamless wallet integration and real-time blockchain synchronization. We use the latest hooks to ensure hydration-safe data fetching." },
                { id: "03", title: "Smart_Logic", tech: "Solidity / EVM Compatible", desc: "Our election and messaging contracts are optimized for gas efficiency while maintaining maximum security across the decentralized network." }
              ].map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 md:gap-8 items-start">
                  <div className="bg-black text-white p-3 md:p-4 font-mono font-black text-lg md:text-xl shrink-0">
                    {item.id}
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-black uppercase italic">{item.title}</h4>
                    <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-1 md:mt-2">{item.tech}</p>
                    <p className="mt-3 md:mt-4 text-xs md:text-sm font-bold text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5 relative mt-8 lg:mt-0">
              <div className="border-4 md:border-8 border-black p-6 md:p-12 bg-white md:rotate-3 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] md:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
                <TerminalIcon size={48} className="md:w-16 md:h-16 mb-6 md:mb-8" />
                <div className="space-y-2 font-mono text-[8px] md:text-[10px] font-black uppercase">
                  <p className="text-green-600">{">"} SYSTEM_INIT... SUCCESS</p>
                  <p className="">{">"} LOADING_BLOCKCHAIN_STATE...</p>
                  <p className="">{">"} ENCRYPTING_USER_INPUT...</p>
                  <p className="text-red-600 animate-pulse">{">"} WARNING: UNAUTHORIZED_MODIFICATION_IMPOSSIBLE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-16 md:py-32 border-t-8 border-black">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 md:gap-12">
          <div className="max-w-xl">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter italic leading-none mb-6 md:mb-8">
              Join_The <br /> <span className="text-gray-300">Consensus.</span>
            </h2>
            <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-gray-500 leading-relaxed">
              We are a collective of developers and researchers dedicated to exploring the intersection of distributed systems and civic engagement. Cadena_OS is our gift to the open-source community.
            </p>
          </div>
          
          <button className="w-full md:w-auto px-8 md:px-12 py-5 md:py-6 bg-black text-white font-black uppercase text-xs md:text-sm tracking-[0.3em] md:tracking-[0.5em] hover:bg-white hover:text-black border-4 border-black transition-all flex justify-center items-center gap-4">
            Contact_Us <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
