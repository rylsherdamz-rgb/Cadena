"use client"
import { useRouter } from "next/navigation"
import { Sword, Shield, Zap, ChevronRight } from "lucide-react"

export default function RockPage() {
  const router = useRouter()

  return (
    <div className="w-full min-h-screen px-[5%] bg-white px-6 md:px-10 py-12 flex flex-col lg:flex-row items-center justify-center gap-16 overflow-hidden">
      
      {/* LEFT: CONTENT MANIFESTO */}
      <div className="w-full lg:w-1/2 text-black flex flex-col gap-8 max-w-2xl relative z-10">
        <div className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] w-fit">
          Decentralized_Conflict_Resolution
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85]">
          The_Rock <br />
          <span className="text-gray-300 underline decoration-black decoration-8 underline-offset-8">Protocol</span>
        </h1>
        
        <p className="text-lg md:text-xl font-bold uppercase tracking-tight leading-tight border-l-8 border-black pl-6 italic text-zinc-600">
          A zero-knowledge implementation of Rock Paper Scissors. 
          Designed to onboard operators into the Dapp ecosystem via high-frequency consensus gaming.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button
            onClick={() => router.push("/rock-game/create-game")}
            className="group w-full sm:w-fit px-10 py-5 bg-black text-white font-black uppercase text-sm tracking-widest border-4 border-black hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] active:translate-x-1 active:translate-y-1"
          >
            Create_Node <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => router.push("/rock-game/join-game")}
            className="w-full sm:w-fit px-10 py-5 bg-white text-black font-black uppercase text-sm tracking-widest border-4 border-black hover:bg-zinc-100 transition-all flex items-center justify-center gap-3 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] active:translate-x-1 active:translate-y-1"
          >
            Join_Session
          </button>
        </div>
      </div>

      {/* RIGHT: SCHEMATIC VISUAL */}
      <div className="w-full lg:w-1/2 flex justify-center items-center relative">
        <div className="relative border-8 border-black p-12 bg-white shadow-[30px_30px_0px_0px_rgba(0,0,0,1)] max-w-md w-full rotate-2">
          
          {/* Status Badge */}
          <div className="absolute -top-6 -right-6 bg-black text-white p-4 font-black italic text-xl border-4 border-white shadow-xl">
            LIVE_NET
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-zinc-100 border-4 border-black">
                <Sword size={32} />
              </div>
              <div>
                <p className="text-xl font-black uppercase italic">Attack_Phase</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Commit_Move_Hash</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="p-4 bg-zinc-100 border-4 border-black">
                <Shield size={32} />
              </div>
              <div>
                <p className="text-xl font-black uppercase italic">Defense_Phase</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Awaiting_Opponent</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="p-4 bg-black text-white border-4 border-black">
                <Zap size={32} className="animate-pulse" />
              </div>
              <div>
                <p className="text-xl font-black uppercase italic">Resolution</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Smart_Contract_Settle</p>
              </div>
            </div>
          </div>

          {/* Bottom Terminal Text */}
          <div className="mt-12 pt-6 border-t-4 border-black font-mono text-[9px] font-black uppercase space-y-1">
            <p className="text-green-600 tracking-tighter">{">"} ENCRYPTING SELECTION...</p>
            <p className="text-zinc-400 tracking-tighter">{">"} AWAITING PEER CONNECTION...</p>
          </div>
        </div>

        {/* Decorative Background Element */}
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-[0.03] pointer-events-none overflow-hidden select-none font-black text-[20rem] leading-none uppercase">
          GAME
        </div>
      </div>
    </div> 
  )
}