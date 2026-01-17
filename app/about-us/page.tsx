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

function AboutUs() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-40">
      
      {/* --- HERO SECTION: THE MANIFESTO --- */}
      <section className="container mx-auto px-6 pt-24 pb-16 border-b-8 border-black">
        <div className="max-w-4xl">
          <div className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] mb-8">
            System_Documentation_v2.0
          </div>
          <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter italic leading-[0.8] mb-12">
            Trust <br /> 
            <span className="text-gray-300">The_Code,</span> <br />
            Not_The_Node.
          </h1>
          <p className="text-lg md:text-2xl font-bold uppercase tracking-tight leading-tight max-w-2xl border-l-8 border-black pl-8 italic">
            Cadena_OS is a decentralized simulation environment built to test the integrity of democratic processes through immutable ledger technology.
          </p>
        </div>
      </section>

      {/* --- CORE PHILOSOPHY: GRID --- */}
      <section className="container mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-b-4 border-black">
        <div className="border-4 border-black p-10 hover:bg-black hover:text-white transition-all group">
          <ShieldCheck size={48} className="mb-6 group-hover:rotate-12 transition-transform" />
          <h3 className="text-3xl font-black uppercase italic mb-4">Immutable_Votes</h3>
          <p className="text-xs font-bold uppercase tracking-widest leading-loose opacity-60">
            Once a vote is cast on the Cadena protocol, it is etched into the blockchain. No central authority can alter, delete, or hide the selection.
          </p>
        </div>

        <div className="border-4 border-black p-10 bg-black text-white translate-y-4 md:translate-y-12 shadow-[15px_15px_0px_0px_rgba(0,0,0,0.2)]">
          <Cpu size={48} className="mb-6 text-gray-400" />
          <h3 className="text-3xl font-black uppercase italic mb-4">Smart_Contracts</h3>
          <p className="text-xs font-bold uppercase tracking-widest leading-loose text-gray-400">
            The election logic is governed by self-executing code. Auditable by anyone, anywhere, at any time. Transparent by default.
          </p>
        </div>

        <div className="border-4 border-black p-10 hover:bg-black hover:text-white transition-all group">
          <Globe size={48} className="mb-6 group-hover:animate-spin" />
          <h3 className="text-3xl font-black uppercase italic mb-4">Global_Access</h3>
          <p className="text-xs font-bold uppercase tracking-widest leading-loose opacity-60">
            A borderless simulation for a borderless technology. Cadena connects users globally to a singular, synchronized state of truth.
          </p>
        </div>
      </section>

      {/* --- TECHNICAL STACK: SCHEMATIC --- */}
      <section className="bg-gray-50 py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-16 underline decoration-4 underline-offset-8">
            Technical_Architecture
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-12">
              <div className="flex gap-8 items-start">
                <div className="bg-black text-white p-4 font-mono font-black text-xl">01</div>
                <div>
                  <h4 className="text-xl font-black uppercase italic">Frontend_Core</h4>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-2">Next.js 14 / TailwindCSS / Lucide Icons</p>
                  <p className="mt-4 text-sm font-bold text-gray-600">Built for speed and high-contrast accessibility. Every interaction is designed to feel like a high-stakes protocol execution.</p>
                </div>
              </div>

              <div className="flex gap-8 items-start">
                <div className="bg-black text-white p-4 font-mono font-black text-xl">02</div>
                <div>
                  <h4 className="text-xl font-black uppercase italic">Web3_Connectivity</h4>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-2">Wagmi / Viem / RainbowKit</p>
                  <p className="mt-4 text-sm font-bold text-gray-600">Seamless wallet integration and real-time blockchain synchronization. We use the latest hooks to ensure hydration-safe data fetching.</p>
                </div>
              </div>

              <div className="flex gap-8 items-start">
                <div className="bg-black text-white p-4 font-mono font-black text-xl">03</div>
                <div>
                  <h4 className="text-xl font-black uppercase italic">Smart_Logic</h4>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-2">Solidity / EVM Compatible</p>
                  <p className="mt-4 text-sm font-bold text-gray-600">Our election and messaging contracts are optimized for gas efficiency while maintaining maximum security across the decentralized network.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="border-8 border-black p-12 bg-white rotate-3 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
                <TerminalIcon size={64} className="mb-8" />
                <div className="space-y-2 font-mono text-[10px] font-black uppercase">
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

      {/* --- TEAM/VISION SECTION --- */}
      <section className="container mx-auto px-6 py-32 border-t-8 border-black">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="max-w-xl">
            <h2 className="text-6xl font-black uppercase tracking-tighter italic leading-none mb-8">
              Join_The <br /> <span className="text-gray-300">Consensus.</span>
            </h2>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-500 leading-relaxed">
              We are a collective of developers and researchers dedicated to exploring the intersection of distributed systems and civic engagement. Cadena_OS is our gift to the open-source community.
            </p>
          </div>
          
          <button className="px-12 py-6 bg-black text-white font-black uppercase text-sm tracking-[0.5em] hover:bg-white hover:text-black border-4 border-black transition-all flex items-center gap-4">
            Contact_Us <ArrowRight />
          </button>
        </div>
      </section>
    </div>
  );
}

export default dynamic(() => Promise.resolve(AboutUs), { ssr: false });