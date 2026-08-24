'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface HexagonBackgroundProps {
  className?: string;
  glowColor?: string;
  hexagonSize?: number;
}

export function HexagonBackground({
  className = '',
  glowColor = '#0088CC',
  hexagonSize = 36,
}: HexagonBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number | null = null;
    let isRunning = false;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Offscreen cached background grid
    let offscreenCanvas: HTMLCanvasElement | null = null;
    let offscreenCtx: CanvasRenderingContext2D | null = null;

    const mouse = {
      x: -2000,
      y: -2000,
      targetX: -2000,
      targetY: -2000,
      active: false,
    };

    const R = hexagonSize;
    const h = Math.sqrt(3) * R;
    const xSpan = 1.5 * R;
    const ySpan = h;
    const hoverRadius = 220;
    const hoverRadiusSq = hoverRadius * hoverRadius;

    // Draw single hexagon path
    const drawHexPath = (targetCtx: CanvasRenderingContext2D, cx: number, cy: number) => {
      targetCtx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = cx + R * Math.cos(angle);
        const y = cy + R * Math.sin(angle);
        if (i === 0) targetCtx.moveTo(x, y);
        else targetCtx.lineTo(x, y);
      }
      targetCtx.closePath();
    };

    // Pre-render static hexagon grid to offscreen canvas
    const buildOffscreenGrid = () => {
      if (!offscreenCanvas) {
        offscreenCanvas = document.createElement('canvas');
      }
      offscreenCanvas.width = width * dpr;
      offscreenCanvas.height = height * dpr;
      offscreenCtx = offscreenCanvas.getContext('2d', { alpha: true });
      if (!offscreenCtx) return;

      offscreenCtx.scale(dpr, dpr);
      offscreenCtx.clearRect(0, 0, width, height);

      const isDark = theme !== 'light';
      const gridStroke = isDark ? 'rgba(255, 255, 255, 0.035)' : 'rgba(0, 0, 0, 0.045)';

      const cols = Math.ceil(width / xSpan) + 2;
      const rows = Math.ceil(height / ySpan) + 2;

      offscreenCtx.beginPath();
      offscreenCtx.strokeStyle = gridStroke;
      offscreenCtx.lineWidth = 1;

      for (let col = -1; col < cols; col++) {
        const cx = col * xSpan;
        const yOffset = Math.abs(col) % 2 === 1 ? h / 2 : 0;

        for (let row = -1; row < rows; row++) {
          const cy = row * ySpan + yOffset;
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = cx + R * Math.cos(angle);
            const y = cy + R * Math.sin(angle);
            if (i === 0) offscreenCtx.moveTo(x, y);
            else offscreenCtx.lineTo(x, y);
          }
        }
      }
      offscreenCtx.stroke();
    };

    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      buildOffscreenGrid();
      startRender();
    };

    const render = () => {
      const dx = mouse.targetX - mouse.x;
      const dy = mouse.targetY - mouse.y;
      const distToTarget = Math.sqrt(dx * dx + dy * dy);

      // Smooth mouse interpolation
      mouse.x += dx * 0.18;
      mouse.y += dy * 0.18;

      ctx.clearRect(0, 0, width, height);

      // 1. Blit cached base grid instantly (0 computation)
      if (offscreenCanvas) {
        ctx.drawImage(offscreenCanvas, 0, 0, width, height);
      }

      const mx = mouse.x;
      const my = mouse.y;
      const isDark = theme !== 'light';

      // 2. Only compute glow if mouse is in active view
      if (mouse.active && mx > -hoverRadius && mx < width + hoverRadius && my > -hoverRadius && my < height + hoverRadius) {
        const startCol = Math.max(-1, Math.floor((mx - hoverRadius) / xSpan));
        const endCol = Math.min(Math.ceil(width / xSpan) + 1, Math.ceil((mx + hoverRadius) / xSpan));
        const startRow = Math.max(-1, Math.floor((my - hoverRadius) / ySpan));
        const endRow = Math.min(Math.ceil(height / ySpan) + 1, Math.ceil((my + hoverRadius) / ySpan));

        for (let col = startCol; col <= endCol; col++) {
          const cx = col * xSpan;
          const yOffset = Math.abs(col) % 2 === 1 ? h / 2 : 0;

          for (let row = startRow; row <= endRow; row++) {
            const cy = row * ySpan + yOffset;
            const distSq = (cx - mx) * (cx - mx) + (cy - my) * (cy - my);

            if (distSq < hoverRadiusSq) {
              const dist = Math.sqrt(distSq);
              const factor = Math.pow(1 - dist / hoverRadius, 2);

              drawHexPath(ctx, cx, cy);
              ctx.fillStyle = isDark
                ? `rgba(0, 136, 204, ${0.16 * factor})`
                : `rgba(0, 136, 204, ${0.1 * factor})`;
              ctx.fill();

              ctx.strokeStyle = glowColor;
              ctx.globalAlpha = factor * 0.6;
              ctx.lineWidth = 1.2;
              ctx.stroke();
              ctx.globalAlpha = 1.0;
            }
          }
        }

        // Mouse radial glow
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, hoverRadius);
        grad.addColorStop(0, `${glowColor}25`);
        grad.addColorStop(0.5, `${glowColor}0A`);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mx, my, hoverRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // If mouse is inactive or converged to settled target and settled, we can pause RAF loop to save 100% idle CPU
      if (!mouse.active && distToTarget < 0.5) {
        isRunning = false;
        animId = null;
        return;
      }

      animId = requestAnimationFrame(render);
    };

    const startRender = () => {
      if (!isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(render);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
      startRender();
    };

    const handleMouseLeave = () => {
      mouse.targetX = -2000;
      mouse.targetY = -2000;
      mouse.active = false;
      startRender();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    handleResize();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);
      offscreenCanvas = null;
      offscreenCtx = null;
    };
  }, [glowColor, hexagonSize, theme]);

  return (
    <div className={cn('fixed inset-0 pointer-events-none z-0 overflow-hidden', className)}>
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
    </div>
  );
}

export default HexagonBackground;
