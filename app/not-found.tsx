"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { AlertTriangle, ChevronLeft, Terminal, Activity } from "lucide-react"

export default function NotFound() {
  const router = useRouter()
  const containerRef = useRef(null)
  const glitchRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Glitch effect for the 404 text
      gsap.to(glitchRef.current, {
        skewX: 20,
        duration: 0.1,
        repeat: -1,
        yoyo: true,
        ease: "rough",
        repeatDelay: 2
      })

      // Staggered entry for UI elements
      gsap.from(".error-element", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: "expo.out"
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="min-h-[100dvh] bg-white text-black flex flex-col items-center justify-center p-6 overflow-hidden font-sans"
    >
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[size:30px_30px] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]" />

      {/* Main Error Display */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        <div className="error-element mb-6 bg-black text-white px-4 py-1 flex items-center gap-2">
          <AlertTriangle size={14} className="animate-pulse text-yellow-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Status: Packet_Loss_Detected</span>
        </div>

        <h1 
          ref={glitchRef}
          className="error-element text-[120px] md:text-[200px] font-black leading-none tracking-tighter italic"
        >
          404
        </h1>

        <div className="error-element space-y-4 mb-12">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
            Node_Not_Found
          </h2>
          <p className="text-sm md:text-base font-bold text-zinc-500 uppercase tracking-widest leading-relaxed max-w-md mx-auto">
            The requested block height does not exist or has been pruned from the local ledger.
          </p>
        </div>

        {/* Technical "Diagnostics" Box */}
        <div className="error-element w-full border-4 border-black p-6 bg-zinc-50 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-12 text-left sm:flex justify-between items-center gap-6">
          <div className="space-y-2 font-mono text-[10px] font-black uppercase mb-4 sm:mb-0">
            <p className="flex justify-between gap-8"><span>ERROR_CODE:</span> <span className="text-red-600">0xDEADBEEF</span></p>
            <p className="flex justify-between gap-8"><span>LOCATION:</span> <span>UNKOWN_SECTOR</span></p>
            <p className="flex justify-between gap-8"><span>INTEGRITY:</span> <span className="animate-pulse">COMPROMISED</span></p>
          </div>
          <div className="h-12 w-full sm:w-32 bg-zinc-200 relative overflow-hidden">
             <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                <Activity size={24} className="text-black/20" />
             </div>
             {/* Simple CSS Waveform placeholder */}
             <div className="absolute bottom-0 left-0 w-full h-1 bg-black animate-bounce" style={{ animationDuration: '0.5s' }} />
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="error-element group flex items-center gap-4 bg-black text-white px-10 py-5 font-black uppercase tracking-[0.3em] text-sm hover:bg-zinc-800 transition-all active:scale-95"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
          Back_To_Consensus
        </button>
      </div>

      {/* Footer Branding */}
      <div className="error-element absolute bottom-8 flex items-center gap-3 opacity-30">
        <Terminal size={18} />
        <span className="text-[10px] font-black uppercase tracking-widest">Cadena_OS // Protocol_Failure_Log</span>
      </div>
    </div>
  )
}