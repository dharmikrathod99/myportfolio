'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ElectricalSkillCardProps {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const ELECTRIC_BOLTS = [
  { tx: 0, ty: -30, rot: 0 },
  { tx: 22, ty: -22, rot: 45 },
  { tx: 30, ty: 0, rot: 90 },
  { tx: 22, ty: 22, rot: 135 },
  { tx: 0, ty: 30, rot: 180 },
  { tx: -22, ty: 22, rot: 225 },
  { tx: -30, ty: 0, rot: 270 },
  { tx: -22, ty: -22, rot: 315 },
];

export default function ElectricalSkillCard({ name, icon: IconComponent }: ElectricalSkillCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [blastKey, setBlastKey] = useState(0);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setBlastKey((prev) => prev + 1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center gap-1.5 text-center group cursor-pointer transition-all duration-300 overflow-visible select-none ${
        isHovered
          ? 'bg-[#111C33]/95 border border-[#00F0FF] shadow-[0_0_24px_rgba(0,240,255,0.45),inset_0_0_14px_rgba(0,240,255,0.2)] -translate-y-1'
          : 'bg-[#0B1324]/80 border border-white/[0.08] hover:border-[#00F0FF]/50'
      }`}
      style={{ perspective: 800 }}
    >
      {/* ================= ELECTRICAL BLAST EFFECT (ON HOVER) ================= */}
      <AnimatePresence>
        {isHovered && blastKey > 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 overflow-visible">
            {/* 1. Core High-Voltage Radial Energy Flare */}
            <motion.div
              key={`flash-${blastKey}`}
              initial={{ scale: 0.4, opacity: 0.95 }}
              animate={{ scale: 2.4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.42, ease: 'easeOut' }}
              className="absolute w-12 h-12 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,1)_0%,_rgba(0,240,255,0.85)_30%,_rgba(56,189,248,0.3)_60%,_transparent_75%)] mix-blend-screen"
            />

            {/* 2. Primary Expanding Electric Shockwave Ring */}
            <motion.div
              key={`ring1-${blastKey}`}
              initial={{ scale: 0.3, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.48, ease: 'easeOut' }}
              className="absolute w-10 h-10 rounded-full border-2 border-[#00F0FF] shadow-[0_0_15px_#00F0FF,inset_0_0_10px_#00F0FF]"
            />

            {/* 3. Secondary Crisp White Shockwave Ring */}
            <motion.div
              key={`ring2-${blastKey}`}
              initial={{ scale: 0.2, opacity: 0.9 }}
              animate={{ scale: 1.7, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.38, delay: 0.04, ease: 'easeOut' }}
              className="absolute w-8 h-8 rounded-full border border-white shadow-[0_0_10px_#FFFFFF]"
            />

            {/* 4. 8-Directional Radial Lightning Sparks */}
            {ELECTRIC_BOLTS.map((bolt, i) => (
              <motion.div
                key={`bolt-${blastKey}-${i}`}
                initial={{ x: 0, y: 0, scale: 0.3, opacity: 1 }}
                animate={{
                  x: bolt.tx,
                  y: bolt.ty,
                  scale: [0.3, 1.25, 0],
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="absolute"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  style={{ transform: `rotate(${bolt.rot}deg)` }}
                >
                  <path
                    d="M9 0 L11 6 L7 9 L12 18"
                    stroke="#00F0FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_6px_#00F0FF]"
                  />
                  <path
                    d="M9 0 L11 6 L7 9 L12 18"
                    stroke="#FFFFFF"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ================= 3D FLIPPING ICON ================= */}
      <motion.div
        animate={
          isHovered
            ? {
                rotateY: 360,
                scale: 1.18,
                filter: 'drop-shadow(0 0 12px #00F0FF) brightness(1.25)',
              }
            : {
                rotateY: 0,
                scale: 1,
                filter: 'drop-shadow(0 0 0px transparent) brightness(1)',
              }
        }
        transition={{
          duration: 0.6,
          ease: [0.34, 1.56, 0.64, 1], // Springy snap ease
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative z-10 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shrink-0"
      >
        <IconComponent className="w-full h-full object-contain pointer-events-none" />
      </motion.div>

      {/* ================= SKILL NAME ================= */}
      <span
        className={`relative z-10 text-[10px] sm:text-[11px] font-sans font-medium transition-colors duration-200 truncate max-w-full ${
          isHovered ? 'text-white font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]' : 'text-white/90'
        }`}
      >
        {name}
      </span>
    </div>
  );
}
