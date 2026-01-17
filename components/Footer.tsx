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

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="w-full bg-white border-t-8 border-black pt-16 pb-8 px-6 md:px-10">
      <div className="container mx-auto">
        
        {/* TOP SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
          <div className="space-y-6 max-w-md">
            <div className="flex items-center gap-3">
              <div className="bg-black p-2">
                <Terminal size={32} className="text-white" />
              </div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none text-black">
                CADENA  
              </h2>
            </div>
            {/* FIXED: Changed text-gray-500 to text-black for readability */}
            <p className="font-bold text-xs uppercase tracking-[0.15em] leading-relaxed text-black">
              Distributed Ledger Technology for Sovereign Simulations. 
              Built on Open-Source Protocols for the 2026 Consensus Cycle.
            </p>
          </div>

          {/* STATUS TERMINAL */}
          <div className="w-full lg:w-96 border-4 border-black p-5 bg-zinc-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between border-b-2 border-black pb-2 mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-black">System_Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-600 animate-pulse rounded-full border border-black" />
                <span className="text-[10px] font-black uppercase text-black">Online</span>
              </div>
            </div>
            {/* FIXED: Changed all text within terminal to black/zinc-800 */}
            <div className="space-y-2 font-mono text-[11px] font-black">
              <p className="flex justify-between text-black"><span>LOCAL_TIME:</span> <span>{time || "00:00:00"}</span></p>
              <p className="flex justify-between text-black"><span>NETWORK:</span> <span>MAINNET_SIM</span></p>
              <p className="flex justify-between text-black"><span>LATENCY:</span> <span>24MS</span></p>
              <p className="flex justify-between text-zinc-500 italic"><span>VERSION:</span> <span>v.2.0.4-LATEST</span></p>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          <div className="space-y-4">
            <h3 className="font-black uppercase text-sm italic border-b-2 border-black w-fit pr-4 text-black">Protocols</h3>
            {/* FIXED: Increased text weight and changed color to zinc-800 */}
            <ul className="space-y-3 text-[11px] font-black uppercase tracking-widest text-zinc-800">
              <li className="hover:underline hover:text-black cursor-pointer flex items-center gap-2 transition-all">Budget_Gov <ExternalLink size={12}/></li>
              <li className="hover:underline hover:text-black cursor-pointer flex items-center gap-2 transition-all">Voting_Node <ExternalLink size={12}/></li>
              <li className="hover:underline hover:text-black cursor-pointer transition-all">Transparency_API</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-black uppercase text-sm italic border-b-2 border-black w-fit pr-4 text-black">Socials</h3>
            <div className="flex gap-4">
              <div className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none">
                <Twitter size={20} />
              </div>
              <div className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none">
                <Github size={20} />
              </div>
              <div className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none">
                <Globe size={20} />
              </div>
            </div>
          </div>

          <div className="hidden md:block col-span-2 border-l-4 border-black pl-8">
            <h3 className="font-black uppercase text-sm italic mb-4 text-black">Newsletter_Node</h3>
            <div className="flex flex-col sm:flex-row gap-0">
              {/* FIXED: Input placeholder and text now high-contrast */}
              <input 
                type="email" 
                placeholder="USER@NETWORK.COM" 
                className="bg-zinc-100 border-2 border-black px-4 py-3 text-xs font-black focus:outline-none w-full placeholder:text-zinc-400 text-black"
              />
              <button className="bg-black text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all border-2 border-black">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="border-t-4 border-black pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* FIXED: Copyright text now black */}
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black">
            © 2026 CADENA NO_RIGHTS_RESERVED. OPEN_SOURCE_ALWAYS.
          </p>
          
          {/* FIXED: Badges opacity increased from 30 to 100 for visibility */}
          <div className="flex items-center gap-6 text-black">
            <div className="flex items-center gap-2">
              <Cpu size={14} />
              <span className="text-[9px] font-black uppercase tracking-tighter">Hardware_Accelerated</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} />
              <span className="text-[9px] font-black uppercase tracking-tighter">End-to-End_Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}