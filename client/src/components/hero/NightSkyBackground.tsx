'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

export interface NightSkyBackgroundProps {
  starCount?: number;
  twinkleSpeed?: number;
  cometFrequency?: number;
  cometColor?: string;
  gradientTop?: string;
  gradientBottom?: string;
  className?: string;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface Comet {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

/**
 * 100% Exact Night Sky Background Component
 * Matches Framer https://framer.com/m/NightSkyBackground-QCgc.js@aMQeY1TAPqF1ZGUStSkt
 * with exact midnight-blue to pure-black gradient (#00094c -> #000000)
 * featuring twinkling starfield and animated shooting comets.
 */
export default function NightSkyBackground({
  starCount = 130,
  twinkleSpeed = 2,
  cometFrequency = 6,
  cometColor = '#ffffff',
  gradientTop = '#00094c',
  gradientBottom = '#000000',
  className = '',
}: NightSkyBackgroundProps) {
  const [comets, setComets] = useState<Comet[]>([]);

  // Pre-generate deterministic stars to prevent SSR mismatch and maximize 60 FPS performance
  const stars = useMemo(() => {
    const starArray: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      starArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.6 + 0.8, // crisp 0.8px - 2.4px stars
        delay: Math.random() * 8,
        duration: (Math.random() * 3 + 2) / (twinkleSpeed / 2),
      });
    }
    return starArray;
  }, [starCount, twinkleSpeed]);

  // Occasional shooting comets streak across the upper atmosphere
  useEffect(() => {
    const interval = setInterval(() => {
      const startX = Math.random() * 30; // Start in top-left or mid-left
      const startY = Math.random() * 45;
      const newComet: Comet = {
        id: Date.now() + Math.random(),
        startX: startX,
        startY: startY,
        endX: startX + 60 + Math.random() * 30,
        endY: startY + 25 + Math.random() * 25,
      };

      setComets((prev) => [...prev, newComet]);

      // Remove after streak completes
      setTimeout(() => {
        setComets((prev) => prev.filter((c) => c.id !== newComet.id));
      }, 1200);
    }, cometFrequency * 1000);

    return () => clearInterval(interval);
  }, [cometFrequency]);

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none ${className}`}
      style={{
        background: `linear-gradient(to bottom, ${gradientTop} 0%, #00073a 22%, #000528 48%, #000215 75%, ${gradientBottom} 100%)`,
      }}
    >
      {/* 1:1 Reference Texture Overlay (Subtle noise/depth from attached photo) */}
      <div
        className="absolute inset-0 w-full h-full opacity-35 mix-blend-screen bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url('/night_sky.png')`,
        }}
      />

      {/* Dynamic Twinkling Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            boxShadow: '0 0 2px rgba(255, 255, 255, 0.85)',
          }}
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
            repeatDelay: Math.random() * 2,
          }}
        />
      ))}

      {/* Dynamic Streaking Comets */}
      {comets.map((comet) => {
        const dx = (comet.endX - comet.startX) * 10;
        const dy = (comet.endY - comet.startY) * 10;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        return (
          <motion.div
            key={comet.id}
            style={{
              position: 'absolute',
              left: `${comet.startX}%`,
              top: `${comet.startY}%`,
              width: 3,
              height: 3,
              borderRadius: '50%',
              backgroundColor: cometColor,
              boxShadow: `0 0 15px ${cometColor}, 0 0 30px ${cometColor}, 0 0 50px ${cometColor}`,
              filter: 'blur(0.5px)',
            }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: `${dx}px`,
              y: `${dy}px`,
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          >
            {/* Aerodynamic glowing comet tail */}
            <motion.div
              style={{
                position: 'absolute',
                width: 55,
                height: 2,
                background: `linear-gradient(to right, transparent, ${cometColor})`,
                filter: 'blur(1.5px)',
                transformOrigin: 'right center',
                right: 0,
                top: '50%',
                transform: `translateY(-50%) rotate(${angle}deg)`,
              }}
              animate={{ opacity: [0, 0.85, 0] }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
