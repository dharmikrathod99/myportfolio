'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ElectricBackgroundTextProps {
  className?: string;
  isLoaded?: boolean;
}

interface TextSlide {
  id: string;
  leftWord: string;
  rightWord: string;
  leftBadge: string;
  leftBadgeMobile?: string;
  leftTelemetry: string;
  leftTelemetryMobile?: string;
  rightBadge: string;
  rightBadgeMobile?: string;
  rightTelemetry: string;
  rightTelemetryMobile?: string;
  fontSizeClass: string;
  trackingClass: string;
}

const TEXT_SLIDES: TextSlide[] = [
  {
    id: 'diykan',
    leftWord: 'DIY',
    rightWord: 'KAN',
    leftBadge: 'AI_UNIT // 01',
    leftBadgeMobile: 'AI_UNIT // 01',
    leftTelemetry: 'VOLTAGE: 1.21 GW',
    leftTelemetryMobile: '1.21 GW',
    rightBadge: 'STATUS // ONLINE',
    rightBadgeMobile: 'ONLINE',
    rightTelemetry: 'CIRCUIT: 60Hz PULSE',
    rightTelemetryMobile: '60Hz PULSE',
    fontSizeClass:
      'text-2xl xs:text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10.5rem]',
    trackingClass:
      'tracking-[0.08em] xs:tracking-[0.12em] sm:tracking-[0.16em] md:tracking-[0.20em]',
  },
  {
    id: 'dharmik_rathod',
    leftWord: 'DHARMIK',
    rightWord: 'RATHOD',
    leftBadge: 'CREATOR // LEAD ARCHITECT',
    leftBadgeMobile: 'ARCHITECT',
    leftTelemetry: 'ENGINEER // FULL-STACK',
    leftTelemetryMobile: 'FULL-STACK',
    rightBadge: 'IDENTITY // D.R. DEVELOPER',
    rightBadgeMobile: 'D.R. DEV',
    rightTelemetry: 'CORE // PORTFOLIO 2026',
    rightTelemetryMobile: 'PORTFOLIO 2026',
    fontSizeClass:
      'text-[1.25rem] xs:text-[1.55rem] sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-[6.8rem]',
    trackingClass:
      'tracking-[0.03em] xs:tracking-[0.05em] sm:tracking-[0.08em] md:tracking-[0.10em]',
  },
];

