

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Hero() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const visualRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.2
      });

      gsap.to(visualRef.current, {
        scale: 1.05,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center px-6">
      
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div 
        ref={visualRef}
        className="mb-12 w-64 h-64 border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)]"
      >
        <div className="w-48 h-48 border border-white/40 rounded-full flex items-center justify-center">
          <div className="w-24 h-24 bg-white rounded-sm rotate-45"></div>
        </div>
      </div>

      <div className="text-center z-10">
        <h1 className="hero-title text-6xl md:text-8xl font-light tracking-tighter mb-4">
          DECENTRALIZED <span className="font-bold underline">ECOSYSTEM</span>
        </h1>
        
        <p className="hero-title text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light italic">
          Transparency through code. From games to national governance.
        </p>

        <div className="hero-title grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-10">
          <FeatureItem title="Game" desc="Rock Paper Scissors" />
          <FeatureItem title="Social" desc="Encrypted Messaging" />
          <FeatureItem title="Governance" desc="Secure Voting" />
          <FeatureItem title="Economy" desc="National Budget" />
        </div>
      </div>

      <button className="hero-title mt-16 px-10 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
        Enter Protocol
      </button>
    </div>
  );
}

function FeatureItem({ title, desc }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-1">{title}</span>
      <span className="text-sm font-medium">{desc}</span>
    </div>
  );
}
