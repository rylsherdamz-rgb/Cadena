"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function Header() {
  const router = useRouter()
  const imageRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-content", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        stagger: 0.15,
        ease: "expo.out"
      })

      gsap.to(imageRef.current, {
        y: -30,
        rotate: 3,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="w-full min-h-screen px-6 md:px-16 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-12 bg-white text-black overflow-hidden">
      <div className="w-full md:w-3/5 flex flex-col gap-8">
        <div className="space-y-2">
          <div className="hero-content h-1 w-20 bg-black mb-6" />
          <h1 className="hero-content text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter uppercase">
            Transparency <br />
            <span className="text-gray-300">is not a promise.</span>
          </h1>
        </div>
        
        <p className="hero-content text-lg md:text-xl text-gray-800 leading-relaxed max-w-xl font-medium">
          In a country where public trust has been tested repeatedly, accountability cannot rely on assurances alone. By embedding transparency into public funds, the people no longer have to ask where their money went — they verify it.
        </p>

        <div className="hero-content flex flex-wrap gap-5">
          <button
            onClick={() => router.push("/cadena")}
            className="px-12 py-5 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95"
          >
            Get Started
          </button>
          <button className="px-12 py-5 border-2 border-black text-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
            The Protocol
          </button>
        </div>

        <div className="hero-content grid grid-cols-2 gap-8 pt-8 border-t border-gray-100">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold">Utility</p>
            <p className="text-sm font-bold">Rock Paper Scissors • Messaging</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold">Governance</p>
            <p className="text-sm font-bold">Voting • National Budget</p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-2/5 flex justify-center items-center">
        <div 
          ref={imageRef}
          className="relative w-64 h-80 md:w-80 md:h-[450px] bg-black flex items-end p-6 group cursor-crosshair"
        >
          <div className="absolute inset-0 border border-black -m-4 group-hover:-m-2 transition-all duration-500" />
          <div className="absolute top-0 right-0 p-8 text-white flex flex-col items-end">
            <span className="text-6xl font-light tracking-tighter">01</span>
            <div className="w-12 h-1 bg-white" />
          </div>
          <p className="text-white text-2xl font-black leading-none uppercase italic">
            Decentralized <br /> Identity
          </p>
        </div>
      </div>
    </div>
  )
}