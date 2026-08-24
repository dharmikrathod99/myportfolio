'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export default function TransformTransition() {
  const { isTransitioning, siteMode } = useTheme();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'warp' | 'glitch' | 'reveal'>('warp');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // Canvas warp tunnel animation
  useEffect(() => {
    if (!isTransitioning || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const w = window.innerWidth;
    const h = window.innerHeight;
    const cx = w / 2;
    const cy = h / 2;

    interface Star {
      x: number;
      y: number;
      z: number;
      pz: number;
    }

    const stars: Star[] = [];
    for (let i = 0; i < 600; i++) {
      stars.push({
        x: (Math.random() - 0.5) * w * 2,
        y: (Math.random() - 0.5) * h * 2,
        z: Math.random() * w,
        pz: 0,
      });
    }

    let startTime = performance.now();

    function animate(time: number) {
      if (!ctx) return;
      const elapsed = (time - startTime) / 1000;
      const speed = Math.min(elapsed * 15, 40); // Accelerating warp speed

      ctx.fillStyle = `rgba(5, 5, 5, ${elapsed < 0.3 ? 0.15 : 0.08})`;
      ctx.fillRect(0, 0, w, h);

      for (const star of stars) {
        star.pz = star.z;
        star.z -= speed;

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * w * 2;
          star.y = (Math.random() - 0.5) * h * 2;
          star.z = w;
          star.pz = w;
        }

        const sx = (star.x / star.z) * cx + cx;
        const sy = (star.y / star.z) * cy + cy;
        const px = (star.x / star.pz) * cx + cx;
        const py = (star.y / star.pz) * cy + cy;

        const size = Math.max(0, (1 - star.z / w) * 3);
        const alpha = Math.max(0, (1 - star.z / w) * 0.9);

        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 251, 27, ${alpha})`;
        ctx.lineWidth = size;
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();

        // Bright head
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        ctx.arc(sx, sy, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Center glow
      const glowRadius = Math.max(1, Math.min(Math.max(0, elapsed) * 80, 200));
      if (glowRadius > 0) {
        const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
        glowGrad.addColorStop(0, `rgba(0, 251, 27, ${Math.min(Math.max(0, elapsed) * 0.1, 0.15)})`);
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, w, h);
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [isTransitioning]);

  // Progress bar and phase management
  useEffect(() => {
    if (!isTransitioning) {
      setProgress(0);
      setPhase('warp');
      return;
    }

    setPhase('warp');
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 1.5;
      });
    }, 35);

    const glitchTimer = setTimeout(() => setPhase('glitch'), 1400);
    const revealTimer = setTimeout(() => setPhase('reveal'), 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(glitchTimer);
      clearTimeout(revealTimer);
    };
  }, [isTransitioning]);

  const targetMode = siteMode === '2d' ? '3D IMMERSIVE' : '2D CLASSIC';

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#030303]"
        >
          {/* Warp Speed Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ opacity: phase === 'reveal' ? 0.3 : 1, transition: 'opacity 0.5s' }}
          />

          {/* Scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,251,27,0.03) 2px, rgba(0,251,27,0.03) 4px)',
            }}
          />

          {/* Center Content */}
          <div className="relative z-20 flex flex-col items-center gap-6 px-4">
            {/* Glitch Text */}
            <motion.div
              animate={phase === 'glitch' ? {
                x: [0, -4, 4, -2, 2, 0],
                opacity: [1, 0.7, 1, 0.8, 1],
              } : {}}
              transition={{ duration: 0.15, repeat: phase === 'glitch' ? Infinity : 0 }}
              className="text-center"
            >
              <p className="text-xs font-mono uppercase tracking-[0.4em] text-accent/70 mb-2">
                {phase === 'reveal' ? '// READY' : '// INITIALIZING'}
              </p>
              <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tighter">
                TRANSFORM<span className="text-accent">ING</span>
              </h1>
              <p className="text-sm font-mono text-customText-secondary mt-2 tracking-wider">
                SWITCHING TO <span className="text-accent font-bold">{targetMode}</span> MODE
              </p>
            </motion.div>

            {/* Progress Bar */}
            <div className="w-64 sm:w-80 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                  background: 'linear-gradient(90deg, #042F0C, #00FB1B, #A3E635, #00FB1B)',
                  boxShadow: '0 0 15px rgba(0, 251, 27, 0.6), 0 0 30px rgba(0, 251, 27, 0.3)',
                }}
                transition={{ duration: 0.05 }}
              />
            </div>

            {/* Status Text */}
            <p className="text-[10px] font-mono text-customText-muted uppercase tracking-[0.3em]">
              {progress < 30
                ? 'Deconstructing UI layers...'
                : progress < 60
                ? 'Initializing WebGL renderer...'
                : progress < 85
                ? 'Loading 3D scene graph...'
                : 'Compositing final frame...'}
            </p>

            {/* Orbiting Dots */}
            <div className="relative w-16 h-16 mt-2">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_#00FB1B]"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 0.375,
                  }}
                  style={{
                    top: '50%',
                    left: '50%',
                    transformOrigin: '-20px 0px',
                  }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-accent/30 animate-ping" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
