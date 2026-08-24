'use client';

import React, { useRef } from 'react';

interface VengeanceSpotlightButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function VengeanceSpotlightButton({
  children,
  className = '',
  glowColor = 'rgba(0, 251, 27, 0.4)',
  ...props
}: VengeanceSpotlightButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || !glowRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glowRef.current.style.background = `radial-gradient(160px circle at ${x}px ${y}px, ${glowColor}, transparent 80%)`;
    glowRef.current.style.opacity = '1';
  };

  const handleMouseEnter = () => {
    if (glowRef.current) glowRef.current.style.opacity = '1';
  };

  const handleMouseLeave = () => {
    if (glowRef.current) glowRef.current.style.opacity = '0';
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-dark-card/90 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-accent/60 active:scale-95 shadow-xl group backdrop-blur-xl ${className}`}
      {...props}
    >
      {/* Glossy Meniscus Dome */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl z-10 bg-gradient-to-b from-white/20 via-white/5 to-transparent" />
      {/* Inner Chrome Bevel Highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl z-10 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.35),inset_0_-2px_4px_rgba(0,0,0,0.5)]" />
      {/* Lens Flare Glare Sweep */}
      <div className="pointer-events-none absolute -inset-full top-0 w-1/2 h-full z-20 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[350%] transition-transform duration-1000 ease-out" />
      
      {/* Spotlight Glow Layer */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 z-0"
      />
      {/* Inner Glow Shadow Border */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
        style={{
          boxShadow: `inset 0 0 20px ${glowColor}`,
        }}
      />
      <span className="relative z-30 flex items-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{children}</span>
    </button>
  );
}
