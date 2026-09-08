'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface CyberAssemblyHUDProps {
  progress: number; // 0.0 to 1.0
  onReassemble?: () => void;
}

/**
 * Cybernetic Holographic HUD Assembly Overlay
 * Ultra-attractive sci-fi diagnostic terminal matching Mia's cyberpunk theme,
 * facial cybernetics, glowing electric blue neck circuits, and 4K tech aesthetics.
 */
export default function CyberAssemblyHUD({ progress, onReassemble }: CyberAssemblyHUDProps) {
  const percent = Math.min(100, Math.floor(progress * 100));
  const isComplete = progress >= 1.0;

  // Hex stream flickering for authentic cyberpunk computer feel
  const [hexCode, setHexCode] = useState('0x7F4A');
  useEffect(() => {
    const interval = setInterval(() => {
      const hex = '0x' + Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
      setHexCode(hex);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Total segments in the high-tech energy gauge
  const totalSegments = 24;
  const activeSegments = Math.floor((percent / 100) * totalSegments);

  // Status subtitle based on progress phase
  const getPhaseText = () => {
    if (percent < 25) return 'INITIALIZING_CYBER_SKELETON...';
    if (percent < 55) return 'SYNTHESIZING_ELECTRIC_NECK_CIRCUIT...';
    if (percent < 80) return 'MAPPING_4K_FACIAL_CYBERNETICS...';
    if (percent < 98) return 'CALIBRATING_MOUSE_HEAD_TRACKING...';
    return 'SYSTEM_ONLINE // READY';
  };

  return (
    <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 select-none z-30 pointer-events-auto transition-all duration-300 w-[92vw] max-w-[540px]">
      {/* Sci-Fi Chamfered Frame Container */}
      <div className="relative p-4 sm:p-5 rounded-xl bg-[#00094c]/85 border border-[#00F0FF]/50 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,240,255,0.35),inset_0_0_25px_rgba(0,184,255,0.18)] overflow-hidden">
        
        {/* Corner Cyber Brackets */}
        <span className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#00F0FF] pointer-events-none" />
        <span className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#00F0FF] pointer-events-none" />
        <span className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#00F0FF] pointer-events-none" />
        <span className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#00F0FF] pointer-events-none" />

        {/* Ambient Holographic Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.04)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-60" />

        {/* Header Section: Rotating Holographic Reticle + Live Progress Readout */}
        <div className="relative flex items-center justify-between gap-3 mb-3.5">
          {/* Left: Cyber Gyro Icon & Title */}
          <div className="flex items-center gap-3">
            {/* Spinning Radar Reticle */}
            <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
              <div className="absolute inset-0 rounded-full border border-dashed border-[#00F0FF]/60 animate-spin [animation-duration:6s]" />
              <div className="absolute inset-1 rounded-full border border-[#38BDF8]/40 animate-spin [animation-duration:3s] [animation-direction:reverse]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_12px_#00F0FF] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-[#38BDF8] uppercase font-semibold">
                  MIA_CYBORG // SYS_01
                </span>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#8AE4FA]">
                  {hexCode}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-mono font-bold tracking-wider text-white flex items-center gap-2 drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">
                QUANTUM_VOXEL_ASSEMBLY
              </h3>
            </div>
          </div>

          {/* Right: Glowing Numeric Percentage Badge */}
          <div className="flex flex-col items-end flex-shrink-0">
            <div className="flex items-baseline gap-1 font-mono font-black text-xl sm:text-2xl text-[#00F0FF] drop-shadow-[0_0_15px_#00F0FF]">
              <span>{percent}</span>
              <span className="text-xs text-[#8AE4FA] font-bold">%</span>
            </div>
            <span className="text-[8px] font-mono tracking-widest text-[#94A3B8] uppercase">
              {percent < 100 ? 'ASSEMBLING' : 'CALIBRATED'}
            </span>
          </div>
        </div>

        {/* High-Tech Segmented Quantum Energy Gauge */}
        <div className="relative mb-3">
          <div className="grid grid-cols-24 gap-1 p-1 rounded-lg bg-[#020517]/90 border border-[#00F0FF]/30 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">
            {Array.from({ length: totalSegments }).map((_, i) => {
              const isActive = i <= activeSegments;
              const isLeading = i === activeSegments;

              return (
                <div
                  key={i}
                  className={`h-3 rounded-sm transition-all duration-100 ${
                    isActive
                      ? isLeading
                        ? 'bg-white shadow-[0_0_14px_#FFFFFF,0_0_24px_#00F0FF]'
                        : 'bg-gradient-to-t from-[#0091FF] via-[#00E5FF] to-[#8AE4FA] shadow-[0_0_8px_rgba(0,229,255,0.6)]'
                      : 'bg-[#0B152B]/80'
                  }`}
                />
              );
            })}
          </div>

          {/* Sweeping Laser Glint along active bar */}
          <div
            className="absolute top-1 bottom-1 w-8 bg-gradient-to-r from-transparent via-white/80 to-transparent blur-xs pointer-events-none transition-all duration-100"
            style={{
              left: `${Math.max(0, Math.min(94, (percent / 100) * 94))}%`,
            }}
          />
        </div>

        {/* Biometric & Neural Sub-System Diagnostics Bar */}
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[9px] font-mono text-[#94A3B8] border-t border-[#00F0FF]/20 pt-2.5">
          {/* Phase status readout with pulsing LED */}
          <div className="flex items-center gap-1.5 text-[#8AE4FA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
            <span className="tracking-wide font-medium">{getPhaseText()}</span>
          </div>

          {/* Real-time Frequency Equalizer Bars */}
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-0.5 h-3">
              {[40, 85, 60, 100, 70, 90, 50, 80].map((h, idx) => (
                <div
                  key={idx}
                  className="w-1 bg-[#00F0FF] rounded-xs animate-pulse"
                  style={{
                    height: `${(h * (percent / 100))}%`,
                    animationDuration: `${0.3 + idx * 0.15}s`,
                    opacity: 0.5 + (idx % 3) * 0.25,
                  }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-[#00F0FF]/30">
              <span className="text-[#38BDF8] font-bold">36,000 VOXELS</span>
              <span className="text-[#00F0FF]">4K ULTRA_HD</span>
            </div>
          </div>
        </div>

        {/* Complete State or Re-assemble Quick Trigger */}
        {isComplete && onReassemble && (
          <div className="mt-3 pt-2.5 border-t border-[#00F0FF]/30 flex justify-end">
            <button
              onClick={onReassemble}
              className="px-3 py-1 rounded bg-[#00F0FF]/20 hover:bg-[#00F0FF]/35 border border-[#00F0FF]/60 text-[10px] font-mono text-[#8AE4FA] hover:text-white uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              ↻ RE-ASSEMBLE 4K VOXELS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
