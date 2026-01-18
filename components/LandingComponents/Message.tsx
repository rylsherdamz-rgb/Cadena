"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register ScrollTrigger to ensure animations play when scrolled into view
gsap.registerPlugin(ScrollTrigger)

export default function MessagingShowcase() {
  const containerRef = useRef(null)
  const messageRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Entry Animation
      gsap.from(".showcase-header", {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      })

      // Infinite Chat Loop Animation
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 })
      
      messageRefs.current.forEach((el, i) => {
        // Reset state before animating in
        gsap.set(el, { display: "none", opacity: 0 })

        tl.fromTo(el, 
          { opacity: 0, x: i % 2 === 0 ? -20 : 20, scale: 0.95, display: "none" },
          { 
            opacity: 1, 
            x: 0, 
            scale: 1, 
            display: "block",
            duration: 0.5, 
            ease: "back.out(1.2)" 
          },
          "+=0.8" // Delay between messages
        )
      })

      // Exit Animation (clear chat)
      tl.to(messageRefs.current, {
        opacity: 0,
        y: -10,
        stagger: 0.05,
        duration: 0.4,
        delay: 2,
        ease: "power2.in"
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={containerRef} 
      className="w-full py-16 md:py-24 bg-white flex flex-col items-center overflow-hidden"
    >
      {/* Header Section */}
      <div className="showcase-header text-center mb-12 md:mb-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-xs md:text-sm font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase text-gray-400 mb-3 md:mb-4">
          Peer-to-Peer
        </h2>
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
          Decentralized Messaging
        </h3>
      </div>

      {/* Phone/Chat UI Container */}
      {/* w-[85%] prevents shadow cutoff on small mobile screens */}
      <div className="relative w-[85%] sm:w-full max-w-xs sm:max-w-md aspect-[3/5] sm:aspect-[3/4] border-2 md:border-[3px] border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-4 md:p-6 flex flex-col mx-auto transition-all">
        
        {/* Chat Header */}
        <div className="flex items-center gap-3 border-b-2 border-black pb-4 mb-2 shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-black rounded-full shrink-0" />
          <div className="overflow-hidden">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest truncate">Node_0X4F2</p>
            <p className="text-[8px] md:text-[10px] text-gray-400 font-mono italic truncate">Encrypted Connection</p>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 flex flex-col gap-3 md:gap-4 overflow-hidden py-2">
          {[
            { text: "Initiating secure handshake...", align: "left" },
            { text: "Handshake verified. Channel open.", align: "right" },
            { text: "Are the budget records locked?", align: "left" },
            { text: "Confirmed. 100% on-chain.", align: "right" },
          ].map((msg, i) => (
            <div
              key={i}
              ref={(el) => (messageRefs.current[i] = el)}
              className={`relative max-w-[85%] p-3 md:p-4 text-xs md:text-sm font-bold uppercase tracking-tight opacity-0 ${
                msg.align === "right" 
                ? "self-end bg-black text-white" 
                : "self-start border-2 border-black text-black bg-white"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Chat Input Area (Visual Only) */}
        <div className="mt-auto pt-4 shrink-0 flex gap-2">
          <div className="flex-1 h-10 md:h-12 border-2 border-black flex items-center px-3 md:px-4">
            <div className="w-1 h-3 md:h-4 bg-black animate-pulse" />
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-black flex items-center justify-center shrink-0 active:scale-95 transition-transform cursor-pointer hover:bg-gray-900">
            <div className="w-0 h-0 border-t-[5px] md:border-t-[6px] border-t-transparent border-l-[8px] md:border-l-[10px] border-l-white border-b-[5px] md:border-b-[6px] border-b-transparent ml-1" />
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 w-full max-w-5xl px-8 md:px-6">
        <Feature label="Privacy" value="No Central Server" />
        <Feature label="Security" value="End-to-End Encryption" />
        <Feature label="Access" value="IPFS Protocol" />
      </div>
    </section>
  )
}

function Feature({ label, value }) {
  return (
    <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</p>
      <p className="text-base md:text-lg font-black uppercase tracking-tight leading-tight">{value}</p>
    </div>
  )
}