'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface DKStatusHUDProps {
  progress: number;
  isOnline: boolean;
  interactionState?: 'IDLE' | 'SPEAKING' | 'LISTENING' | 'THINKING';
}

export function DKStatusHUD({ progress, isOnline, interactionState = 'IDLE' }: DKStatusHUDProps) {
  let statusText = `ASSEMBLING... ${String(progress).padStart(2, '0')}%`;
  let statusColor = '#8AE4FA'; // Brand Bright Cyan

  if (isOnline) {
    if (interactionState === 'SPEAKING') {
      statusText = 'DK RESPONDING...';
      statusColor = '#DDA856'; // Gold
    } else if (interactionState === 'LISTENING') {
      statusText = 'DK LISTENING...';
      statusColor = '#8AE4FA';
    } else if (interactionState === 'THINKING') {
      statusText = 'DK THINKING...';
      statusColor = '#DEC890';
    } else {
      statusText = 'DK ONLINE';
      statusColor = '#8AE4FA';
    }
  } else if (progress < 15) {
    statusText = 'INITIALIZING DK...';
  } else if (progress < 35) {
    statusText = 'LOADING NEURAL FIELD...';
  } else if (progress < 60) {
    statusText = `ASSEMBLING DIGITAL FORM... ${progress}%`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#212636]/80 border border-[#353D50] backdrop-blur-md shadow-[0_0_20px_rgba(138,228,250,0.15)] select-none"
    >
      <span
        className="w-2 h-2 rounded-full animate-ping"
        style={{ backgroundColor: statusColor }}
      />
      <span
        className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase"
        style={{ color: statusColor }}
      >
        {statusText}
      </span>
    </motion.div>
  );
}

export default DKStatusHUD;
