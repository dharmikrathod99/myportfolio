'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic import of 3D Mia Model component
const MiaModel = dynamic(() => import('@/components/hero/MiaModel'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-screen flex flex-col items-center justify-center bg-[#00094c] relative overflow-hidden select-none">
      {/* Ambient background glow */}
      <div className="absolute w-96 h-96 rounded-full bg-[radial-gradient(circle,_rgba(0,240,255,0.15)_0%,_transparent_70%)] blur-3xl pointer-events-none" />

      {/* Cyber Reticle Loader */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-full border border-dashed border-[#00F0FF]/50 animate-spin [animation-duration:8s]" />
        <div className="absolute w-14 h-14 rounded-full border border-[#38BDF8]/40 animate-spin [animation-duration:4s] [animation-direction:reverse]" />
        <div className="absolute w-8 h-8 rounded-full border border-t-[#00F0FF] border-r-transparent border-b-[#00F0FF] border-l-transparent animate-spin [animation-duration:1.5s]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_15px_#00F0FF] animate-ping" />
      </div>

      <div className="flex flex-col items-center gap-1.5 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
          <p className="text-xs sm:text-sm font-mono font-bold tracking-widest text-white uppercase drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]">
            INITIALIZING 4K NEURAL VOXEL ENGINE
          </p>
        </div>
        <p className="text-[10px] font-mono tracking-widest text-[#38BDF8]/80 uppercase">
          CALIBRATING 3D SHADERS & ELECTRIC BIOMETRICS...
        </p>
      </div>
    </div>
  ),
});

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#00094c] select-none"
    >
      {/* Pure 3D Mia Model - Full-screen centerpiece */}
      <div className="w-full h-full min-h-screen z-0">
        <MiaModel className="w-full h-full min-h-screen" showStatusLabel={false} />
      </div>
    </section>
  );
}