export default function ElectricBackgroundText({
  className = '',
  isLoaded = true,
}: ElectricBackgroundTextProps) {
  const [slideIndex, setSlideIndex] = useState(0);

  // Automatic looping transformation between "DIY KAN" and "DHARMIK RATHOD"
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % TEXT_SLIDES.length);
    }, 4800);

    return () => clearInterval(timer);
  }, []);

  const currentSlide = TEXT_SLIDES[slideIndex];

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden z-20 md:z-[5] ${className}`}
          aria-hidden="true"
        >
          {/* 1. Subtle Ambient Electric Blue Aura (Soft, Not Blinding) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-[1300px] h-[38vh] max-h-[380px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,163,255,0.08)_0%,_rgba(2,132,199,0.025)_50%,_transparent_75%)] blur-2xl pointer-events-none" />

          {/* 2. Main Symmetrical Wing Container: [LEFT] --- (Model Clearance Gap) --- [RIGHT] */}
          <div className="relative flex items-center justify-center w-full max-w-[98vw] 2xl:max-w-[1700px] px-1 xs:px-2 sm:px-6 translate-y-28 sm:translate-y-0">
            {/* Continuous Horizontal Voltage Conductor Line passing behind Model */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[1500px] h-[1px] bg-gradient-to-r from-transparent via-[#00A3FF]/40 to-transparent pointer-events-none" />

            {/* Dynamic Transformation Lightning Pulse Burst */}
            <motion.div
              key={`pulse-${currentSlide.id}`}
              initial={{ opacity: 0.9, scaleX: 0.3 }}
              animate={{ opacity: [0.9, 1, 0.4, 0], scaleX: [0.3, 1, 1, 1] }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[94vw] max-w-[1500px] h-[2px] bg-gradient-to-r from-transparent via-[#7DF9FF] to-transparent shadow-[0_0_16px_#00E5FF,0_0_32px_#00A3FF] pointer-events-none z-20"
            />

            {/* Dynamic Electric Arc / Lightning Shock bridging the wings */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20 animate-lightning-arc"
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
            >
              <path
                d="M 60,105 L 160,95 L 220,112 L 320,92 L 400,108 L 480,96 L 520,106 L 600,92 L 680,110 L 780,94 L 860,112 L 940,105"
                fill="none"
                stroke="#00E5FF"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  filter:
                    'drop-shadow(0 0 6px #00F0FF) drop-shadow(0 0 12px #0088FF)',
                }}
              />
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

            {/* ----------------- LEFT WING ----------------- */}
            <div className="flex-1 flex flex-col items-end pr-1 xs:pr-2 sm:pr-5 md:pr-8 lg:pr-12 xl:pr-16 z-10">
              {/* Left Top Subtitle Badge */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`l-badge-${currentSlide.id}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.35 }}
                  className="flex items-center gap-1.5 mb-1 sm:mb-2 px-2 sm:px-2.5 py-0.5 rounded-full bg-[#00A3FF]/10 border border-[#00A3FF]/25 backdrop-blur-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] shadow-[0_0_6px_#00F0FF]" />
                  <span className="text-[7.5px] xs:text-[8px] sm:text-[10px] font-mono font-semibold tracking-[0.14em] sm:tracking-[0.20em] text-[#38BDF8] uppercase whitespace-nowrap">
                    {currentSlide.leftBadgeMobile ? (
                      <>
                        <span className="sm:hidden">{currentSlide.leftBadgeMobile}</span>
                        <span className="hidden sm:inline">{currentSlide.leftBadge}</span>
                      </>
                    ) : (
                      currentSlide.leftBadge
                    )}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Left Word ("DIY" -> "DHARMIK") */}
              <div className="relative min-h-[40px] xs:min-h-[50px] sm:min-h-[75px] md:min-h-[90px] lg:min-h-[110px] xl:min-h-[135px] 2xl:min-h-[160px] flex items-center justify-end">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`l-word-${currentSlide.id}`}
                    initial={{
                      opacity: 0,
                      y: 12,
                      scale: 0.96,
                      filter: 'blur(8px) brightness(1.8)',
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: 'blur(0px) brightness(1)',
                    }}
                    exit={{
                      opacity: 0,
                      y: -12,
                      scale: 0.96,
                      filter: 'blur(8px) brightness(1.8)',
                    }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="relative"
                  >
                    {/* Stroke Rim Layer */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 flex items-center justify-end font-display font-black leading-none uppercase select-none text-transparent ${currentSlide.fontSizeClass} ${currentSlide.trackingClass}`}
                      style={{
                        WebkitTextStroke: '1.5px rgba(0, 163, 255, 0.75)',
                        textShadow: '0 0 12px rgba(0, 163, 255, 0.45)',
                      }}
                    >
                      {currentSlide.leftWord}
                    </span>

                    {/* Core Gradient with Electric Shock Current */}
                    <h1
                      className={`relative z-10 text-right font-display font-black leading-none uppercase select-none animate-electric-shock ${currentSlide.fontSizeClass} ${currentSlide.trackingClass}`}
                      style={{
                        backgroundImage:
                          'linear-gradient(105deg, rgba(3, 105, 161, 0.85) 0%, rgba(0, 163, 255, 0.95) 35%, #00F0FF 48%, #FFFFFF 50%, #00F0FF 52%, rgba(0, 163, 255, 0.95) 65%, rgba(3, 105, 161, 0.85) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        WebkitTextStroke: '1px rgba(0, 212, 255, 0.55)',
                      }}
                    >
                      {currentSlide.leftWord}
                    </h1>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Left Bottom Telemetry */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`l-telemetry-${currentSlide.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2 text-[7px] xs:text-[8px] sm:text-[9px] font-mono text-[#0284C7] tracking-[0.16em] sm:tracking-[0.22em] uppercase whitespace-nowrap"
                >
                  <span className="w-1 h-1 rounded-full bg-[#00D4FF]" />
                  <span>
                    {currentSlide.leftTelemetryMobile ? (
                      <>
                        <span className="sm:hidden">{currentSlide.leftTelemetryMobile}</span>
                        <span className="hidden sm:inline">{currentSlide.leftTelemetry}</span>
                      </>
                    ) : (
                      currentSlide.leftTelemetry
                    )}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ----------------- CENTER MODEL CLEARANCE GAP ----------------- */}
            <div className="w-2 xs:w-3 sm:w-6 md:w-[260px] lg:w-[320px] xl:w-[380px] 2xl:w-[420px] flex-shrink-0 flex items-center justify-center relative">
              {/* High-Voltage Center Surge Arc across the gap */}
              <div className="w-full h-[1px] bg-gradient-to-r from-[#00D4FF]/60 via-[#7DF9FF] to-[#00D4FF]/60 shadow-[0_0_8px_#00F0FF]" />
              <div className="absolute w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF] animate-spark-jitter" />
            </div>

            {/* ----------------- RIGHT WING ----------------- */}
            <div className="flex-1 flex flex-col items-start pl-1 xs:pl-2 sm:pl-5 md:pl-8 lg:pl-12 xl:pl-16 z-10">
              {/* Right Top Subtitle Badge */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`r-badge-${currentSlide.id}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.35 }}
                  className="flex items-center gap-1.5 mb-1 sm:mb-2 px-2 sm:px-2.5 py-0.5 rounded-full bg-[#00A3FF]/10 border border-[#00A3FF]/25 backdrop-blur-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]" />
                  <span className="text-[7.5px] xs:text-[8px] sm:text-[10px] font-mono font-semibold tracking-[0.14em] sm:tracking-[0.20em] text-[#38BDF8] uppercase whitespace-nowrap">
                    {currentSlide.rightBadgeMobile ? (
                      <>
                        <span className="sm:hidden">{currentSlide.rightBadgeMobile}</span>
                        <span className="hidden sm:inline">{currentSlide.rightBadge}</span>
                      </>
                    ) : (
                      currentSlide.rightBadge
                    )}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Right Word ("KAN" -> "RATHOD") */}
              <div className="relative min-h-[40px] xs:min-h-[50px] sm:min-h-[75px] md:min-h-[90px] lg:min-h-[110px] xl:min-h-[135px] 2xl:min-h-[160px] flex items-center justify-start">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`r-word-${currentSlide.id}`}
                    initial={{
                      opacity: 0,
                      y: 12,
                      scale: 0.96,
                      filter: 'blur(8px) brightness(1.8)',
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: 'blur(0px) brightness(1)',
                    }}
                    exit={{
                      opacity: 0,
                      y: -12,
                      scale: 0.96,
                      filter: 'blur(8px) brightness(1.8)',
                    }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="relative"
                  >
                    {/* Stroke Rim Layer */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 flex items-center justify-start font-display font-black leading-none uppercase select-none text-transparent ${currentSlide.fontSizeClass} ${currentSlide.trackingClass}`}
                      style={{
                        WebkitTextStroke: '1.5px rgba(0, 163, 255, 0.75)',
                        textShadow: '0 0 12px rgba(0, 163, 255, 0.45)',
                      }}
                    >
                      {currentSlide.rightWord}
                    </span>

                    {/* Core Gradient with Electric Shock Current */}
                    <h1
                      className={`relative z-10 text-left font-display font-black leading-none uppercase select-none animate-electric-shock ${currentSlide.fontSizeClass} ${currentSlide.trackingClass}`}
                      style={{
                        backgroundImage:
                          'linear-gradient(105deg, rgba(3, 105, 161, 0.85) 0%, rgba(0, 163, 255, 0.95) 35%, #00F0FF 48%, #FFFFFF 50%, #00F0FF 52%, rgba(0, 163, 255, 0.95) 65%, rgba(3, 105, 161, 0.85) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        WebkitTextStroke: '1px rgba(0, 212, 255, 0.55)',
                      }}
                    >
                      {currentSlide.rightWord}
                    </h1>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Bottom Telemetry */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`r-telemetry-${currentSlide.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2 text-[7px] xs:text-[8px] sm:text-[9px] font-mono text-[#0284C7] tracking-[0.16em] sm:tracking-[0.22em] uppercase whitespace-nowrap"
                >
                  <span className="w-1 h-1 rounded-full bg-[#00D4FF]" />
                  <span>
                    {currentSlide.rightTelemetryMobile ? (
                      <>
                        <span className="sm:hidden">{currentSlide.rightTelemetryMobile}</span>
                        <span className="hidden sm:inline">{currentSlide.rightTelemetry}</span>
                      </>
                    ) : (
                      currentSlide.rightTelemetry
                    )}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

