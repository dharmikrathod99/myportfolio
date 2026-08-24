'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Smooth springs for high-performance physics-driven cursor without React re-renders
  const dotX = useSpring(rawX, { damping: 40, stiffness: 600, mass: 0.05 });
  const dotY = useSpring(rawY, { damping: 40, stiffness: 600, mass: 0.05 });

  const ringX = useSpring(rawX, { damping: 25, stiffness: 220, mass: 0.15 });
  const ringY = useSpring(rawY, { damping: 25, stiffness: 220, mass: 0.15 });

  useEffect(() => {
    // Only enable on pointer-fine devices (desktops/laptops)
    if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    let hasSetVisible = false;

    const handleMouseMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!hasSetVisible) {
        setIsVisible(true);
        hasSetVisible = true;
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        Boolean(target.closest('button, a, input, textarea, [data-cursor-hover="true"]'));

      setIsHovered(isInteractive);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      hasSetVisible = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [rawX, rawY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-accent rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.6 : isHovered ? 1.8 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
      {/* Outer Ring Glow */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-accent/40 rounded-full pointer-events-none z-[9998] hidden md:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovered ? 1.5 : 1,
          borderColor: isHovered ? 'rgba(0, 136, 204, 0.9)' : 'rgba(0, 136, 204, 0.3)',
          backgroundColor: isHovered ? 'rgba(0, 136, 204, 0.1)' : 'transparent',
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
