'use client';

import React, { memo, forwardRef, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface LiquidMetalProps {
  colorBack?: string;
  colorTint?: string;
  speed?: number;
  repetition?: number;
  distortion?: number;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const LiquidMetal = memo(function LiquidMetal({
  colorBack = '#001F33',
  colorTint = '#3A86FF',
  speed = 0.7,
  repetition = 4,
  distortion = 0.3,
  scale = 1.1,
  className,
  style,
}: LiquidMetalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number | null = null;
    let time = Math.random() * 100;
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 1.5);

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    // Pause RAF when element is off-screen
    const intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      isVisibleRef.current = entry?.isIntersecting ?? false;
      if (isVisibleRef.current && !animId) {
        animId = requestAnimationFrame(render);
      }
    }, { threshold: 0.05 });

    if (canvas.parentElement) intersectionObserver.observe(canvas.parentElement);

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas || !isVisibleRef.current) return;
      const rect = canvas.getBoundingClientRect();
      if (e.clientX >= rect.left - 40 && e.clientX <= rect.right + 40 && e.clientY >= rect.top - 40 && e.clientY <= rect.bottom + 40) {
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        mouseRef.current.targetX = Math.max(0, Math.min(1, x));
        mouseRef.current.targetY = Math.max(0, Math.min(1, y));
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // High-impact chromatic liquid metal fluid simulation
    const render = () => {
      if (!isVisibleRef.current) {
        animId = null;
        return;
      }

      time += 0.018 * speed;

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      // Create glowing liquid metallic gradient
      const angle = time * 0.5 + (mouseRef.current.x - 0.5) * 1.5;
      const cx = w * 0.5 + Math.cos(angle) * w * 0.45;
      const cy = h * 0.5 + Math.sin(angle) * h * 0.45;

      const fluidGrad = ctx.createRadialGradient(
        cx,
        cy,
        4 * dpr,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * scale
      );

      // Liquid chrome brand blue palette
      fluidGrad.addColorStop(0, '#FFFFFF'); // Specular light highlight
      fluidGrad.addColorStop(0.2, '#7DD3FC'); // Vibrant sky light reflection
      fluidGrad.addColorStop(0.45, colorTint); // Bright electric brand blue
      fluidGrad.addColorStop(0.7, '#0369A1'); // Deep metallic blue
      fluidGrad.addColorStop(0.88, '#38BDF8'); // Shimmering bright sky band
      fluidGrad.addColorStop(1, colorBack);

      ctx.fillStyle = fluidGrad;
      ctx.fillRect(0, 0, w, h);

      // Liquid Fluid Ripple Waves
      ctx.save();
      ctx.globalCompositeOperation = 'overlay';

      const numWaves = Math.max(2, Math.min(4, Math.floor(repetition)));
      const segments = 14;
      const dx = w / segments;

      for (let i = 0; i < numWaves; i++) {
        const waveTime = time * (0.85 + i * 0.3);
        const waveDist = distortion * (1 + i * 0.3);

        ctx.beginPath();
        const startY = h * 0.5 + Math.sin(waveTime + i) * h * waveDist;
        ctx.moveTo(0, startY);

        for (let j = 0; j <= segments; j++) {
          const x = j * dx;
          const y =
            h * 0.5 +
            Math.sin(waveTime + j * 0.5 + i) * (h * 0.28 * waveDist) +
            Math.cos(waveTime * 0.75 + j * 0.25) * (h * 0.16 * waveDist);

          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        const waveGrad = ctx.createLinearGradient(0, 0, w, h);
        waveGrad.addColorStop(0, `rgba(255, 255, 255, ${0.5 + i * 0.1})`);
        waveGrad.addColorStop(0.35, `rgba(56, 189, 248, ${0.4 + i * 0.1})`);
        waveGrad.addColorStop(0.7, `rgba(0, 136, 204, ${0.35 + i * 0.1})`);
        waveGrad.addColorStop(1, `rgba(0, 0, 0, 0.45)`);

        ctx.fillStyle = waveGrad;
        ctx.fill();
      }

      ctx.restore();

      // Top Specular Gloss Highlight Sheen
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const highlightGrad = ctx.createLinearGradient(0, 0, w, 0);
      const highlightPos = (Math.sin(time * 0.9) + 1) / 2;
      highlightGrad.addColorStop(Math.max(0, highlightPos - 0.25), 'rgba(255, 255, 255, 0)');
      highlightGrad.addColorStop(highlightPos, 'rgba(255, 255, 255, 0.75)');
      highlightGrad.addColorStop(Math.min(1, highlightPos + 0.25), 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = highlightGrad;
      ctx.fillRect(0, 0, w, 4 * dpr);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [colorBack, colorTint, speed, repetition, distortion, scale]);

  return (
    <div
      className={cn('absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-[inherit]', className)}
      style={style}
    >
      <canvas ref={canvasRef} className="w-full h-full block rounded-[inherit]" />
    </div>
  );
});

LiquidMetal.displayName = 'LiquidMetal';

export interface LiquidMetalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const LiquidMetalButton = forwardRef<
  HTMLButtonElement,
  LiquidMetalButtonProps
>(
  (
    {
      children,
      icon,
      size = 'md',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: 'py-2 px-4 gap-2 text-xs',
      md: 'py-3 px-6 gap-2.5 text-sm',
      lg: 'py-3.5 px-8 gap-3 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'relative group cursor-pointer border-none bg-transparent p-0 outline-none transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none',
          className
        )}
        {...props}
      >
        {/* Outer Liquid Metal Flowing Border Container */}
        <div className="relative rounded-full overflow-hidden p-[2px] shadow-[0_4px_20px_rgba(14,165,233,0.35),0_1px_4px_rgba(14,165,233,0.2)] hover:shadow-[0_6px_30px_rgba(14,165,233,0.6),0_2px_8px_rgba(14,165,233,0.4)] transition-all duration-300">
          
          {/* Dynamic Liquid Metal Flowing Border Canvas */}
          <LiquidMetal
            colorBack="#001F33"
            colorTint="#0EA5E9"
            speed={0.8}
            repetition={4}
            distortion={0.3}
            scale={1.2}
            className="absolute inset-0 z-0 rounded-full"
          />

          {/* Inner Obsidian Black Pill Body (Exact Screenshot Look) */}
          <div
            className={cn(
              'relative z-10 rounded-full flex items-center justify-center font-extrabold tracking-wide overflow-hidden transition-colors duration-200',
              'bg-[#0F172A] text-white keep-white',
              sizeStyles[size]
            )}
          >
            {/* Subtle Top Glass Meniscus Highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full z-10 bg-gradient-to-b from-white/15 via-white/5 to-transparent" />
            
            {/* Inner Dark Pill Rim Shadow */}
            <div className="pointer-events-none absolute inset-0 rounded-full z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.8)]" />

            {/* Sweeping Specular Lens Light Beam on Hover */}
            <div className="pointer-events-none absolute -inset-full top-0 w-1/2 h-full z-20 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[350%] transition-transform duration-1000 ease-out" />

            {/* Icon */}
            {icon && (
              <span className="relative z-30 text-accent group-hover:scale-110 transition-transform stroke-[2.5]">
                {icon}
              </span>
            )}

            {/* Bold White Text (Matching Screenshot) */}
            <span className="relative z-30 text-white font-extrabold uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              {children}
            </span>
          </div>
        </div>
      </button>
    );
  }
);

LiquidMetalButton.displayName = 'LiquidMetalButton';

export default LiquidMetalButton;
