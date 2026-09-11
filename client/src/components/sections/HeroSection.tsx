'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic import of 3D Mia Model component
const MiaModel = dynamic(() => import('@/components/hero/MiaModel'), {
  ssr: false,
  loading: () => <div className="w-full h-full min-h-screen bg-[#070A14]" />,
});

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#070A14] select-none"
    >
      {/* Pure 3D Mia Model - Full-screen centerpiece */}
      <div className="w-full h-full min-h-screen z-0">
        <MiaModel className="w-full h-full min-h-screen" showStatusLabel={false} />
      </div>
    </section>
  );
}
