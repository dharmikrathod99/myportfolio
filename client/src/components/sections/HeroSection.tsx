'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import NightSkyBackground from '@/components/hero/NightSkyBackground';
import Hero3DErrorBoundary from '@/components/hero/Hero3DErrorBoundary';

// Immediate high-prestige fallback shown while the 3D chunk is fetched
function HeroInitialLoadingFallback() {
  return (
    <div className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-[#070A14] select-none">
      {/* Night Sky with Twinkling Stars & Comets immediately visible */}
      <NightSkyBackground />

      {/* Cybernetic Ambient Loading Indicator */}
      <div className="relative z-30 flex flex-col items-center gap-4 px-6 py-5 rounded-2xl bg-[#070D1F]/70 border border-[#00F0FF]/30 backdrop-blur-xl shadow-[0_0_40px_rgba(0,240,255,0.14)] text-center">
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#00F0FF]/25 border-t-[#00F0FF] animate-spin shadow-[0_0_15px_#00F0FF]" />
          <span className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
        </div>
        <div className="flex flex-col gap-1 font-mono">
          <span className="text-[11px] sm:text-xs text-[#38BDF8] tracking-widest font-bold uppercase drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
            HOLOGRAPHIC SYNTHESIS PROTOCOL
          </span>
          <span className="text-[9px] sm:text-[10px] text-[#94A3B8] tracking-wider uppercase">
            INITIALIZING 3D QUANTUM PIPELINE...
          </span>
        </div>
      </div>
    </div>
  );
}

// Dynamic import of 3D Mia Model component
const MiaModel = dynamic(() => import('@/components/hero/MiaModel'), {
  ssr: false,
  loading: () => <HeroInitialLoadingFallback />,
});

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full h-[100dvh] min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#070A14] select-none touch-pan-y"
    >
      <Hero3DErrorBoundary>
        {/* Pure 3D Mia Model - Full-screen centerpiece */}
        <div className="w-full h-full min-h-[100dvh] z-0 overflow-hidden touch-pan-y">
          <MiaModel className="w-full h-full min-h-[100dvh]" showStatusLabel={false} />
        </div>
      </Hero3DErrorBoundary>
    </section>
  );
}
