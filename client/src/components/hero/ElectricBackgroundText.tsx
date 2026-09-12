'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ElectricBackgroundTextProps {
  className?: string;
  isLoaded?: boolean;
}

export default function ElectricBackgroundText({
  className = '',
  isLoaded = true,
}: ElectricBackgroundTextProps) {
  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden z-[5] ${className}`}
          aria-hidden="true"
        >
          {/* 1. Subtle Ambient Electric Blue Aura (Soft, Not Blinding) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-[1300px] h-[38vh] max-h-[380px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,163,255,0.08)_0%,_rgba(2,132,199,0.025)_50%,_transparent_75%)] blur-2xl pointer-events-none" />

          {/* 2. Main Symmetrical Wing Container: [DIY] --- (Model Gap) --- [KAN] */}
          <div className="relative flex items-center justify-center w-full max-w-[98vw] 2xl:max-w-[1700px] px-2 sm:px-6">
            {/* Continuous Horizontal Voltage Conductor Line passing behind Model */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[1500px] h-[1px] bg-gradient-to-r from-transparent via-[#00A3FF]/40 to-transparent pointer-events-none" />

            {/* Dynamic Electric Arc / Lightning Shock bridging DIY and KAN */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20 animate-lightning-arc"
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
            >
              {/* Jagged electric arc passing across DIY, through model gap, and across KAN */}
              <path
                d="M 60,105 L 160,95 L 220,112 L 320,92 L 400,108 L 480,96 L 520,106 L 600,92 L 680,110 L 780,94 L 860,112 L 940,105"
                fill="none"
                stroke="#00E5FF"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  filter: 'drop-shadow(0 0 6px #00F0FF) drop-shadow(0 0 12px #0088FF)',
                }}
              />
              {/* Micro-spark branching nodes */}
              <path
                d="M 220,112 L 245,130 M 400,108 L 420,80 M 680,110 L 705,130 M 860,112 L 880,82"
                fill="none"
                stroke="#7DF9FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{
                  filter: 'drop-shadow(0 0 4px #00F0FF)',
                }}
              />
            </svg>

            {/* ----------------- LEFT WING: DIY ----------------- */}
            <div className="flex-1 flex flex-col items-end pr-2 sm:pr-5 md:pr-8 lg:pr-12 xl:pr-16 z-10">
              {/* Left Top Subtitle */}
              <div className="flex items-center gap-1.5 mb-1 sm:mb-2 px-2.5 py-0.5 rounded-full bg-[#00A3FF]/10 border border-[#00A3FF]/25 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] shadow-[0_0_6px_#00F0FF]" />
                <span className="text-[8px] sm:text-[10px] font-mono font-semibold tracking-[0.20em] text-[#38BDF8] uppercase">
                  AI_UNIT // 01
                </span>
              </div>

              {/* "DIY" Text */}
              <div className="relative">
                {/* Stroke Rim Layer */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-end font-display font-black tracking-[0.12em] sm:tracking-[0.16em] md:tracking-[0.20em] text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10.5rem] leading-none uppercase select-none text-transparent"
                  style={{
                    WebkitTextStroke: '1.5px rgba(0, 163, 255, 0.75)',
                    textShadow: '0 0 12px rgba(0, 163, 255, 0.45)',
                  }}
                >
                  DIY
                </span>

                {/* Core Gradient with Electric Shock Current */}
                <h1
                  className="relative z-10 text-right font-display font-black tracking-[0.12em] sm:tracking-[0.16em] md:tracking-[0.20em] text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10.5rem] leading-none uppercase select-none animate-electric-shock"
                  style={{
                    backgroundImage:
                      'linear-gradient(105deg, rgba(3, 105, 161, 0.85) 0%, rgba(0, 163, 255, 0.95) 35%, #00F0FF 48%, #FFFFFF 50%, #00F0FF 52%, rgba(0, 163, 255, 0.95) 65%, rgba(3, 105, 161, 0.85) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    WebkitTextStroke: '1px rgba(0, 212, 255, 0.55)',
                  }}
                >
                  DIY
                </h1>
              </div>

              {/* Left Bottom Telemetry */}
              <div className="flex items-center gap-2 mt-1 sm:mt-2 text-[8px] sm:text-[9px] font-mono text-[#0284C7] tracking-[0.22em] uppercase">
                <span className="w-1 h-1 rounded-full bg-[#00D4FF]" />
                <span>VOLTAGE: 1.21 GW</span>
              </div>
            </div>

            {/* ----------------- CENTER MODEL CLEARANCE GAP ----------------- */}
            {/* Perfectly sized window where character stands, ensuring "K" and all letters remain 100% visible and unhidden */}
            <div className="w-[120px] xs:w-[150px] sm:w-[200px] md:w-[260px] lg:w-[320px] xl:w-[380px] 2xl:w-[420px] flex-shrink-0 flex items-center justify-center relative">
              {/* High-Voltage Center Surge Arc across the gap */}
              <div className="w-full h-[1px] bg-gradient-to-r from-[#00D4FF]/60 via-[#7DF9FF] to-[#00D4FF]/60 shadow-[0_0_8px_#00F0FF]" />
              <div className="absolute w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF] animate-spark-jitter" />
            </div>

            {/* ----------------- RIGHT WING: KAN ----------------- */}
            <div className="flex-1 flex flex-col items-start pl-2 sm:pl-5 md:pl-8 lg:pl-12 xl:pl-16 z-10">
              {/* Right Top Subtitle */}
              <div className="flex items-center gap-1.5 mb-1 sm:mb-2 px-2.5 py-0.5 rounded-full bg-[#00A3FF]/10 border border-[#00A3FF]/25 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]" />
                <span className="text-[8px] sm:text-[10px] font-mono font-semibold tracking-[0.20em] text-[#38BDF8] uppercase">
                  STATUS // ONLINE
                </span>
              </div>

              {/* "KAN" Text */}
              <div className="relative">
                {/* Stroke Rim Layer */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-start font-display font-black tracking-[0.12em] sm:tracking-[0.16em] md:tracking-[0.20em] text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10.5rem] leading-none uppercase select-none text-transparent"
                  style={{
                    WebkitTextStroke: '1.5px rgba(0, 163, 255, 0.75)',
                    textShadow: '0 0 12px rgba(0, 163, 255, 0.45)',
                  }}
                >
                  KAN
                </span>

                {/* Core Gradient with Electric Shock Current */}
                <h1
                  className="relative z-10 text-left font-display font-black tracking-[0.12em] sm:tracking-[0.16em] md:tracking-[0.20em] text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10.5rem] leading-none uppercase select-none animate-electric-shock"
                  style={{
                    backgroundImage:
                      'linear-gradient(105deg, rgba(3, 105, 161, 0.85) 0%, rgba(0, 163, 255, 0.95) 35%, #00F0FF 48%, #FFFFFF 50%, #00F0FF 52%, rgba(0, 163, 255, 0.95) 65%, rgba(3, 105, 161, 0.85) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    WebkitTextStroke: '1px rgba(0, 212, 255, 0.55)',
                  }}
                >
                  KAN
                </h1>
              </div>

              {/* Right Bottom Telemetry */}
              <div className="flex items-center gap-2 mt-1 sm:mt-2 text-[8px] sm:text-[9px] font-mono text-[#0284C7] tracking-[0.22em] uppercase">
                <span className="w-1 h-1 rounded-full bg-[#00D4FF]" />
                <span>CIRCUIT: 60Hz PULSE</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
