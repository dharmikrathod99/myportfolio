'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface CyberAssemblyHUDProps {
  progress: number; // 0 to 100
  item?: string; // current asset path being fetched
  loaded?: number;
  total?: number;
  isManualTrigger?: boolean;
  onComplete: () => void;
  onShake: (isShaking: boolean) => void;
  onSkip: () => void;
}

interface LogEntry {
  text: string;
  type: 'info' | 'success' | 'warn' | 'cyan';
}

// -------------------------------------------------------------
// DYNAMIC HOLOGRAPHIC WAVEFORM PROGRESS BAR
// -------------------------------------------------------------
function HolographicWaveformBar({ progress }: { progress: number }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let animId: number;
    let t = 0;
    const loop = () => {
      t += 0.055;
      setPhase(t);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const width = 600;
  const height = 44;
  const midY = height / 2;
  const clampedProgress = Math.min(100, Math.max(2, progress));
  const activeWidth = (width * clampedProgress) / 100;

  // Build the harmonic wave paths
  const step = 3;
  let bgPath = `M 0 ${midY}`;
  let activePath = `M 0 ${midY}`;
  let echoPath = `M 0 ${midY}`;
  let headX = 0;
  let headY = midY;

  for (let x = 0; x <= width; x += step) {
    const env = Math.sin((x / width) * Math.PI) * 0.35 + 0.65;
    const w1 = Math.sin(x * 0.042 - phase * 2.2) * 10 * env;
    const w2 = Math.sin(x * 0.085 + phase * 1.5) * 3.5 * env;
    const y = midY + w1 + w2;

    const echoY = midY + Math.sin(x * 0.038 - phase * 1.6 + 1.2) * 8 * env;

    bgPath += ` L ${x} ${y.toFixed(2)}`;
    echoPath += ` L ${x} ${echoY.toFixed(2)}`;

    if (x <= activeWidth) {
      activePath += ` L ${x} ${y.toFixed(2)}`;
      headX = x;
      headY = y;
    }
  }

  const activeFillPath = `${activePath} L ${headX} ${height} L 0 ${height} Z`;

  return (
    <div className="relative w-full rounded-xl bg-[#091124]/85 border border-[#38BDF8]/40 p-2 sm:p-2.5 backdrop-blur-md shadow-[0_0_25px_rgba(56,189,248,0.2)]">
      {/* Corner tech brackets */}
      <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#00F0FF]" />
      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#00F0FF]" />
      <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#00F0FF]" />
      <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#00F0FF]" />

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-10 sm:h-12 overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Neon Glow Filter */}
          <filter id="neon-glow" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Electric Wave Gradient */}
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#00F0FF" />
          </linearGradient>

          {/* Under-wave Energy Fill Gradient */}
          <linearGradient id="wave-fill-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Center Guide Baseline */}
        <line
          x1="0"
          y1={midY}
          x2={width}
          y2={midY}
          stroke="rgba(56,189,248,0.12)"
          strokeDasharray="4 6"
          strokeWidth="1"
        />

        {/* Inactive Carrier Wave (Dashed Blueprint Wave) */}
        <path
          d={bgPath}
          fill="none"
          stroke="rgba(56, 189, 248, 0.2)"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />

        {/* Active Wave Soft Gradient Underfill */}
        <path
          d={activeFillPath}
          fill="url(#wave-fill-gradient)"
        />

        {/* Secondary Harmonic Echo Wave */}
        <path
          d={echoPath}
          fill="none"
          stroke="#A855F7"
          strokeWidth="1.2"
          opacity="0.35"
        />

        {/* Primary Active Electric Wave */}
        <path
          d={activePath}
          fill="none"
          stroke="url(#wave-gradient)"
          strokeWidth="2.8"
          strokeLinecap="round"
          filter="url(#neon-glow)"
        />

        {/* Leading Quantum Laser Spark Node */}
        {clampedProgress > 0 && (
          <g transform={`translate(${headX}, ${headY})`}>
            {/* Outer expanding ripple */}
            <circle r="7" fill="none" stroke="#00F0FF" strokeWidth="1.5" opacity="0.75" />
            {/* Core glow halo */}
            <circle r="4" fill="#00F0FF" opacity="0.9" />
            {/* White-hot center */}
            <circle r="2" fill="#FFFFFF" />
            {/* Vertical drop laser scanline */}
            <line x1="0" y1="-7" x2="0" y2="7" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.9" />
          </g>
        )}
      </svg>
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
  onComplete,
  onShake,
  onSkip,
}: CyberAssemblyHUDProps) {
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    { text: 'INIT // WebGL2 4K Quantum Engine', type: 'info' },
    { text: 'SYS // Camera & Light Rig Calibrated', type: 'success' },
  ]);
  const [phase, setPhase] = useState<'BUILDING' | 'SYNTHESIZED' | 'ONLINE'>('BUILDING');
  const loggedMilestones = useRef<Set<number>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update real-time system logs as progress advances
  useEffect(() => {
    const p = Math.floor(progress);

    const addLog = (text: string, type: 'info' | 'success' | 'warn' | 'cyan') => {
      setLogs((prev) => [...prev.slice(-4), { text, type }]);
    };

    if (p >= 15 && !loggedMilestones.current.has(15)) {
      loggedMilestones.current.add(15);
      addLog('LATTICE // Constructing nanotech base rings', 'cyan');
    }
    if (p >= 35 && !loggedMilestones.current.has(35)) {
      loggedMilestones.current.add(35);
      addLog('CORE // Initializing quantum reactor & conduits', 'info');
    }
    if (p >= 55 && !loggedMilestones.current.has(55)) {
      loggedMilestones.current.add(55);
      addLog('CIRCUIT // Synthesizing forehead & neck electric lines', 'cyan');
    }
    if (p >= 75 && !loggedMilestones.current.has(75)) {
      loggedMilestones.current.add(75);
      addLog('OPTICS // Ocular tracking & cyber earphone online', 'success');
    }
    if (p >= 92 && !loggedMilestones.current.has(92)) {
      loggedMilestones.current.add(92);
      addLog('TEXTURE // 4K PBR diffuse & normal maps bound', 'success');
    }

    if (p >= 100 && phase === 'BUILDING' && !loggedMilestones.current.has(100)) {
      loggedMilestones.current.add(100);
      setPhase('ONLINE');
      onComplete();
    }
  }, [progress, phase, onShake, onComplete]);

  // Stage description based on percentage
  const stageInfo = (() => {
    if (progress < 25) return { stage: 'STAGE 01', title: 'NANITE FRAMEWORK & BASE RINGS' };
    if (progress < 50) return { stage: 'STAGE 02', title: 'QUANTUM CORE & HYDRAULIC CONDUITS' };
    if (progress < 75) return { stage: 'STAGE 03', title: 'NEON CIRCUITS & NEURAL SCHEMATICS' };
    if (progress < 99) return { stage: 'STAGE 04', title: 'BIOMETRIC CALIBRATION & 4K SHADERS' };
    return { stage: 'STAGE 05', title: 'SYNTHESIS COMPLETE // DEPLOYING AVATAR' };
  })();

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {phase !== 'ONLINE' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="fixed inset-0 z-[9999] w-full h-full flex flex-col justify-between font-mono select-none pointer-events-none overflow-hidden"
        >
          {/* Radial Sci-Fi Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_35%,_rgba(7,10,20,0.65)_70%,_rgba(3,7,18,0.92)_100%)] pointer-events-none" />

          {/* CRT Scanlines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.015)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-60" />

          {/* Hologram Grid Overlay on Borders */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#030712]/90 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#030712]/95 via-[#030712]/80 to-transparent pointer-events-none" />

          {/* ========================================================= */}
          {/* 1. TOP FUTURISTIC STATUS BAR                              */}
          {/* ========================================================= */}
          <header className="relative z-30 px-4 sm:px-8 pt-5 flex items-center justify-between">
            {/* Left: Protocol & Stage Indicator */}
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-ping" />
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs text-[#38BDF8] tracking-widest font-bold">
                  HOLOGRAPHIC SYNTHESIS PROTOCOL
                </span>
                <div className="flex items-center gap-2 text-[9px] sm:text-[11px] text-[#94A3B8]">
                  <span className="text-[#00F0FF] font-semibold">{stageInfo.stage}:</span>
                  <span>{stageInfo.title}</span>
                </div>
              </div>
            </div>

            {/* Right: Progress readout & Skip */}
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="flex items-baseline gap-1.5 bg-[#0F172A]/80 border border-[#38BDF8]/40 px-3.5 py-1 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.25)]">
                <span className="text-[10px] text-[#94A3B8] hidden sm:inline">BUILD:</span>
                <span className="text-base sm:text-lg font-bold text-[#00F0FF] tracking-wider tabular-nums">
                  {Math.min(100, Math.floor(progress))}%
                </span>
              </div>

              <button
                onClick={onSkip}
                className="pointer-events-auto px-3 sm:px-4 py-1.5 rounded-full bg-[#090D1A]/90 border border-[#38BDF8]/60 hover:border-[#00F0FF] hover:bg-[#38BDF8]/20 transition-all text-[10px] sm:text-[11px] font-bold text-[#38BDF8] hover:text-[#FFFFFF] uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(56,189,248,0.25)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]"
              >
                <span>SKIP ⏭</span>
              </button>
            </div>
          </header>

          {/* ========================================================= */}
          {/* 2. SIDES: FLOATING COMPACT TELEMETRY PANELS               */}
          {/* ========================================================= */}
          <div className="relative z-30 flex-1 flex items-center justify-between px-4 sm:px-8 pointer-events-none">
            {/* Left: Cyber Console Stream */}
            <div className="hidden md:flex flex-col gap-2 max-w-[240px] bg-[#070D1F]/75 border border-[#38BDF8]/30 rounded-xl p-3 backdrop-blur-md shadow-[0_0_30px_rgba(56,189,248,0.15)]">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[9px] text-[#38BDF8] font-bold tracking-wider">
                <span>TERMINAL // ASSEMBLY</span>
                <span className="text-[#00F0FF] animate-pulse">LIVE</span>
              </div>
              <div className="flex flex-col gap-1 text-[10px] leading-snug">
                {logs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`truncate ${
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
            <div className="hidden md:flex flex-col gap-1.5 max-w-[210px] text-right bg-[#070D1F]/75 border border-[#C084FC]/30 rounded-xl p-3 backdrop-blur-md shadow-[0_0_30px_rgba(192,132,252,0.15)]">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[9px] text-[#C084FC] font-bold tracking-wider">
                <span className="text-[#C084FC] animate-pulse">4K PBR</span>
                <span>MODEL SPECS</span>
              </div>
              <div className="text-[10px] text-[#94A3B8] flex flex-col gap-0.5">
                <div>LATTICE: <span className="text-white font-semibold">142K POLYGONS</span></div>
                <div>CIRCUITRY: <span className="text-[#00F0FF] font-semibold">DUAL-SIDE GLOW</span></div>
                <div>EARPHONE: <span className="text-[#38BDF8] font-semibold">PLASMA ARC</span></div>
                <div>FRAME RATE: <span className="text-[#34D399] font-semibold">60+ FPS</span></div>
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
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
                  <span>QUANTUM HARMONIC WAVEFORM</span>
                </span>
                <span className="text-[#94A3B8]">
                  {progress < 100 ? 'SYNTHESIZING...' : 'READY'}
                </span>
              </div>

              {/* Animated Holographic Waveform Progress Bar */}
              <HolographicWaveformBar progress={progress} />

              {/* Milestone Markers */}
              <div className="flex justify-between px-1 text-[8px] text-[#64748B]">
                <span>BASE 0%</span>
                <span>CORE 35%</span>
                <span>CIRCUITS 65%</span>
                <span>BIOMETRICS 90%</span>
                <span>ONLINE 100%</span>
              </div>
            </div>

            {/* Hint Subtitle */}
            <p className="text-[10px] sm:text-[11px] text-[#94A3B8]/80 text-center tracking-wider">
              REAL-TIME HOLOGRAPHIC RECONSTRUCTION • PLEASE STAND BY
            </p>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
