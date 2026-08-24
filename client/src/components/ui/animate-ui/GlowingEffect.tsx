'use client';

import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

interface GlowingEffectProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  spread?: number;
}

export function GlowingEffect({
  children,
  className = '',
  glowColor = '#3A86FF',
  spread = 400,
}: GlowingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowBgRef = useRef<HTMLDivElement>(null);
  const glowBorderRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (glowBgRef.current) {
      glowBgRef.current.style.background = `radial-gradient(${spread}px circle at ${x}px ${y}px, ${glowColor}25, transparent 80%)`;
      glowBgRef.current.style.opacity = '1';
    }
    if (glowBorderRef.current) {
      glowBorderRef.current.style.background = `radial-gradient(${spread / 2}px circle at ${x}px ${y}px, ${glowColor}, transparent 80%)`;
      glowBorderRef.current.style.opacity = '1';
    }
  };

  const handleMouseEnter = () => {
    if (glowBgRef.current) glowBgRef.current.style.opacity = '1';
    if (glowBorderRef.current) glowBorderRef.current.style.opacity = '1';
  };

  const handleMouseLeave = () => {
    if (glowBgRef.current) glowBgRef.current.style.opacity = '0';
    if (glowBorderRef.current) glowBorderRef.current.style.opacity = '0';
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn('relative rounded-2xl overflow-hidden group', className)}
    >
      {/* Background radial glow */}
      <div
        ref={glowBgRef}
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-2xl z-0 opacity-0"
      />
      {/* Border beam line */}
      <div
        ref={glowBorderRef}
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-2xl z-10 p-[1px] opacity-0"
        style={{
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      <div className="relative z-20">{children}</div>
    </div>
  );
}
