'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

export interface StarBurstProps {
  radialDensity?: number;
  starCount?: number;
  color?: string;
  secondaryColor?: string;
  centerX?: number;
  centerY?: number;
  starSize?: number;
  brightness?: number;
  opacity?: number;
  flowerIntensity?: number;
  twinkleSpeed?: number;
  wobbleAmount?: number;
  innerLayerIntensity?: number;
  outerLayerIntensity?: number;
  fadeHeight?: number;
  speed?: number;
  interactive?: boolean;
  className?: string;
}

interface Particle {
  angle: number;
  distance: number;
  baseDistance: number;
  speed: number;
  size: number;
  alpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
  wobbleSpeed: number;
  wobbleOffset: number;
  layer: 'inner' | 'mid' | 'outer';
  color: string;
  trailLength: number;
}

export function StarBurst({
  radialDensity = 0.5,
  starCount = 130,
  color = '#3A86FF',
  secondaryColor = '#38BDF8',
  centerX = 0.5,
  centerY = 0.5,
  starSize = 0.45,
  brightness = 1.0,
  opacity = 0.9,
  flowerIntensity = 0.6,
  twinkleSpeed = 0.3,
  wobbleAmount = 1.0,
  innerLayerIntensity = 1.0,
  outerLayerIntensity = 1.5,
  fadeHeight = 2.5,
  speed = 0.6,
  interactive = true,
  className = '',
}: StarBurstProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number; isHovered: boolean }>({
    x: centerX,
    y: centerY,
    targetX: centerX,
    targetY: centerY,
    isHovered: false,
  });
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = container.offsetWidth || window.innerWidth);
    let height = (canvas.height = container.offsetHeight || window.innerHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Color palette resolution
    const primaryHex = color;
    const accentHex = secondaryColor;

    // Generate Particles
    const particles: Particle[] = [];

    for (let i = 0; i < starCount; i++) {
      const angle = (i / starCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
      const layerRand = Math.random();
      const layer: 'inner' | 'mid' | 'outer' = layerRand < 0.35 ? 'inner' : layerRand < 0.75 ? 'mid' : 'outer';
      
      const maxDist = Math.max(width, height) * 0.85;
      const distPercent = Math.pow(Math.random(), 1.0 / (radialDensity * 1.6 + 0.2));
      const baseDistance = distPercent * maxDist;

      particles.push({
        angle,
        distance: baseDistance,
        baseDistance,
        speed: (0.4 + Math.random() * 0.8) * speed,
        size: (1.2 + Math.random() * 2.8) * starSize,
        alpha: 0.2 + Math.random() * 0.8,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: (0.5 + Math.random() * 1.5) * twinkleSpeed,
        wobbleSpeed: (0.4 + Math.random() * 1.2),
        wobbleOffset: Math.random() * Math.PI * 2,
        layer,
        color: Math.random() > 0.35 ? primaryHex : accentHex,
        trailLength: 4 + Math.random() * 14,
      });
    }

    const handleResize = () => {
      if (!container || !canvas) return;
      width = container.offsetWidth || window.innerWidth;
      height = container.offsetHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = (e.clientX - rect.left) / width;
      mouseRef.current.targetY = (e.clientY - rect.top) / height;
      mouseRef.current.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = centerX;
      mouseRef.current.targetY = centerY;
      mouseRef.current.isHovered = false;
    };

    window.addEventListener('resize', handleResize);
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseleave', handleMouseLeave);
    }

    let time = 0;

    const render = () => {
      time += 0.016;

      // Smooth focal center interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const originX = width * mouseRef.current.x;
      const originY = height * mouseRef.current.y;
      const maxRadius = Math.max(width, height) * 0.95;

      ctx.clearRect(0, 0, width, height);

      // 1. Central Starburst Bloom Flare (Flower Flare)
      if (flowerIntensity > 0.05) {
        const coreGradient = ctx.createRadialGradient(
          originX,
          originY,
          0,
          originX,
          originY,
          Math.min(width, height) * 0.45
        );

        const coreAlpha = (isLight ? 0.12 : 0.22) * flowerIntensity * opacity * brightness;
        coreGradient.addColorStop(0, `rgba(58, 134, 255, ${coreAlpha * 1.8})`);
        coreGradient.addColorStop(0.2, `rgba(56, 189, 248, ${coreAlpha * 1.2})`);
        coreGradient.addColorStop(0.5, `rgba(255, 41, 155, ${coreAlpha * 0.5})`);
        coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = coreGradient;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Radial Ray Spokes & Shimmer
      const spokeCount = Math.min(starCount, 32);
      ctx.save();
      for (let s = 0; s < spokeCount; s++) {
        const spokeAngle = (s / spokeCount) * Math.PI * 2 + Math.sin(time * 0.4 + s) * 0.04 * wobbleAmount;
        const rayLength = maxRadius * (0.5 + 0.3 * Math.sin(time * 0.8 + s * 1.5));
        const endX = originX + Math.cos(spokeAngle) * rayLength;
        const endY = originY + Math.sin(spokeAngle) * rayLength;

        const rayGrad = ctx.createLinearGradient(originX, originY, endX, endY);
        const rayAlpha = (isLight ? 0.04 : 0.07) * opacity * brightness * (0.6 + 0.4 * Math.sin(time * 2 + s));
        rayGrad.addColorStop(0, `rgba(58, 134, 255, ${rayAlpha * 2})`);
        rayGrad.addColorStop(0.4, `rgba(56, 189, 248, ${rayAlpha})`);
        rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.strokeStyle = rayGrad;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Render Particles with Trails & Twinkle Physics
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Advance distance outward (explosion streaming)
        p.distance += p.speed * (p.layer === 'outer' ? 1.4 : p.layer === 'mid' ? 1.0 : 0.7);
        if (p.distance > maxRadius) {
          p.distance = 5 + Math.random() * 20;
          p.angle = Math.random() * Math.PI * 2;
        }

        // Wobble perturbation
        const wobble = Math.sin(time * p.wobbleSpeed * 3 + p.wobbleOffset) * 0.06 * wobbleAmount;
        const currentAngle = p.angle + wobble;

        // Coordinates
        const px = originX + Math.cos(currentAngle) * p.distance;
        const py = originY + Math.sin(currentAngle) * p.distance;

        // Twinkle calculation
        const twinkle = 0.4 + 0.6 * Math.sin(time * p.twinkleSpeed * 5 + p.twinklePhase);
        let layerMultiplier = p.layer === 'inner' ? innerLayerIntensity : p.layer === 'outer' ? outerLayerIntensity : 1.2;

        // Radial fade off near borders
        const normDist = p.distance / maxRadius;
        const edgeFade = 1.0 - Math.pow(normDist, fadeHeight);
        const finalAlpha = Math.max(0, p.alpha * twinkle * layerMultiplier * edgeFade * opacity * brightness * (isLight ? 0.65 : 1.0));

        if (finalAlpha <= 0.01) continue;

        // Draw particle streak/trail towards center
        const trailDist = p.trailLength * (p.speed / speed) * (1 + normDist * 0.5);
        const trailStartX = px - Math.cos(currentAngle) * trailDist;
        const trailStartY = py - Math.sin(currentAngle) * trailDist;

        ctx.save();
        const streakGrad = ctx.createLinearGradient(trailStartX, trailStartY, px, py);
        streakGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        streakGrad.addColorStop(1, p.color);

        ctx.strokeStyle = streakGrad;
        ctx.globalAlpha = finalAlpha * 0.8;
        ctx.lineWidth = p.size * 0.8;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(trailStartX, trailStartY);
        ctx.lineTo(px, py);
        ctx.stroke();

        // Draw Star Core Glow Point
        ctx.beginPath();
        ctx.arc(px, py, p.size * 1.1, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = Math.min(1.0, finalAlpha * 1.3);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 4;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    radialDensity,
    starCount,
    color,
    secondaryColor,
    centerX,
    centerY,
    starSize,
    brightness,
    opacity,
    flowerIntensity,
    twinkleSpeed,
    wobbleAmount,
    innerLayerIntensity,
    outerLayerIntensity,
    fadeHeight,
    speed,
    interactive,
    isLight,
  ]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-500 ${
        isLight ? 'bg-white' : 'bg-[#05070E]'
      } ${className}`}
    >
      {/* Star Burst Canvas Rendering */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block transform-gpu will-change-transform"
      />

      {/* Atmospheric Vignette Gradients */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isLight
            ? 'bg-radial from-transparent via-white/30 to-white/80'
            : 'bg-radial from-transparent via-[#05070E]/20 to-[#05070E]/90'
        }`}
      />
      
      {/* Bottom Dropoff */}
      <div
        className={`absolute inset-x-0 bottom-0 h-56 pointer-events-none ${
          isLight
            ? 'bg-gradient-to-t from-white via-white/60 to-transparent'
            : 'bg-gradient-to-t from-[#05070E] via-[#05070E]/50 to-transparent'
        }`}
      />
    </div>
  );
}

export default StarBurst;
