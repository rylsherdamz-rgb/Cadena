"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

export default function NationalBudgetShowcase() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      })

      // 1. Stagger in the budget rows
      tl.from(".budget-node", {
        scale: 0.95,
        x: -20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      })

      // 2. Animate the large number counter
      tl.from(".amount-display", {
        textContent: 0,
        duration: 2,
        ease: "power1.out",
        snap: { textContent: 1 },
        stagger: 1,
      }, "<") // Start at same time as previous

      // 3. Expand the progress bars
      tl.from(".progress-fill", {
        width: "0%",
        duration: 1.5,
        ease: "power2.inOut",
        stagger: 0.1
      }, "-=1.5")

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={containerRef} 
      className="w-full py-20 md:py-32 bg-black text-white flex flex-col items-center overflow-hidden"
    >
      {/* Header */}
      <div className="text-center mb-12 md:mb-20 px-6 max-w-4xl">
        <h2 className="text-[10px] md:text-xs font-black tracking-[0.3em] md:tracking-[0.5em] uppercase text-gray-500 mb-3 md:mb-4">
          Fiscal Protocol
        </h2>
        <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
          On-Chain National Budget
        </h3>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-6xl px-4 md:px-6">
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
          
          {/* Left Column: Source Wallet */}
          <div className="p-6 md:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between gap-8 lg:h-[450px]">
            <div>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Source Wallet</p>
              <p className="text-lg md:text-xl font-bold uppercase italic tracking-tighter break-all">Treasury_Alpha_01</p>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs md:text-sm font-bold text-gray-400">Total Allocated</span>
              <div className="flex items-baseline gap-1 md:gap-2">
                <span className="text-2xl md:text-4xl font-black">$</span>
                {/* Fixed width/wrap issues by adjusting font size on mobile */}
                <span className="amount-display text-4xl sm:text-3xl px-[5%] md:text-6xl font-black tracking-tighter">
                  850000000
                </span>
              </div>
            </div>

            <div className="p-3 md:p-4 bg-white/5 border-l-2 border-white text-[9px] md:text-[10px] font-mono opacity-60 break-all">
              TX_HASH: 0x92b...f11a9c3
            </div>
          </div>

          {/* Right Column: Distribution */}
          <div className="lg:col-span-2 p-6 md:p-8 lg:p-10 bg-zinc-950 flex flex-col gap-6 md:gap-8 relative overflow-hidden">
            
            {/* Sub-header */}
            <div className="flex justify-between items-center z-10">
              <h4 className="text-xs md:text-sm font-black uppercase tracking-widest">Real-Time Distribution</h4>
              <div className="flex gap-2 items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase text-gray-500">Live Ledger</span>
              </div>
            </div>

            {/* Budget Rows */}
            <div className="space-y-6 md:space-y-8 z-10">
              <BudgetFlow label="Education Infrastructure" amount="320,000,000" percent="40" />
              <BudgetFlow label="Public Health Systems" amount="280,500,000" percent="33" />
              <BudgetFlow label="Digital Governance" amount="150,000,000" percent="18" />
              <BudgetFlow label="Emergency Reserve" amount="99,500,000" percent="9" />
            </div>

            {/* Decorative Spinner (Positioned safely) */}
            <div className="absolute -bottom-10 -right-10 md:bottom-8 md:right-8 opacity-20 pointer-events-none">
               <div className="w-32 h-32 md:w-24 md:h-24 border border-white/20 rounded-full flex items-center justify-center">
                  <div className="w-20 h-20 md:w-16 md:h-16 border-t-2 border-white rounded-full animate-spin" />
               </div>
            </div>
          </div>
        </div>

        {/* Stats Mini Grid */}
        <div className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatMini label="Auditors Online" value="14,209" />
          <StatMini label="Dispute Rate" value="0.001%" />
          <StatMini label="Block Time" value="2.4s" />
          <StatMini label="Transparency Score" value="99/100" />
        </div>
      </div>
    </section>
  )
}

function BudgetFlow({ label, amount, percent }) {
  return (
    <div className="budget-node w-full group">
      <div className="flex flex-row justify-between items-end mb-2 md:mb-3">
        <div className="flex flex-col">
          <p className="text-[8px] md:text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">{label}</p>
          <p className="text-base md:text-lg font-bold tracking-tighter italic text-white group-hover:text-gray-200 transition-colors">
            ${amount}
          </p>
        </div>
        <span className="text-xs md:text-sm font-mono text-gray-400">{percent}%</span>
      </div>
      <div className="w-full h-1 bg-white/10 overflow-hidden rounded-full">
        <div 
          className="progress-fill h-full bg-white origin-left" 
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function StatMini({ label, value }) {
  return (
    <div className="p-4 md:p-6 border border-white/5 hover:bg-white/5 transition-colors cursor-crosshair">
      <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-500 mb-1 md:mb-2 truncate">
        {label}
      </p>
      <p className="text-lg md:text-xl font-bold italic tracking-tighter text-white">
        {value}
      </p>
    </div>
  )
}