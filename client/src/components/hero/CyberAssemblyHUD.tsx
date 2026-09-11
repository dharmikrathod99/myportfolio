'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

export interface CyberAssemblyHUDProps {
  progress: number; // 0 to 100 (smoothed)
  item?: string;
  loaded?: number;
  total?: number;
  isManualTrigger?: boolean;
  onComplete: () => void;
  onShake: (isShaking: boolean) => void;
  onSkip: () => void;
}

interface LogEntry {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warn' | 'cyan';
}

// -------------------------------------------------------------
// ULTRA-SMOOTH GPU-ACCELERATED WAVEFORM PROGRESS BAR
// Uses pure CSS translation & clipPath — zero 60fps React state re-renders!
// -------------------------------------------------------------
function HolographicWaveformBar({ progress }: { progress: number }) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  // Generates smooth sinusoidal SVG wave path
  const wavePoints = useMemo(() => {
    const width = 1200; // Double width for seamless infinite loop
    const height = 48;
    const midY = height / 2;
    let path = `M 0 ${midY}`;

    for (let x = 0; x <= width; x += 4) {
      const w1 = Math.sin((x / 60) * Math.PI) * 9;
      const w2 = Math.sin((x / 130) * Math.PI) * 4;
      path += ` L ${x} ${(midY + w1 + w2).toFixed(2)}`;
    }
    return path;
  }, []);

  return (
    <div className="relative w-full rounded-xl bg-[#070D1D]/90 border border-[#00F0FF]/35 p-2 sm:p-2.5 backdrop-blur-xl shadow-[0_0_35px_rgba(0,240,255,0.18)] overflow-hidden">
      {/* Corner cybernetic bracket accents */}
      <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
      <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
      <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
      <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />

      {/* Progress fill track */}
      <div className="relative w-full h-11 sm:h-12 overflow-hidden flex items-center">
        {/* Baseline Center Gridline */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-[repeating-linear-gradient(90deg,rgba(56,189,248,0.15)_0,rgba(56,189,248,0.15)_4px,transparent_4px,transparent_8px)]" />

        {/* Ambient Under-Wave Track */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg
            viewBox="0 0 1200 48"
            className="w-[200%] h-full animate-[waveGlide_8s_linear_infinite]"
            preserveAspectRatio="none"
          >
            <path
              d={wavePoints}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
          </svg>
        </div>

        {/* Active Waveform with Smooth Dynamic Clip-Path */}
        <div
          className="absolute inset-0 transition-[clip-path] duration-75 ease-out"
          style={{
            clipPath: `inset(0 ${100 - clampedProgress}% 0 0)`,
          }}
        >
          {/* Wave Glow Filter and Gradient Definition */}
          <svg
            viewBox="0 0 1200 48"
            className="w-[200%] h-full animate-[waveGlide_6s_linear_infinite]"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="cyberWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="50%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#00F0FF" />
              </linearGradient>
              <filter id="waveNeonGlow">
                <feGaussianBlur stdDeviation="2.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing Active Harmonic Wave */}
            <path
              d={wavePoints}
              fill="none"
              stroke="url(#cyberWaveGrad)"
              strokeWidth="2.8"
              strokeLinecap="round"
              filter="url(#waveNeonGlow)"
            />
          </svg>
        </div>

        {/* Glowing Progress Pulse Indicator Head */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-[left] duration-75 ease-out"
          style={{ left: `${clampedProgress}%` }}
        >
          <div className="relative flex items-center justify-center">
            {/* Pulsing ring */}
            <span className="absolute w-7 h-7 rounded-full bg-[#00F0FF]/25 animate-ping" />
            {/* Outer halo */}
            <span className="w-4 h-4 rounded-full bg-[#00F0FF]/60 shadow-[0_0_15px_#00F0FF]" />
            {/* White-hot center */}
            <span className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
            {/* Vertical laser slice */}
            <span className="absolute -top-3.5 -bottom-3.5 w-[1.5px] bg-gradient-to-b from-transparent via-[#FFFFFF] to-transparent opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MAIN CYBER ASSEMBLY HUD OVERLAY
// -------------------------------------------------------------
export default function CyberAssemblyHUD({
  progress = 0,
  item = '',
  loaded = 0,
  total = 0,
  isManualTrigger = false,
  onComplete,
  onShake,
  onSkip,
}: CyberAssemblyHUDProps) {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', text: 'INIT // WebGL2 4K Quantum Graphics Pipeline', type: 'cyan' },
    { id: '2', text: 'CALIBRATE // Studio Rim Light & Subsurface Rig', type: 'info' },
  ]);

  // Stage description dynamically updating smoothly based on percentage
  const stageInfo = useMemo(() => {
    if (progress < 22) {
      return { stage: 'STAGE 01', title: 'NANITE BLUEPRINT & BASE MATRIX', color: '#38BDF8' };
    }
    if (progress < 48) {
      return { stage: 'STAGE 02', title: 'QUANTUM CORE REACTOR & REPAIR CONDUITS', color: '#00F0FF' };
    }
    if (progress < 74) {
      return { stage: 'STAGE 03', title: 'NEON CIRCUITS & NEURAL EYE FOCUS', color: '#A855F7' };
    }
    if (progress < 98) {
      return { stage: 'STAGE 04', title: '4K PBR TEXTURES & SHADER SYNTHESIS', color: '#38BDF8' };
    }
    return { stage: 'STAGE 05', title: 'ALL SYSTEMS ONLINE // DEPLOYING AVATAR', color: '#34D399' };
  }, [progress]);

  // Add contextual logs smoothly as milestones are passed
  useEffect(() => {
    const p = Math.floor(progress);

    if (p >= 20) {
      setLogs((prev) =>
        prev.some((l) => l.id === 'milestone-20')
          ? prev
          : [...prev.slice(-3), { id: 'milestone-20', text: 'FRAMEWORK // Synthesizing nanite lattice structure', type: 'cyan' }]
      );
    }
    if (p >= 45) {
      setLogs((prev) =>
        prev.some((l) => l.id === 'milestone-45')
          ? prev
          : [...prev.slice(-3), { id: 'milestone-45', text: 'CORE // Quantum energy conduits stabilized', type: 'info' }]
      );
    }
    if (p >= 70) {
      setLogs((prev) =>
        prev.some((l) => l.id === 'milestone-70')
          ? prev
          : [...prev.slice(-3), { id: 'milestone-70', text: 'NEURAL // Ocular gaze & biometric tracking engaged', type: 'cyan' }]
      );
    }
    if (p >= 90) {
      setLogs((prev) =>
        prev.some((l) => l.id === 'milestone-90')
          ? prev
          : [...prev.slice(-3), { id: 'milestone-90', text: 'TEXTURE // 4K diffuse & emissive shaders compiled', type: 'success' }]
      );
    }
  }, [progress]);

  const pInt = Math.min(100, Math.floor(progress));
  const formattedProgress = pInt.toString().padStart(3, '0');

  return (
    <motion.div
      key="cyber-hud-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.025,
        filter: 'blur(8px)',
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="fixed inset-0 z-[9999] w-full h-full flex flex-col justify-between font-mono select-none pointer-events-none overflow-hidden"
    >
      {/* Sci-Fi Cinematic Vignette & Ambient Quantum Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_35%,_rgba(7,10,20,0.65)_70%,_rgba(3,7,18,0.92)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,240,255,0.06)_0%,_transparent_60%)] pointer-events-none" />

      {/* Subtle CRT Scanlines for Authentic Cyberpunk Aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.018)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-50" />

      {/* Top & Bottom Holographic Gradients */}
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#030712]/95 via-[#030712]/60 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#030712]/98 via-[#030712]/80 to-transparent pointer-events-none" />

      {/* ========================================================= */}
      {/* 1. TOP FUTURISTIC STATUS BAR                              */}
      {/* ========================================================= */}
      <header className="relative z-30 px-4 sm:px-8 pt-5 flex items-center justify-between">
        {/* Left: Hologram Protocol Title & Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-[#00F0FF] animate-ping opacity-75" />
            <span className="absolute w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs text-[#38BDF8] tracking-widest font-bold drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
                HOLOGRAPHIC SYNTHESIS PROTOCOL
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[8px] bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 font-semibold tracking-wider">
                v2.8 LIVE
              </span>
            </div>
            <div className="flex items-center gap-2 text-[9px] sm:text-[11px] text-[#94A3B8] mt-0.5">
              <span style={{ color: stageInfo.color }} className="font-semibold">
                {stageInfo.stage}:
              </span>
              <span className="tracking-wide">{stageInfo.title}</span>
            </div>
          </div>
        </div>

        {/* Right: Smooth Digital Counter & SKIP Button */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Crisp Monospace Progress Counter */}
          <div className="flex items-center gap-2 bg-[#091124]/90 border border-[#00F0FF]/40 px-3.5 sm:px-4 py-1.5 rounded-full backdrop-blur-xl shadow-[0_0_22px_rgba(0,240,255,0.22)]">
            <span className="text-[10px] text-[#94A3B8] hidden sm:inline tracking-wider">SYNTH:</span>
            <span className="text-base sm:text-xl font-bold text-[#00F0FF] tracking-widest tabular-nums drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">
              {formattedProgress}%
            </span>
          </div>

          {/* Instant Skip Button */}
          <button
            onClick={onSkip}
            className="pointer-events-auto px-3.5 sm:px-4 py-1.5 rounded-full bg-[#090D1A]/95 border border-[#38BDF8]/60 hover:border-[#00F0FF] hover:bg-[#38BDF8]/20 active:scale-95 transition-all text-[10px] sm:text-[11px] font-bold text-[#38BDF8] hover:text-[#FFFFFF] uppercase tracking-wider cursor-pointer shadow-[0_0_16px_rgba(56,189,248,0.25)] hover:shadow-[0_0_28px_rgba(0,240,255,0.6)]"
          >
            <span>SKIP ⏭</span>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. SIDES: HIGH-TECH TELEMETRY PANELS                      */}
      {/* ========================================================= */}
      <div className="relative z-30 flex-1 flex items-center justify-between px-4 sm:px-8 pointer-events-none">
        {/* Left: Cyber Console Stream */}
        <div className="hidden md:flex flex-col gap-2 max-w-[260px] bg-[#070D1F]/80 border border-[#38BDF8]/30 rounded-xl p-3.5 backdrop-blur-xl shadow-[0_0_35px_rgba(56,189,248,0.12)]">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[9px] text-[#38BDF8] font-bold tracking-wider">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
              <span>TERMINAL // ASSEMBLY</span>
            </span>
            <span className="text-[#00F0FF] animate-pulse">ACTIVE</span>
          </div>
          <div className="flex flex-col gap-1.5 text-[10px] leading-snug">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`truncate transition-all duration-300 ${
                  log.type === 'cyan'
                    ? 'text-[#00F0FF]'
                    : log.type === 'success'
                    ? 'text-[#34D399]'
                    : 'text-[#94A3B8]'
                }`}
              >
                {log.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Wireframe Metrics */}
        <div className="hidden md:flex flex-col gap-2 max-w-[230px] text-right bg-[#070D1F]/80 border border-[#C084FC]/30 rounded-xl p-3.5 backdrop-blur-xl shadow-[0_0_35px_rgba(192,132,252,0.12)]">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[9px] text-[#C084FC] font-bold tracking-wider">
            <span className="text-[#C084FC] animate-pulse">4K REALTIME</span>
            <span>HARDWARE LINK</span>
          </div>
          <div className="text-[10px] text-[#94A3B8] flex flex-col gap-1">
            <div className="flex justify-between gap-2">
              <span className="text-[#64748B]">GEOMETRY:</span>
              <span className="text-white font-semibold">142K POLYGONS</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-[#64748B]">SHADERS:</span>
              <span className="text-[#00F0FF] font-semibold">PBR EMISSIVE</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-[#64748B]">TARGET:</span>
              <span className="text-[#38BDF8] font-semibold">60+ LOCKED FPS</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-[#64748B]">STATE:</span>
              <span className="text-[#34D399] font-semibold">
                {pInt < 100 ? 'CONVERGING...' : 'LOCKED'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. BOTTOM HOLOGRAPHIC WAVEFORM PROGRESS BAR               */}
      {/* ========================================================= */}
      <footer className="relative z-30 px-4 sm:px-12 pb-6 sm:pb-8 flex flex-col items-center gap-3">
        {/* Hologram Progress Track */}
        <div className="w-full max-w-xl flex flex-col gap-2">
          <div className="flex items-center justify-between text-[10px] text-[#8AE4FA] tracking-wider">
            <span className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
              <span className="font-semibold">QUANTUM HARMONIC WAVEFORM</span>
            </span>
            <span className="text-[#94A3B8] font-semibold">
              {pInt < 100 ? 'SYNTHESIZING MATRIX...' : 'SYNTHESIS COMPLETE'}
            </span>
          </div>

          {/* Animated Waveform Progress Bar */}
          <HolographicWaveformBar progress={progress} />

          {/* Milestone Markers */}
          <div className="flex justify-between px-1 text-[8px] sm:text-[9px] font-semibold">
            {[
              { label: 'BASE 0%', threshold: 0 },
              { label: 'CORE 25%', threshold: 25 },
              { label: 'NEURAL 50%', threshold: 50 },
              { label: 'CIRCUITS 75%', threshold: 75 },
              { label: 'ONLINE 100%', threshold: 100 },
            ].map((m) => {
              const isActive = pInt >= m.threshold;
              return (
                <span
                  key={m.label}
                  className={`transition-colors duration-300 ${
                    isActive
                      ? 'text-[#00F0FF] drop-shadow-[0_0_6px_rgba(0,240,255,0.8)]'
                      : 'text-[#475569]'
                  }`}
                >
                  {m.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Hint Subtitle */}
        <p className="text-[10px] sm:text-[11px] text-[#94A3B8]/80 text-center tracking-wider">
          REAL-TIME 4K HOLOGRAPHIC RECONSTRUCTION • PLEASE STAND BY
        </p>
      </footer>
    </motion.div>
  );
}
