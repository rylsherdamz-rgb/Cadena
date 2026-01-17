"use client";

import { useState, useEffect } from "react";
import { 
  Github, 
  Twitter, 
  Cpu, 
  Terminal, 
  ShieldCheck, 
  ExternalLink,
  Globe
} from "lucide-react";

export default function Footer() {
  const [time, setTime] = useState("");

  // System time for the "Terminal" feel
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="w-full bg-white border-t-8 border-black pt-16 pb-8 px-6 md:px-10">
      <div className="container mx-auto">
        
        {/* TOP SECTION: LOGO & STATUS */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
          <div className="space-y-6 max-w-md">
            <div className="flex items-center gap-3">
              <div className="bg-black p-2">
                <Terminal size={32} className="text-white" />
              </div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                CADENA <br /> <span className="text-gray-300 underline decoration-black underline-offset-4">SYSTEMS</span>
              </h2>
            </div>
            <p className="font-bold text-xs uppercase tracking-[0.2em] leading-relaxed text-gray-500">
              Distributed Ledger Technology for Sovereign Simulations. 
              Built on Open-Source Protocols for the 2025 Consensus Cycle.
            </p>
          </div>

          {/* STATUS TERMINAL (Live Data Mock) */}
          <div className="w-full lg:w-96 border-4 border-black p-4 bg-gray-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between border-b-2 border-black pb-2 mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest">System_Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 animate-pulse rounded-full" />
                <span className="text-[10px] font-bold uppercase">Online</span>
              </div>
            </div>
            <div className="space-y-2 font-mono text-[10px] font-bold">
              <p className="flex justify-between"><span>LOCAL_TIME:</span> <span>{time || "00:00:00"}</span></p>
              <p className="flex justify-between"><span>NETWORK:</span> <span>MAINNET_SIM</span></p>
              <p className="flex justify-between"><span>LATENCY:</span> <span>24MS</span></p>
              <p className="flex justify-between text-gray-400"><span>VERSION:</span> <span>v.2.0.4-LATEST</span></p>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: NAVIGATION LINKS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          <div className="space-y-4">
            <h3 className="font-black uppercase text-sm italic border-b-2 border-black w-fit pr-4">Protocols</h3>
            <ul className="space-y-2 text-xs font-bold uppercase tracking-widest text-gray-400">
              <li className="hover:text-black cursor-pointer flex items-center gap-2">Budget_Gov <ExternalLink size={10}/></li>
              <li className="hover:text-black cursor-pointer flex items-center gap-2">Voting_Node <ExternalLink size={10}/></li>
              <li className="hover:text-black cursor-pointer">Transparency_API</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-black uppercase text-sm italic border-b-2 border-black w-fit pr-4">Socials</h3>
            <div className="flex gap-4">
              <div className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all cursor-pointer">
                <Twitter size={20} />
              </div>
              <div className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all cursor-pointer">
                <Github size={20} />
              </div>
              <div className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all cursor-pointer">
                <Globe size={20} />
              </div>
            </div>
          </div>

          <div className="hidden md:block col-span-2 border-l-4 border-black pl-8">
            <h3 className="font-black uppercase text-sm italic mb-4">Newsletter_Node</h3>
            <div className="flex flex-col sm:flex-row gap-0">
              <input 
                type="email" 
                placeholder="USER@NETWORK.COM" 
                className="bg-gray-100 border-2 border-black px-4 py-3 text-xs font-bold focus:outline-none w-full"
              />
              <button className="bg-black text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all border-2 border-black">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: COPYRIGHT & BADGES */}
        <div className="border-t-4 border-black pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            © 2026 CADENA_OS. NO_RIGHTS_RESERVED. OPEN_SOURCE_ALWAYS.
          </p>
          
          <div className="flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2">
              <Cpu size={14} />
              <span className="text-[9px] font-bold uppercase">Hardware_Accelerated</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} />
              <span className="text-[9px] font-bold uppercase">End-to-End_Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}