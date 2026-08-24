'use client';

import React, { useEffect, useRef } from 'react';

export default function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? '#FFFFFF' : '#888888',
    }));

    let step = 0;

    const render = () => {
      step += 0.008;
      // Smooth mouse inertia
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.fillStyle = 'rgba(5, 5, 5, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Aurora 1 (Primary Matte Dark Black Glow)
      const g1 = ctx.createRadialGradient(
        width * 0.2 + Math.sin(step) * 100,
        height * 0.3 + Math.cos(step * 0.7) * 80,
        10,
        width * 0.2 + Math.sin(step) * 100,
        height * 0.3 + Math.cos(step * 0.7) * 80,
        width * 0.45
      );
      g1.addColorStop(0, 'rgba(20, 20, 20, 0.6)');
      g1.addColorStop(0.5, 'rgba(12, 12, 12, 0.2)');
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      // Aurora 2 (Accent Platinum White Glow)
      const g2 = ctx.createRadialGradient(
        width * 0.8 + Math.cos(step * 0.8) * 120,
        height * 0.7 + Math.sin(step * 1.2) * 90,
        10,
        width * 0.8 + Math.cos(step * 0.8) * 120,
        height * 0.7 + Math.sin(step * 1.2) * 90,
        width * 0.4
      );
      g2.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      g2.addColorStop(0.6, 'rgba(255, 255, 255, 0.02)');
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      // Mouse interactive glow
      const mouseGlow = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        280
      );
      mouseGlow.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
      mouseGlow.addColorStop(0.5, 'rgba(200, 200, 200, 0.04)');
      mouseGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = mouseGlow;
      ctx.fillRect(0, 0, width, height);

      // Draw & update floating particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}
