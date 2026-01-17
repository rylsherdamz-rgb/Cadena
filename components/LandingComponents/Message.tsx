"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function MessagingShowcase() {
  const containerRef = useRef(null)
  const messageRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".showcase-header", {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out"
      })

      const tl = gsap.timeline({ repeat: -1 })
      
      messageRefs.current.forEach((el, i) => {
        tl.fromTo(el, 
          { opacity: 0, x: i % 2 === 0 ? -20 : 20, scale: 0.95 },
          { 
            opacity: 1, 
            x: 0, 
            scale: 1, 
            duration: 0.6, 
            ease: "back.out(1.7)" 
          },
          "+=0.8"
        )
      })

      tl.to(messageRefs.current, {
        opacity: 0,
        y: -10,
        stagger: 0.1,
        duration: 0.5,
        delay: 2
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="w-full py-24 bg-white flex flex-col items-center overflow-hidden">
      <div className="showcase-header text-center mb-16 px-6">
        <h2 className="text-sm font-bold tracking-[0.4em] uppercase text-gray-400 mb-4">Peer-to-Peer</h2>
        <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Decentralized Messaging</h3>
      </div>

      <div className="relative w-full max-w-md aspect-[3/4] border-[3px] border-black bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b-2 border-black pb-4 mb-2">
          <div className="w-10 h-10 bg-black rounded-full" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest">Node_0X4F2</p>
            <p className="text-[10px] text-gray-400 font-mono italic">Encrypted Connection</p>
          </div>
        </div>

        {[
          { text: "Initiating secure handshake...", align: "left", dark: false },
          { text: "Handshake verified. Channel open.", align: "right", dark: true },
          { text: "Are the budget records locked?", align: "left", dark: false },
          { text: "Confirmed. 100% on-chain.", align: "right", dark: true },
        ].map((msg, i) => (
          <div
            key={i}
            ref={(el) => (messageRefs.current[i] = el)}
            className={`max-w-[80%] p-4 text-sm font-bold uppercase tracking-tight ${
              msg.align === "right" 
              ? "self-end bg-black text-white" 
              : "self-start border-2 border-black text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}

        <div className="absolute bottom-6 left-6 right-6 flex gap-2">
          <div className="flex-1 h-12 border-2 border-black flex items-center px-4">
            <div className="w-1 h-4 bg-black animate-pulse" />
          </div>
          <div className="w-12 h-12 bg-black flex items-center justify-center">
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl px-6">
        <Feature label="Privacy" value="No Central Server" />
        <Feature label="Security" value="End-to-End Encryption" />
        <Feature label="Access" value="IPFS Protocol" />
      </div>
    </section>
  )
}

function Feature({ label, value }) {
  return (
    <div className="text-center md:text-left">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</p>
      <p className="text-lg font-black uppercase tracking-tight">{value}</p>
    </div>
  )
}