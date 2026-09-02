'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic import of 3D Cyber X81 Model component
const CyberX81Model = dynamic(() => import('@/components/hero/CyberX81Model'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-screen flex items-center justify-center bg-[#0F1422]">
      <div className="w-12 h-12 rounded-full border-2 border-[#56AEEB]/30 border-t-[#56AEEB] animate-spin" />
    </div>
  ),
});

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0F1422] select-none"
    >
      {/* Pure 3D Cyber X81 Model - Full-screen unobstructed centerpiece */}
      <div className="w-full h-full min-h-screen z-0">
        <CyberX81Model className="w-full h-full min-h-screen" showStatusLabel={false} />
      </div>
    </section>
  );
}
