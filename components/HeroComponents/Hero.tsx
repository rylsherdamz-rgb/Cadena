import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Hero() {
  const containerRef = useRef(null);
  const visualRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation for all title elements
      gsap.from(".hero-title", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.15
      });

      // Subtle breathing animation for the central visual
      gsap.to(visualRef.current, {
        scale: 1.08,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full min-h-[100dvh] bg-black text-white overflow-hidden flex flex-col items-center justify-center px-6 py-12"
    >
      {/* Background Grid - Fixed for better mobile performance */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:40px_40px]"></div>

      {/* Central Visual Element */}
      <div 
        ref={visualRef}
        className="hero-title mb-8 md:mb-12 w-48 h-48 md:w-64 md:h-64 border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.05)] shrink-0"
      >
        <div className="w-32 h-32 md:w-48 md:h-48 border border-white/30 rounded-full flex items-center justify-center">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-sm rotate-45"></div>
        </div>
      </div>

      {/* Text Content */}
      <div className="text-center z-10 w-full max-w-5xl">
        <h1 className="hero-title text-2xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tighter mb-6 leading-none break-words uppercase">
          DECENTRALIZED <br className="hidden sm:block" /> 
          <span className="font-bold underline decoration-1 underline-offset-8">ECOSYSTEM</span>
        </h1>
        
        <p className="hero-title text-gray-400 text-base md:text-xl max-w-2xl mx-auto mb-12 font-light italic leading-relaxed">
          Transparency through code. <br className="sm:hidden" /> 
          From games to national governance.
        </p>

        {/* Feature Grid: 2 columns on mobile, 4 on desktop */}
        <div className="hero-title grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 border-t border-white/10 pt-10">
          <FeatureItem title="Game" desc="Rock Paper Scissors" />
          <FeatureItem title="Social" desc="Encrypted Messaging" />
          <FeatureItem title="Governance" desc="Secure Voting" />
          <FeatureItem title="Economy" desc="National Budget" />
        </div>
      </div>

      {/* Primary Action */}
      <button className="hero-title mt-12 md:mt-16 w-full sm:w-auto px-12 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] hover:bg-gray-200 active:scale-95 transition-all text-sm">
        Enter Protocol
      </button>
    </div>
  );
}

function FeatureItem({ title, desc }) {
  return (
    <div className="flex flex-col items-center md:items-start">
      <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2">{title}</span>
      <span className="text-xs md:text-sm font-medium tracking-tight">{desc}</span>
    </div>
  );
}