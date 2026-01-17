"use client";

import { useState, useEffect } from "react";
import { 
  Github, 
  Twitter, 
  Cpu, 
  Terminal, 
  ShieldCheck, 
  ExternalLink,
  Globe,
  Mail
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
    <footer className="w-full text-black bg-white border-t-8 border-black pt-12 md:pt-16 pb-8 px-4 sm:px-6 md:px-10">
      <div className="container mx-auto">
        
        {/* TOP SECTION: Logo and Terminal */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-16 md:mb-20">
          <div className="space-y-6 max-w-xl">
            <div className="flex items-center gap-3">
              <div className="bg-black p-2 shrink-0">
                <Terminal size={28} className="text-white md:w-8 md:h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none text-black">
                CADENA  
              </h2>
            </div>
            <p className="font-black text-[10px] md:text-xs uppercase tracking-[0.15em] leading-relaxed text-black max-w-sm">
              Distributed Ledger Technology for Sovereign Simulations. 
              Built on Open-Source Protocols for the 2026 Consensus Cycle.
            </p>
          </div>

          {/* STATUS TERMINAL - Width adjusted for mobile */}
          <div className="w-full lg:max-w-sm border-4 border-black p-5 bg-zinc-50 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between border-b-2 border-black pb-2 mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-black italic underline">System_Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 animate-pulse rounded-full border border-black" />
                <span className="text-[9px] font-black uppercase text-black">Online</span>
              </div>
            </div>
            <div className="space-y-2 font-mono text-[10px] md:text-[11px] font-black">
              <p className="flex justify-between text-black"><span>LOCAL_TIME:</span> <span>{time || "00:00:00"}</span></p>
              <p className="flex justify-between text-black"><span>NETWORK:</span> <span>MAINNET_SIM</span></p>
              <p className="flex justify-between text-black"><span>LATENCY:</span> <span>24MS</span></p>
              <p className="flex justify-between text-zinc-500 italic"><span>VERSION:</span> <span>v.2.0.4-LATEST</span></p>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: Links and Newsletter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16 md:mb-20">
          {/* Protocols */}
          <div className="space-y-4">
            <h3 className="font-black uppercase text-sm italic border-b-4 border-black w-fit pr-6 text-black">Protocols</h3>
            <ul className="space-y-3 text-[11px] font-black uppercase tracking-widest text-zinc-800">
              <li className="hover:translate-x-1 cursor-pointer flex items-center gap-2 transition-all">Budget_Gov <ExternalLink size={12}/></li>
              <li className="hover:translate-x-1 cursor-pointer flex items-center gap-2 transition-all">Voting_Node <ExternalLink size={12}/></li>
              <li className="hover:translate-x-1 cursor-pointer transition-all">Transparency_API</li>
            </ul>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h3 className="font-black uppercase text-sm italic border-b-4 border-black w-fit pr-6 text-black">Socials</h3>
            <div className="flex flex-wrap gap-3">
              {[Twitter, Github, Globe].map((Icon, idx) => (
                <div key={idx} className="p-3 border-2 border-black bg-white hover:bg-black hover:text-white transition-all cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-1 active:translate-y-1">
                  <Icon size={18} />
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter - Visible on all screens, but stacks input on smallest mobile */}
          <div className="col-span-1 sm:col-span-2 border-t-4 sm:border-t-0 sm:border-l-4 border-black pt-10 sm:pt-0 sm:pl-8">
            <div className="flex items-center gap-2 mb-4">
              <Mail size={16} />
              <h3 className="font-black uppercase text-sm italic text-black">Newsletter_Node</h3>
            </div>
            <div className="flex flex-col xs:flex-row gap-0 group">
              <input 
                type="email" 
                placeholder="USER@NETWORK.COM" 
                className="bg-zinc-100 border-2 border-black px-4 py-3 text-xs font-black focus:bg-white focus:outline-none w-full placeholder:text-zinc-400 text-black min-w-0"
              />
              <button className="bg-black text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all border-2 border-black border-t-0 xs:border-t-2 xs:border-l-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Badges and Legal */}
        <div className="border-t-4 border-black pt-8 flex flex-col lg:flex-row justify-between items-center gap-8">
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-black text-center lg:text-left order-2 lg:order-1">
            © 2026 CADENA <span className="hidden sm:inline">NO_RIGHTS_RESERVED.</span> OPEN_SOURCE_ALWAYS.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-black order-1 lg:order-2">
            <div className="flex items-center gap-2 border-2 border-black px-2 py-1 bg-zinc-50">
              <Cpu size={14} />
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-tighter">Hardware_Accelerated</span>
            </div>
            <div className="flex items-center gap-2 border-2 border-black px-2 py-1 bg-zinc-50">
              <ShieldCheck size={14} />
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-tighter">E2E_Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}