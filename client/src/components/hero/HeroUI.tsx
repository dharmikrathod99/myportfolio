'use client';

import React from 'react';
import { motion } from 'framer-motion';
import DKStatusHUD from './DKStatusHUD';

export interface HeroUIProps {
  progress: number;
  isOnline: boolean;
  interactionState?: 'IDLE' | 'SPEAKING' | 'LISTENING' | 'THINKING';
}

export function HeroUI({ progress, isOnline, interactionState }: HeroUIProps) {
  return (
    <div className="w-full flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 max-w-lg z-20 pointer-events-auto">
      {/* Telemetry Status HUD */}
      <DKStatusHUD
        progress={progress}
        isOnline={isOnline}
        interactionState={interactionState}
      />

      {/* Brand & Name Minimal Typography */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="space-y-1"
      >
        <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#56AEEB]/15 border border-[#56AEEB]/30 text-[10px] font-mono text-[#8AE4FA] font-bold uppercase tracking-widest">
          DR. DEVELOPER · AI ASSISTANT // DIY KAN (DK)
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-display tracking-tight text-[#F5F7FA] leading-tight">
          Building Digital Intelligence,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#56AEEB] via-[#8AE4FA] to-[#DEC890]">
            One System at a Time.
          </span>
        </h1>
      </motion.div>
    </div>
  );
}

export default HeroUI;
