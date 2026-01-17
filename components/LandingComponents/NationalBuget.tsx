"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function NationalBudgetShowcase() {
  const containerRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 })

      tl.from(".budget-node", {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)"
      })

      tl.from(".flow-line", {
        strokeDashoffset: 1000,
        duration: 2,
        ease: "power2.inOut"
      }, "-=0.5")

      tl.to(".amount-display", {
        innerText: (i, target) => target.getAttribute("data-value"),
        duration: 1.5,
        snap: { innerText: 1 },
        ease: "power1.inOut"
      }, "-=1.5")

      tl.to(containerRef.current, {
        opacity: 0,
        duration: 1,
        delay: 4
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="w-full py-32 bg-black text-white flex flex-col items-center overflow-hidden">
      <div className="text-center mb-20 px-6">
        <h2 className="text-xs font-black tracking-[0.5em] uppercase text-gray-500 mb-4">Fiscal Protocol</h2>
        <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">On-Chain National Budget</h3>
      </div>

      <div className="w-full max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 shadow-[0_0_100px_rgba(255,255,255,0.05)] border border-white/10">
          
          <div className="p-10 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between h-[400px]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Source Wallet</p>
              <p className="text-xl font-bold uppercase italic tracking-tighter">Treasury_Alpha_01</p>
            </div>
            
            <div className="space-y-1">
              <span className="text-sm font-bold text-gray-400">Total Allocated</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black">$</span>
                <span className="amount-display text-6xl font-black tracking-tighter" data-value="850000000">0</span>
              </div>
            </div>

            <div className="p-4 bg-white/5 border-l-2 border-white text-[10px] font-mono opacity-50">
              TX_HASH: 0x92b...f11
            </div>
          </div>

          <div className="lg:col-span-2 p-10 bg-zinc-950 flex flex-col gap-8 relative">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-black uppercase tracking-widest">Real-Time Distribution</h4>
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase text-gray-500">Live Ledger</span>
              </div>
            </div>

            <div className="space-y-8">
              <BudgetFlow label="Education Infrastructure" amount="320,000,000" percent="40" />
              <BudgetFlow label="Public Health Systems" amount="280,500,000" percent="33" />
              <BudgetFlow label="Digital Governance" amount="150,000,000" percent="18" />
              <BudgetFlow label="Emergency Reserve" amount="99,500,000" percent="9" />
            </div>

            <div className="absolute bottom-10 right-10">
               <div className="w-24 h-24 border border-white/20 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 border-t-2 border-white rounded-full animate-spin" />
               </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
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
      <div className="flex justify-between items-end mb-3">
        <div>
          <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{label}</p>
          <p className="text-lg font-bold tracking-tighter italic">${amount}</p>
        </div>
        <span className="text-xs font-mono text-gray-400">{percent}%</span>
      </div>
      <div className="w-full h-1 bg-white/10 overflow-hidden">
        <div 
          className="progress-fill h-full bg-white origin-left transition-all duration-1000" 
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function StatMini({ label, value }) {
  return (
    <div className="p-6 border border-white/5 hover:bg-white/5 transition-colors">
      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">{label}</p>
      <p className="text-xl font-bold italic tracking-tighter">{value}</p>
    </div>
  )
}