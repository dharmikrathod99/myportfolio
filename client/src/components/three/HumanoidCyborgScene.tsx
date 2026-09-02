'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface HumanoidCyborgSceneProps {
  className?: string;
}

interface Particle {
  // Target position in 3D
  tx: number;
  ty: number;
  tz: number;
  // Current position during assembly & animation
  x: number;
  y: number;
  z: number;
  // Origin position for assembly scatter
  ox: number;
  oy: number;
  oz: number;
  // Visual properties
  baseSize: number;
  color: [number, number, number]; // [r, g, b]
  alpha: number;
  delay: number;
  pulsePhase: number;
  pulseSpeed: number;
  isDust?: boolean;
}

export function HumanoidCyborgScene({ className = '' }: HumanoidCyborgSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [assemblyPercent, setAssemblyPercent] = useState(0);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = container.offsetWidth || window.innerWidth);
    let height = (canvas.height = container.offsetHeight || window.innerHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Mouse tracking for 3D parallax tilt
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container || !canvas) return;
      width = container.offsetWidth || window.innerWidth;
      height = container.offsetHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', handleResize);

    // ================= GENERATE PRECISE CONTOUR PARTICLES =================
    const particles: Particle[] = [];

    // Helper: random scatter origin
    const getScatterOrigin = () => {
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const dist = 3.5 + Math.random() * 5.0;
      return {
        ox: Math.cos(theta) * Math.cos(phi) * dist,
        oy: Math.sin(phi) * dist + 0.2,
        oz: Math.sin(theta) * Math.cos(phi) * dist,
      };
    };

    // 1. HEAD & FACE HORIZONTAL SCAN LINES (Concentric wavy contours)
    const headLineCount = 42;
    for (let l = 0; l < headLineCount; l++) {
      const v = l / (headLineCount - 1); // 0 (chin) to 1 (top of head)
      const baseTy = -0.4 + v * 1.35; // y-coordinates in 3D

      // Head horizontal width profile
      let rx = 0;
      if (v < 0.22) {
        rx = 0.22 + v * 1.4; // Jawline taper
      } else if (v < 0.65) {
        rx = 0.52 + Math.sin((v - 0.22) * Math.PI) * 0.07; // Temples & cheeks
      } else {
        const domeV = (v - 0.65) / 0.35;
        rx = Math.sqrt(Math.max(0.0, 1.0 - domeV * domeV)) * 0.56; // Cranium dome
      }

      const rz = rx * 0.95;
      const pointsInLine = Math.floor(45 + rx * 90);

      for (let p = 0; p < pointsInLine; p++) {
        const u = p / (pointsInLine - 1); // 0 (left) to 1 (right)
        const uAngle = Math.PI * (1.0 - u); // Front semi-circle facing camera

        // 3D coordinates
        let tx = Math.cos(uAngle) * rx;
        let tz = Math.sin(uAngle) * rz;
        let ty = baseTy;

        // Wave displacement in face/mouth area (horizontal sine wave ripples)
        if (v > 0.25 && v < 0.75) {
          const waveFactor = Math.sin(((v - 0.25) / 0.5) * Math.PI);
          ty += Math.sin(tx * 14.0) * 0.015 * waveFactor;
        }

        // Color & Light gradient:
        // Center face area has warm golden-amber core (#FF9900 / #FFCC00), edges have electric cyan (#00E5FF)
        const distFromCenter = Math.sqrt(tx * tx + (ty - 0.3) * (ty - 0.3) * 1.8);
        let col: [number, number, number] = [0, 225, 255]; // Cyan

        if (distFromCenter < 0.32) {
          // Intense warm golden orange core in the face center
          const coreMix = 1.0 - distFromCenter / 0.32;
          col = [
            Math.round(255),
            Math.round(150 + 80 * coreMix),
            Math.round(10 + 40 * coreMix),
          ];
        } else if (distFromCenter < 0.52) {
          // Soft golden-cyan transition
          const transMix = (0.52 - distFromCenter) / 0.2;
          col = [
            Math.round(0 + 255 * transMix),
            Math.round(225 - 50 * transMix),
            Math.round(255 - 200 * transMix),
          ];
        } else {
          // Outer edge electric cyan
          col = [0, 220 + Math.floor(Math.random() * 35), 255];
        }

        const { ox, oy, oz } = getScatterOrigin();
        particles.push({
          tx,
          ty,
          tz,
          x: ox,
          y: oy,
          z: oz,
          ox,
          oy,
          oz,
          baseSize: 1.1 + Math.random() * 0.7,
          color: col,
          alpha: 0.75 + Math.random() * 0.25,
          delay: 0.1 + (1.0 - v) * 0.4 + Math.random() * 0.25,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 1.5 + Math.random() * 2.0,
        });
      }
    }

    // 2. NECK & THROAT VERTICAL NEURAL STREAMS
    const neckStreamCount = 28;
    for (let ns = 0; ns < neckStreamCount; ns++) {
      const streamT = ns / (neckStreamCount - 1); // 0 (left neck) to 1 (right neck)
      const nxRatio = (streamT - 0.5) * 2.0; // -1 to 1
      const isCenterSpine = Math.abs(nxRatio) < 0.25;

      const pointsInStream = 26;
      for (let p = 0; p < pointsInStream; p++) {
        const sv = p / (pointsInStream - 1); // 0 (top neck) to 1 (clavicle)
        const ty = -0.4 - sv * 0.45;
        const neckWidth = 0.22 + sv * 0.18;
        
        let tx = nxRatio * neckWidth;
        // Natural spinal divergence
        if (isCenterSpine) {
          tx += Math.sin(sv * Math.PI * 2) * 0.018 * (streamT > 0.5 ? 1 : -1);
        }

        const tz = Math.sqrt(Math.max(0.01, 1.0 - (nxRatio * nxRatio))) * 0.18;

        // Center spine has radiant gold, outer neck in cyan
        let col: [number, number, number] = isCenterSpine
          ? [255, 170 + Math.floor(Math.random() * 50), 20]
          : [0, 210, 255];

        const { ox, oy, oz } = getScatterOrigin();
        particles.push({
          tx,
          ty,
          tz,
          x: ox,
          y: oy,
          z: oz,
          ox,
          oy,
          oz,
          baseSize: isCenterSpine ? 1.4 : 1.1,
          color: col,
          alpha: isCenterSpine ? 0.95 : 0.7,
          delay: 0.35 + sv * 0.3 + Math.random() * 0.2,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 2.0 + Math.random() * 1.5,
        });
      }
    }

    // 3. SHOULDER & CLAVICLE CONCENTRIC FIBER ARCS (Sweeping gracefully outward)
    const shoulderArcCount = 48;
    for (let sa = 0; sa < shoulderArcCount; sa++) {
      const arcV = sa / (shoulderArcCount - 1); // 0 (neck base) to 1 (outer chest & arms)
      const pointsInArc = 75;

      for (let p = 0; p < pointsInArc; p++) {
        const u = p / (pointsInArc - 1); // 0 (left shoulder) to 1 (right shoulder)
        const t = (u - 0.5) * 2.0; // -1 to +1
        const absT = Math.abs(t);

        // Shoulder span width fanning outward
        const spanWidth = 0.38 + arcV * 1.85;
        const tx = t * spanWidth;

        // Curved clavicle / trapezius arch trajectory
        const ty = -0.85 - arcV * 0.65 - (absT * absT) * (0.35 + arcV * 0.45);
        const tz = 0.15 - (absT * absT) * 0.2 - arcV * 0.2;

        // Center sternum stream in golden amber, shoulders in luminous electric cyan/blue
        let col: [number, number, number] = [0, 210, 255];
        if (absT < 0.12 && arcV < 0.35) {
          col = [255, 175, 20]; // Sternum gold
        } else if (absT > 0.55) {
          col = [0, 160 + Math.floor(Math.random() * 60), 255]; // Deep sapphire cyan
        }

        const { ox, oy, oz } = getScatterOrigin();
        particles.push({
          tx,
          ty,
          tz,
          x: ox,
          y: oy,
          z: oz,
          ox,
          oy,
          oz,
          baseSize: 1.0 + Math.random() * 0.6,
          color: col,
          alpha: 0.65 + Math.random() * 0.3,
          delay: 0.45 + arcV * 0.4 + Math.random() * 0.2,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 1.2 + Math.random() * 1.8,
        });
      }
    }

    // 4. AMBIENT SPARKLE PARTICLE DUST (Surrounding the head and shoulder crown)
    const dustCount = 800;
    for (let d = 0; d < dustCount; d++) {
      const angle = Math.random() * Math.PI * 2;
      const isHeadCrown = Math.random() > 0.4;

      let tx = 0;
      let ty = 0;
      let tz = (Math.random() - 0.5) * 0.6;

      if (isHeadCrown) {
        // Head crown dust
        const r = 0.55 + Math.random() * 0.4;
        tx = Math.cos(angle) * r;
        ty = 0.5 + Math.sin(angle) * r + 0.3;
      } else {
        // Shoulder crown dust
        const side = Math.random() > 0.5 ? 1 : -1;
        tx = side * (0.8 + Math.random() * 1.2);
        ty = -0.8 - Math.random() * 0.6;
      }

      const { ox, oy, oz } = getScatterOrigin();
      particles.push({
        tx,
        ty,
        tz,
        x: ox,
        y: oy,
        z: oz,
        ox,
        oy,
        oz,
        baseSize: 0.7 + Math.random() * 0.6,
        color: [0, 230, 255],
        alpha: 0.3 + Math.random() * 0.5,
        delay: 0.2 + Math.random() * 0.6,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 2.5 + Math.random() * 3.0,
        isDust: true,
      });
    }

    // ================= ANIMATION RENDER LOOP =================
    let animationFrameId: number;
    let startTime = performance.now();
    let currentProgress = 0;

    const render = () => {
      const now = performance.now();
      const elapsed = (now - startTime) * 0.001;

      // Smooth assembly progress (0 -> 1 over 2.4s)
      if (currentProgress < 1.0) {
        currentProgress = Math.min(1.0, elapsed / 2.2);
        const displayPercent = Math.min(99, Math.floor(currentProgress * 100));
        setAssemblyPercent(displayPercent);
        if (currentProgress >= 1.0) {
          setIsOnline(true);
        }
      }

      // Smooth 3D parallax mouse tilt
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Scale factor to fit humanoid robot comfortably in canvas
      const scale = Math.min(width, height) * 0.52;
      const centerX = width * 0.5;
      const centerY = height * 0.56;

      // 3D rotation angles
      const rotY = mouse.x * 0.18;
      const rotX = -mouse.y * 0.10;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Sort particles by depth (Z-buffer painter's algorithm)
      const transformedParticles = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Assembly interpolation with cubic ease-out
        const localProgress = Math.max(0.0, Math.min(1.0, (currentProgress - p.delay * 0.35) / 0.65));
        const easeP = 1.0 - Math.pow(1.0 - localProgress, 3.0);

        let px = p.ox + (p.tx - p.ox) * easeP;
        let py = p.oy + (p.ty - p.oy) * easeP;
        let pz = p.oz + (p.tz - p.oz) * easeP;

        // Subtle neural breathing pulse when assembled
        if (easeP > 0.95) {
          const breath = Math.sin(elapsed * 2.0 + py * 4.0) * 0.006;
          pz += breath;
          if (p.isDust) {
            px += Math.sin(elapsed * p.pulseSpeed + p.pulsePhase) * 0.015;
            py += Math.cos(elapsed * p.pulseSpeed + p.pulsePhase) * 0.015;
          }
        }

        // Apply 3D Rotation (Y-axis and X-axis)
        // Rotate around Y
        const x1 = px * cosY + pz * sinY;
        const z1 = -px * sinY + pz * cosY;

        // Rotate around X
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        // Perspective Projection
        const fovDistance = 3.8;
        const perspective = fovDistance / (fovDistance + z2);

        const screenX = centerX + x1 * scale * perspective;
        const screenY = centerY - y2 * scale * perspective;

        // Twinkle & alpha
        const twinkle = 0.75 + 0.25 * Math.sin(elapsed * p.pulseSpeed + p.pulsePhase);
        const finalAlpha = Math.min(1.0, p.alpha * twinkle * easeP);
        const finalSize = Math.max(0.5, p.baseSize * perspective * (0.85 + 0.15 * twinkle));

        if (finalAlpha > 0.02) {
          transformedParticles.push({
            sx: screenX,
            sy: screenY,
            z: z2,
            size: finalSize,
            color: p.color,
            alpha: finalAlpha,
          });
        }
      }

      // Sort back-to-front
      transformedParticles.sort((a, b) => b.z - a.z);

      // Draw glowing points with crisp laser aesthetic
      for (let i = 0; i < transformedParticles.length; i++) {
        const pt = transformedParticles[i];
        const [r, g, b] = pt.color;

        // Soft outer glow
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, pt.size * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${pt.alpha * 0.35})`;
        ctx.fill();

        // Crisp luminous core dot
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, pt.size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.min(255, r + 60)}, ${Math.min(255, g + 60)}, ${Math.min(255, b + 60)}, ${pt.alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none ${className}`}
    >
      {/* Crisp 2D/3D Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block transform-gpu will-change-transform"
      />

      {/* Cyber Telemetry HUD Label matching monitor screenshot */}
      <div className="absolute right-6 sm:right-12 lg:right-24 top-1/2 -translate-y-1/2 pointer-events-none select-none z-20">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-black/50 border border-[#00e5ff]/35 backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.25)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-ping" />
          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-[#00e5ff] uppercase">
            {isOnline ? 'ASSEMBLING... 99%' : `ASSEMBLING... ${assemblyPercent}%`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default HumanoidCyborgScene;
