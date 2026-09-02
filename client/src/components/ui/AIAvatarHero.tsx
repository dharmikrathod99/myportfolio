'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface AIAvatarHeroProps {
  className?: string;
  showStatusLabel?: boolean;
  onAssemblyComplete?: () => void;
  audioAmplitude?: number;
}

interface Particle {
  // Current 3D position
  x: number;
  y: number;
  z: number;
  // Target 3D coordinate (DK shape)
  tx: number;
  ty: number;
  tz: number;
  // Initial scatter origin
  ox: number;
  oy: number;
  oz: number;
  // Physics properties
  vx: number;
  vy: number;
  vz: number;
  mass: number;
  damping: number;
  delay: number;
  noiseSeedX: number;
  noiseSeedY: number;
  // Visual attributes
  baseSize: number;
  color: [number, number, number];
  alpha: number;
  systemType: 'SILHOUETTE' | 'SCAN_LINE' | 'GOLD_CORE' | 'NERVE' | 'SHOULDER' | 'AMBIENT';
  waveDist?: number;
  wavePhase?: number;
}

export function AIAvatarHero({
  className = '',
  showStatusLabel = true,
  onAssemblyComplete,
  audioAmplitude = 0,
}: AIAvatarHeroProps) {
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

    // Mouse parallax tracking
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

    // ================= 1. GENERATE DK TARGET POINT CLOUD (~14,000 points) =================
    const particles: Particle[] = [];

    const getScatterOrigin = () => {
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const dist = 4.0 + Math.random() * 6.5;
      return {
        ox: Math.cos(theta) * Math.cos(phi) * dist,
        oy: Math.sin(phi) * dist + 0.2,
        oz: Math.sin(theta) * Math.cos(phi) * dist,
      };
    };

    const addParticle = (
      tx: number,
      ty: number,
      tz: number,
      color: [number, number, number],
      baseSize: number,
      alpha: number,
      delay: number,
      systemType: 'SILHOUETTE' | 'SCAN_LINE' | 'GOLD_CORE' | 'NERVE' | 'SHOULDER' | 'AMBIENT',
      extra?: { waveDist?: number; wavePhase?: number }
    ) => {
      const { ox, oy, oz } = getScatterOrigin();
      particles.push({
        x: ox,
        y: oy,
        z: oz,
        tx,
        ty,
        tz,
        ox,
        oy,
        oz,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        vz: (Math.random() - 0.5) * 0.02,
        mass: 0.85 + Math.random() * 0.4,
        damping: 0.88 + Math.random() * 0.04,
        delay,
        noiseSeedX: Math.random() * 100,
        noiseSeedY: Math.random() * 100,
        baseSize,
        color,
        alpha,
        systemType,
        waveDist: extra?.waveDist,
        wavePhase: extra?.wavePhase,
      });
    };

    // SYSTEM 1 & 2: HEAD MERIDIANS & HORIZONTAL SCAN RINGS (48 latitude rings + 32 meridians)
    const headLines = 50;
    for (let l = 0; l < headLines; l++) {
      const v = l / (headLines - 1); // 0 (chin) to 1 (crown)
      const baseTy = 0.05 + v * 1.34;

      let rx = 0;
      if (v < 0.20) {
        rx = 0.17 + v * 1.45;
      } else if (v < 0.62) {
        rx = 0.46 + Math.sin((v - 0.20) * Math.PI) * 0.06;
      } else {
        const domeV = (v - 0.62) / 0.38;
        rx = Math.sqrt(Math.max(0.0, 1.0 - domeV * domeV)) * 0.50;
      }

      const rz = rx * 0.94;
      const ptsInLine = Math.floor(48 + rx * 115);

      for (let p = 0; p < ptsInLine; p++) {
        const u = p / (ptsInLine - 1);
        const theta = Math.PI * (1.0 - u);

        let tx = Math.cos(theta) * rx;
        let tz = Math.sin(theta) * rz;
        let ty = baseTy;

        // Ear loops on temple sides
        const isEarZone = v > 0.34 && v < 0.50 && Math.abs(tx) > rx * 0.86;
        if (isEarZone) {
          const earFlare = Math.sin(((v - 0.34) / 0.16) * Math.PI) * 0.075;
          tx += (tx > 0 ? 1 : -1) * earFlare;
          tz -= earFlare * 0.4;
        }

        // Face Center Zone (Gold AI Core Waveform)
        const inFaceCore = v > 0.24 && v < 0.72 && Math.abs(tx) < 0.36;
        const isRim = Math.abs(tx) > rx * 0.86 || v > 0.92;

        let col: [number, number, number] = [86, 174, 235]; // Primary Blue #56AEEB
        let size = 1.05;
        let alpha = 0.8;
        let delay = 0.08 + (1.0 - v) * 0.35;
        let systemType: 'SILHOUETTE' | 'SCAN_LINE' | 'GOLD_CORE' = 'SCAN_LINE';

        if (inFaceCore) {
          systemType = 'GOLD_CORE';
          const distFromCore = Math.sqrt(tx * tx * 1.2 + (ty - 0.68) * (ty - 0.68) * 2.2);

          if (distFromCore < 0.28) {
            // Radiant core gold (#FFF2A8 / #FFD54F)
            const coreMix = 1.0 - distFromCore / 0.28;
            col = [
              255,
              Math.round(185 + 70 * coreMix),
              Math.round(40 + 140 * coreMix),
            ];
            size = 1.45;
            alpha = 0.98;
          } else {
            // Golden orange transition
            const transMix = (0.46 - distFromCore) / 0.18;
            col = [
              Math.round(86 + 169 * transMix),
              Math.round(174 + 30 * transMix),
              Math.round(235 - 170 * transMix),
            ];
            size = 1.25;
            alpha = 0.9;
          }
          delay = 0.45 + (1.0 - v) * 0.2; // Gold activates after structure
        } else if (isRim) {
          systemType = 'SILHOUETTE';
          col = [138, 228, 250]; // Bright Cyan #8AE4FA
          size = 1.3;
          alpha = 0.95;
        }

        addParticle(tx, ty, tz, col, size, alpha, delay, systemType, {
          waveDist: tx,
          wavePhase: l * 0.3,
        });
      }
    }

    // SYSTEM 3: NECK FIBERS & BRANCHING LIGHTNING NERVE TRUNK
    const neckStreams = 34;
    for (let n = 0; n < neckStreams; n++) {
      const streamT = n / (neckStreams - 1);
      const nx = (streamT - 0.5) * 2.0;
      const pts = 28;

      for (let p = 0; p < pts; p++) {
        const sv = p / (pts - 1);
        const ty = 0.05 - sv * 0.46;
        const width = 0.16 + sv * 0.16;

        const tx = nx * width;
        const tz = Math.sqrt(Math.max(0.01, 1.0 - nx * nx)) * 0.18;

        addParticle(
          tx,
          ty,
          tz,
          [86, 174, 235],
          1.1,
          0.78,
          0.28 + sv * 0.3,
          'SCAN_LINE'
        );
      }
    }

    // Golden Branching Lightning Nerve Trunk
    const nerveForks = [
      { startV: 0.0, endV: 1.0, xOffset: 0.0 },
      { startV: 0.38, endV: 1.0, xOffset: -0.065 },
      { startV: 0.42, endV: 1.0, xOffset: 0.07 },
      { startV: 0.62, endV: 1.0, xOffset: -0.12 },
      { startV: 0.65, endV: 1.0, xOffset: 0.125 },
    ];

    nerveForks.forEach((fork) => {
      const pts = 32;
      for (let p = 0; p < pts; p++) {
        const prog = p / (pts - 1);
        const v = fork.startV + prog * (fork.endV - fork.startV);
        const ty = 0.05 - v * 0.50;

        const zigZag = Math.sin(prog * Math.PI * 4.5) * 0.012;
        const tx = prog * fork.xOffset + zigZag;
        const tz = 0.20 - v * 0.03;

        const isSternumCore = v > 0.85 && Math.abs(tx) < 0.03;
        const col: [number, number, number] = isSternumCore
          ? [255, 245, 180] // Bright sternum flare
          : [255, 175 + Math.floor(Math.random() * 45), 20]; // Radiant gold

        addParticle(
          tx,
          ty,
          tz,
          col,
          isSternumCore ? 1.8 : 1.35,
          0.98,
          0.50 + v * 0.3,
          'NERVE'
        );
      }
    });

    // SYSTEM 4: SHOULDERS & CHEST CONCENTRIC FIBER ARCS
    const shoulderArcs = 62;
    for (let sa = 0; sa < shoulderArcs; sa++) {
      const arcV = sa / (shoulderArcs - 1);
      const pts = 95;
      const spanWidth = 0.34 + arcV * 2.05;

      for (let p = 0; p < pts; p++) {
        const u = p / (pts - 1);
        const t = (u - 0.5) * 2.0;
        const absT = Math.abs(t);

        const tx = t * spanWidth;
        const ty = -0.38 - arcV * 0.68 - (absT * absT) * (0.34 + arcV * 0.48);
        const tz = 0.14 - (absT * absT) * 0.2 - arcV * 0.2;

        let col: [number, number, number] = [86, 174, 235];
        let size = 1.1;
        let systemType: 'SHOULDER' | 'SILHOUETTE' = 'SHOULDER';

        if (absT > 0.65) {
          col = [138, 228, 250]; // Luminous shoulder rim edge
          size = 1.35;
          systemType = 'SILHOUETTE';
        } else if (absT < 0.12 && arcV < 0.3) {
          col = [255, 180, 30]; // Clavicle gold
          size = 1.35;
        } else if (absT > 0.4) {
          col = [67, 129, 183]; // Deep sapphire body
        }

        addParticle(
          tx,
          ty,
          tz,
          col,
          size,
          Math.max(0.3, 0.9 - arcV * 0.35),
          0.38 + arcV * 0.4,
          systemType
        );
      }
    }

    // SYSTEM 5: AMBIENT BOKEH PARTICLES & RADIANT SILHOUETTE SPRAY
    const totalDust = 2400;
    for (let d = 0; d < totalDust; d++) {
      const isSilhouette = Math.random() < 0.68;
      let tx = 0;
      let ty = 0;
      let tz = (Math.random() - 0.5) * 1.0;

      if (isSilhouette) {
        // High density halo around head & shoulders
        const zone = Math.random();
        if (zone < 0.48) {
          const angle = Math.random() * Math.PI * 2;
          const r = 0.46 + Math.random() * 0.38;
          tx = Math.cos(angle) * r;
          ty = 0.72 + Math.sin(angle) * r;
        } else {
          const side = Math.random() > 0.5 ? 1 : -1;
          tx = side * (0.65 + Math.random() * 1.45);
          ty = -0.45 - Math.random() * 0.75;
        }
      } else {
        tx = (Math.random() - 0.5) * 4.6;
        ty = (Math.random() - 0.5) * 3.2;
      }

      const isGold = Math.random() < 0.08;
      const col: [number, number, number] = isGold
        ? [255, 195, 60]
        : Math.random() > 0.4
        ? [138, 228, 250]
        : [86, 174, 235];

      addParticle(
        tx,
        ty,
        tz,
        col,
        0.75 + Math.random() * 1.1,
        0.3 + Math.random() * 0.65,
        0.05 + Math.random() * 0.5,
        'AMBIENT'
      );
    }

    // ================= 2. PHYSICS ENGINE & RENDER LOOP =================
    let animId: number;
    let startTime = performance.now();
    let lastTime = performance.now();
    let globalAssemblyProg = 0;
    let hasTriggeredComplete = false;
    let pulseWave = 0;

    const render = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) * 0.001, 0.05);
      const elapsed = (now - startTime) * 0.001;
      lastTime = now;

      // Animate staged assembly phase (0 -> 1 over 2.6s)
      if (globalAssemblyProg < 1.0) {
        globalAssemblyProg = Math.min(1.0, elapsed / 2.4);
      }

      // Mouse parallax lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Centered coordinate system
      const centerX = width * 0.5;
      const centerY = height * 0.48;
      const scale = Math.min(width, height) * 0.44;

      // Atmospheric Background Glow
      const backdropGlow = ctx.createRadialGradient(
        centerX,
        centerY - scale * 0.15,
        0,
        centerX,
        centerY - scale * 0.15,
        scale * 1.5
      );
      backdropGlow.addColorStop(0, 'rgba(0, 210, 255, 0.14)');
      backdropGlow.addColorStop(0.35, 'rgba(86, 174, 235, 0.06)');
      backdropGlow.addColorStop(0.75, 'rgba(15, 20, 34, 0)');
      ctx.fillStyle = backdropGlow;
      ctx.fillRect(0, 0, width, height);

      // 3D rotation angles
      const rotY = mouse.x * 0.16 + Math.sin(elapsed * 0.15) * 0.035;
      const rotX = -mouse.y * 0.10;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const fov = 3.6;

      // Update Particle Physics & Calculate Real Convergence
      let convergedCount = 0;
      const renderList = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Particle activation progress based on individual staggered delay
        const pProgress = Math.max(0.0, Math.min(1.0, (globalAssemblyProg - p.delay * 0.3) / 0.7));

        let tx = p.tx;
        let ty = p.ty;
        let tz = p.tz;

        // Wave displacement on Face Core
        if (p.systemType === 'GOLD_CORE' && p.waveDist !== undefined) {
          const envelope = Math.exp(-(p.waveDist * p.waveDist) * 3.8);
          ty += Math.sin(p.waveDist * 14.0 - elapsed * 3.2 + (p.wavePhase || 0)) * 0.024 * envelope;

          // React to speech audio amplitude
          if (audioAmplitude > 0) {
            ty += (Math.random() - 0.5) * audioAmplitude * 0.04;
            tx += (Math.random() - 0.5) * audioAmplitude * 0.03;
          }
        }

        // Distance vector
        const dx = tx - p.x;
        const dy = ty - p.y;
        const dz = tz - p.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 0.14) {
          convergedCount++;
        }

        // Attraction Force & Velocity Physics
        if (pProgress > 0.01) {
          const attraction = 6.2 * pProgress;
          const fx = (dx / (dist + 0.001)) * Math.min(dist, 1.8) * attraction;
          const fy = (dy / (dist + 0.001)) * Math.min(dist, 1.8) * attraction;
          const fz = (dz / (dist + 0.001)) * Math.min(dist, 1.8) * attraction;

          // Simplex turbulence
          const turb = (1.0 - Math.min(1.0, pProgress * 1.3)) * 0.15;
          const noiseX = Math.sin(elapsed * 2.5 + p.noiseSeedX) * turb;
          const noiseY = Math.cos(elapsed * 2.5 + p.noiseSeedY) * turb;

          // Energy pulse expansion on 100% assembly
          let pulseX = 0;
          let pulseY = 0;
          let pulseZ = 0;
          if (pulseWave > 0) {
            const expandDir = Math.sqrt(tx * tx + ty * ty + tz * tz) || 1.0;
            pulseX = (tx / expandDir) * pulseWave * 0.2;
            pulseY = (ty / expandDir) * pulseWave * 0.2;
            pulseZ = (tz / expandDir) * pulseWave * 0.2;
          }

          // Living breathing idle
          let breathZ = 0;
          if (pProgress >= 0.98) {
            breathZ = Math.sin(elapsed * 2.0 + p.ty * 3.5) * 0.006;
          }

          p.vx = (p.vx + (fx + noiseX + pulseX) * dt / p.mass) * p.damping;
          p.vy = (p.vy + (fy + noiseY + pulseY) * dt / p.mass) * p.damping;
          p.vz = (p.vz + (fz + breathZ + pulseZ) * dt / p.mass) * p.damping;

          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
        } else {
          // Ambient floating before assembly
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
        }

        // Apply 3D Rotation
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Perspective Projection
        const perspective = fov / (fov + z2);
        const screenX = centerX + x1 * scale * perspective;
        const screenY = centerY - y2 * scale * perspective;

        const voiceBoost = audioAmplitude * (p.systemType === 'GOLD_CORE' ? 1.5 : 0.4);
        const finalSize = Math.max(0.6, p.baseSize * (1.0 + voiceBoost) * perspective);

        renderList.push({
          sx: screenX,
          sy: screenY,
          z: z2,
          size: finalSize,
          color: p.color,
          alpha: p.alpha * Math.min(1.0, pProgress * 1.5),
          systemType: p.systemType,
        });
      }

      // Real Percentage Calculation
      const realPercent = Math.min(100, Math.floor((convergedCount / particles.length) * 100));
      setAssemblyPercent(realPercent);

      if (realPercent >= 99 && !hasTriggeredComplete) {
        hasTriggeredComplete = true;
        setIsOnline(true);
        pulseWave = 1.0;
        if (onAssemblyComplete) onAssemblyComplete();
      }

      if (pulseWave > 0) {
        pulseWave = Math.max(0, pulseWave - dt * 1.5);
      }

      // Sort back-to-front
      renderList.sort((a, b) => b.z - a.z);

      // Render glowing points with dual-pass radial bloom
      for (let i = 0; i < renderList.length; i++) {
        const pt = renderList[i];
        const [r, g, b] = pt.color;

        // Soft outer glowing bloom halo
        const haloMultiplier = pt.systemType === 'GOLD_CORE' ? 2.6 : pt.systemType === 'SILHOUETTE' ? 2.3 : pt.systemType === 'NERVE' ? 2.5 : 1.8;
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, pt.size * haloMultiplier, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${pt.alpha * 0.38})`;
        ctx.fill();

        // Crisp inner core bead
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, pt.size * 0.85, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.min(255, r + 70)}, ${Math.min(255, g + 70)}, ${Math.min(255, b + 70)}, ${pt.alpha})`;
        ctx.fill();
      }

      // Render Glowing Sternum Energy Flare at (0, -0.45, 0.20)
      const sternumX = centerX + (sinY * 0.20) * scale * (fov / (fov + cosY * 0.20));
      const sternumY = centerY - (-0.45 * cosX - 0.20 * sinX) * scale * (fov / (fov + cosY * 0.20));
      const flarePulse = 1.0 + Math.sin(elapsed * 4.0) * 0.18 + audioAmplitude * 0.5;

      const flareGrad = ctx.createRadialGradient(
        sternumX,
        sternumY,
        0,
        sternumX,
        sternumY,
        scale * 0.14 * flarePulse
      );
      flareGrad.addColorStop(0, 'rgba(255, 245, 180, 0.95)');
      flareGrad.addColorStop(0.3, 'rgba(255, 179, 0, 0.65)');
      flareGrad.addColorStop(0.7, 'rgba(221, 168, 86, 0.2)');
      flareGrad.addColorStop(1, 'rgba(221, 168, 86, 0)');

      ctx.fillStyle = flareGrad;
      ctx.beginPath();
      ctx.arc(sternumX, sternumY, scale * 0.14 * flarePulse, 0, Math.PI * 2);
      ctx.fill();

      // Render Radiant Face Core Flare at (0, 0.68, 0.42)
      const faceX = centerX + (sinY * 0.42) * scale * (fov / (fov + cosY * 0.42));
      const faceY = centerY - (0.68 * cosX - 0.42 * sinX) * scale * (fov / (fov + cosY * 0.42));
      const facePulse = 1.0 + Math.sin(elapsed * 3.0) * 0.12 + audioAmplitude * 0.6;

      const faceGrad = ctx.createRadialGradient(
        faceX,
        faceY,
        0,
        faceX,
        faceY,
        scale * 0.24 * facePulse
      );
      faceGrad.addColorStop(0, 'rgba(255, 235, 140, 0.9)');
      faceGrad.addColorStop(0.35, 'rgba(255, 160, 0, 0.55)');
      faceGrad.addColorStop(0.7, 'rgba(255, 109, 0, 0.18)');
      faceGrad.addColorStop(1, 'rgba(255, 109, 0, 0)');

      ctx.fillStyle = faceGrad;
      ctx.beginPath();
      ctx.arc(faceX, faceY, scale * 0.24 * facePulse, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [audioAmplitude]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none pointer-events-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block transform-gpu will-change-transform"
      />

      {/* Cyber Telemetry Status HUD matching reference */}
      {showStatusLabel && (
        <div className="absolute right-6 sm:right-12 lg:right-20 top-1/2 -translate-y-1/2 pointer-events-none select-none z-20">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-black/50 border border-[#00e5ff]/35 backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-ping" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-[#00e5ff] uppercase">
              {isOnline ? 'DK ONLINE' : `ASSEMBLING... ${assemblyPercent}%`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIAvatarHero;
